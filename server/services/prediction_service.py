import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import holidays
import os, sys, joblib
from datetime import datetime

# Database imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Producto, PlazaMercado, Predicciones

# Folder to save/load models
MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODEL_DIR, exist_ok=True)

def predict_prices(product_name, months_ahead=6):
    file_path = r"C:\Users\Sofia\equipo-1-ings-202520\server\data\precios_productos_limpio.csv"
    print(f" Verificando archivo: {file_path}")

    try:
        df = pd.read_csv(file_path, sep=";")
        print(" Archivo CSV cargado correctamente.")
    except Exception as e:
        print(f" Error al cargar el CSV: {e}")
        return {"error": "No se pudo cargar la base de datos de precios."}

    # Basic data cleaning
    df.columns = df.columns.str.strip()
    df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce")
    df = df.dropna(subset=["Fecha"])
    df = df.rename(columns={"Fecha": "ds", "Precio Por Kilogramo": "y"})
    df["y"] = df["y"].replace({",": "", "\\$": ""}, regex=True)
    df["y"] = pd.to_numeric(df["y"], errors="coerce")
    df = df.dropna(subset=["y"])
    df = df[df["y"] > 0]
    df = df.drop_duplicates(subset=["ds", "Productos"])

    # Verify product existence
    available_products = df["Productos"].dropna().unique().tolist()
    if product_name.strip().lower() not in [p.strip().lower() for p in available_products]:
        return {
            "error": f"No se encontró información histórica para el producto '{product_name}'. "
                     f"Verifica el nombre o selecciona otro producto."
        }

    product_df = df[df["Productos"].str.strip().str.lower() == product_name.strip().lower()]

    # Remove outliers
    q1, q3 = np.percentile(product_df["y"], [25, 75])
    iqr = q3 - q1
    product_df = product_df[(product_df["y"] > q1 - 1.5 * iqr) & (product_df["y"] < q3 + 1.5 * iqr)]

    # Scale y between 0 and 1
    y_min, y_max = product_df["y"].min(), product_df["y"].max()
    product_df["y_scaled"] = (product_df["y"] - y_min) / (y_max - y_min)
    product_df = product_df[["ds", "y_scaled"]].rename(columns={"y_scaled": "y"})

    # Handle Colombian holidays
    co_holidays = holidays.CO(years=range(2013, 2026))
    holidays_df = pd.DataFrame([{"ds": date, "holiday": name} for date, name in co_holidays.items()])

    # Verify if model exists
    model_path = os.path.join(MODEL_DIR, f"{product_name.lower().replace(' ', '_')}_prophet.pkl")
    model_loaded = False

    if os.path.exists(model_path):
        try:
            m = joblib.load(model_path)
            print(f" Modelo cargado desde {model_path}")
            model_loaded = True
        except Exception as e:
            print(f" No se pudo cargar el modelo guardado: {e}. Se entrenará uno nuevo.")

    # Train if no model loaded
    if not model_loaded:
        print(f" Entrenando nuevo modelo Prophet para: {product_name}")
        m = Prophet(
            yearly_seasonality=10,
            weekly_seasonality=False,
            daily_seasonality=False,
            changepoint_prior_scale=0.1,
            holidays=holidays_df,
            interval_width=0.95
        )
        m.fit(product_df)

        # Save the model
        try:
            joblib.dump(m, model_path)
            print(f" Modelo guardado en {model_path}")
        except Exception as e:
            print(f" No se pudo guardar el modelo: {e}")

    # Future predictions
    future = m.make_future_dataframe(periods=months_ahead, freq="M")
    forecast = m.predict(future)

    # Rescale predictions back to original
    forecast["yhat"] = forecast["yhat"].clip(0, 1) * (y_max - y_min) + y_min
    forecast["yhat_lower"] = forecast["yhat_lower"].clip(0, 1) * (y_max - y_min) + y_min
    forecast["yhat_upper"] = forecast["yhat_upper"].clip(0, 1) * (y_max - y_min) + y_min

    # Evaluate model performance on historical data
    merged = forecast.merge(product_df, on="ds", how="inner")
    y_true = merged["y"] * (y_max - y_min) + y_min
    y_pred = merged["yhat"]
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

    print(f" MAE={mae:.2f}, RMSE={rmse:.2f}, MAPE={mape:.2f}%")

    # Select future predictions
    preds = forecast.tail(months_ahead).copy()
    preds["Fecha"] = preds["ds"].dt.strftime("%Y-%m-%d")
    preds = preds[["Fecha", "yhat", "yhat_lower", "yhat_upper"]]
    preds.columns = ["Fecha", "Precio estimado (por Kg)", "Mínimo estimado", "Máximo estimado"]
    preds["Nivel de confianza (%)"] = 95.0

    # Visual formatting
    for col in ["Precio estimado (por Kg)", "Mínimo estimado", "Máximo estimado"]:
        preds[col] = preds[col].apply(lambda x: f"${x:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

    # Save predictions to DB
    db = SessionLocal()
    try:
        product = db.query(Producto).filter(Producto.nombre.ilike(product_name)).first()
        if not product:
            return {"error": f"No se encontró el producto '{product_name}' en la base de datos."}

        plazas = db.query(PlazaMercado).all()
        if not plazas:
            return {"error": "No hay plazas registradas en la base de datos."}

        for plaza in plazas:
            for _, row in preds.iterrows():
                fecha_pred = datetime.strptime(row['Fecha'], "%Y-%m-%d").date()

                # Verifiy if prediction exists
                existente = db.query(Predicciones).filter_by(
                    producto_id=product.producto_id,
                    plaza_id=plaza.plaza_id,
                    fecha_prediccion=fecha_pred
                ).first()

                if existente:
                    print(f"ℹ Predicción ya existente para {product_name}, {plaza.nombre}, fecha {fecha_pred}. Se omite.")
                    continue  # dont insert duplicates

                # If it doesn't exist, create new prediction
                price = float(row['Precio estimado (por Kg)'].replace('$', '').replace('.', '').replace(',', '.'))
                pred = Predicciones(
                    producto_id=product.producto_id,
                    plaza_id=plaza.plaza_id,
                    precio_predicho=price,
                    fecha_prediccion=fecha_pred,
                    nivel_confianza=row["Nivel de confianza (%)"],
                    fecha_creacion=datetime.now(),
                    fecha_actualizacion=datetime.now()
                )
                db.add(pred)

        db.commit()
        print(f" Predicciones guardadas correctamente.")
    except Exception as e:
        db.rollback()
        print(f" Error interno al guardar predicciones: {type(e).__name__} - {e}")
        return {"error": "Ocurrió un problema al registrar las predicciones. Intenta nuevamente más tarde."}

    finally:
        db.close()

    return preds.to_dict(orient="records")

# Execute example prediction
if __name__ == "__main__":
    result = predict_prices("Harina De Trigo", months_ahead=6)
    print(result)