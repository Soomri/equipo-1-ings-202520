# prediction_service.py

import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import holidays
import os, sys
from datetime import datetime

# Database imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Producto, PlazaMercado, Predicciones


def predict_prices(product_name, months_ahead=6):
    file_path = r"C:\Users\USER\equipo-1-ings-202520\server\data\precios_productos_limpio.csv"
    print(f"🔍 Verificando archivo: {file_path}")
    try:
        df = pd.read_csv(file_path, sep=";")
        print("✅ Archivo CSV cargado correctamente con separador ';'.")
    except Exception as e:
        print(f"❌ Error al cargar el CSV: {e}")
        return {"error": "No se pudo cargar la base de datos de precios."}

    # 🧹 Data cleaning
    df.columns = df.columns.str.strip()
    df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce")
    df = df.dropna(subset=["Fecha"])
    df = df.rename(columns={"Fecha": "ds", "Precio Por Kilogramo": "y"})
    df["y"] = df["y"].replace({",": "", "\\$": ""}, regex=True)
    df["y"] = pd.to_numeric(df["y"], errors="coerce")
    df = df.dropna(subset=["y"])
    df = df[df["y"] > 0]
    df = df.drop_duplicates(subset=["ds", "Productos"])

    # 🧾 Product existence check
    available_products = df["Productos"].dropna().unique().tolist()
    if product_name.strip().lower() not in [p.strip().lower() for p in available_products]:
        print(f"⚠️ No hay datos para {product_name}")
        return {
            "error": f"No se encontró información histórica para el producto '{product_name}'. "
                     f"Verifica que el nombre esté escrito correctamente o selecciona otro producto disponible."
        }

    # 📊 Filter dataset by product name
    product_df = df[df["Productos"].str.strip().str.lower() == product_name.strip().lower()]

    # 🧮 Remove outliers (IQR method)
    q1, q3 = np.percentile(product_df["y"], [25, 75])
    iqr = q3 - q1
    product_df = product_df[(product_df["y"] > q1 - 1.5 * iqr) & (product_df["y"] < q3 + 1.5 * iqr)]

    # ⚙️ Safe scaling for Prophet model
    y_min, y_max = product_df["y"].min(), product_df["y"].max()
    product_df["y_scaled"] = (product_df["y"] - y_min) / (y_max - y_min)
    product_df = product_df[["ds", "y_scaled"]].rename(columns={"y_scaled": "y"})

    # 📅 Add Colombian holidays
    co_holidays = holidays.CO(years=range(2013, 2025))
    holidays_df = pd.DataFrame([{"ds": date, "holiday": name} for date, name in co_holidays.items()])

    # 🤖 Prophet model parameters
    print(f"🧠 Entrenando modelo Prophet para: {product_name} ...")
    m = Prophet(
        yearly_seasonality=10,       # yearly seasonality level
        weekly_seasonality=False,    # weekly seasonality disabled
        daily_seasonality=False,     # daily seasonality disabled
        changepoint_prior_scale=0.1, # flexibility in trend changes
        holidays=holidays_df,        # include Colombian holidays
        interval_width=0.95          # 95% confidence interval
    )
    m.fit(product_df)

    # 🔮 Generate future predictions
    future = m.make_future_dataframe(periods=months_ahead, freq="M")
    forecast = m.predict(future)

    # 🔁 Rescale predictions back to original values
    forecast["yhat"] = forecast["yhat"].clip(0, 1)
    forecast["yhat"] = forecast["yhat"] * (y_max - y_min) + y_min
    forecast["yhat_lower"] = forecast["yhat_lower"].clip(0, 1) * (y_max - y_min) + y_min
    forecast["yhat_upper"] = forecast["yhat_upper"].clip(0, 1) * (y_max - y_min) + y_min

    # 📏 Model evaluation
    merged = forecast.merge(product_df, on="ds", how="inner")
    y_true = merged["y"] * (y_max - y_min) + y_min
    y_pred = merged["yhat"]

    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

    print("\n📈 Evaluación del modelo:")
    print(f"MAE:  {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")
    print(f"MAPE: {mape:.2f}%")

    # 🗓️ Predictions summary
    preds = forecast.tail(months_ahead).copy()
    preds["Fecha"] = preds["ds"].dt.strftime("%Y-%m-%d")
    preds = preds[["Fecha", "yhat", "yhat_lower", "yhat_upper"]]
    preds.columns = ["Fecha", "Precio estimado (por Kg)", "Mínimo estimado", "Máximo estimado"]
    preds["Nivel de confianza (%)"] = 95.0

    # 💰 Format price columns with thousand separator and 2 decimals
    for col in ["Precio estimado (por Kg)", "Mínimo estimado", "Máximo estimado"]:
        preds[col] = preds[col].apply(lambda x: f"${x:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))

    print(f"\n📊 Predicciones para {product_name}:")
    print(preds.to_string(index=False))
    print("\n✅ Predicción completa.")

    # 💾 Save predictions to database
    db = SessionLocal()
    try:
        product = db.query(Producto).filter(Producto.nombre.ilike(product_name)).first()
        if not product:
            print(f"⚠️ Producto '{product_name}' no encontrado en la base de datos.")
            return

        plazas = db.query(PlazaMercado).all()
        if not plazas:
            print("⚠️ No hay plazas registradas en la base de datos.")
            return

        for plaza in plazas:
            for _, row in preds.iterrows():
                price = float(row['Precio estimado (por Kg)'].replace('$', '').replace('.', '').replace(',', '.'))
                pred = Predicciones(
                    producto_id=product.producto_id,
                    plaza_id=plaza.plaza_id,
                    precio_predicho=price,
                    fecha_prediccion=datetime.strptime(row['Fecha'], "%Y-%m-%d").date(),
                    nivel_confianza=row["Nivel de confianza (%)"],
                    fecha_creacion=datetime.now(),
                    fecha_actualizacion=datetime.now()
                )
                db.add(pred)
        db.commit()
        print(f"💾 Predicciones guardadas correctamente en la base de datos.")
    except Exception as e:
        print(f"❌ Error al guardar predicciones: {e}")
        db.rollback()
    finally:
        db.close()

    return preds.to_dict(orient="records")


# Example run
if __name__ == "__main__":
    result = predict_prices("Harina De Trigo", months_ahead=6)
    print(result)
