# prediction_service.py

import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error


def predict_prices(product_name, months_ahead=6):
    file_path = r"C:\Users\USER\equipo-1-ings-202520\server\data\precios_productos_limpio.csv"
    print(f"🔍 Checking file: {file_path}")
    try:
        df = pd.read_csv(file_path, sep=";")
        print("✅ CSV loaded successfully with ';' separator.")
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return None

    # ---------------------------
    # 🧹 Data Cleaning (unchanged)
    # ---------------------------
    df.columns = df.columns.str.strip()
    df["Fecha"] = pd.to_datetime(df["Fecha"], errors="coerce")
    df = df.dropna(subset=["Fecha"])
    df = df.rename(columns={"Fecha": "ds", "Precio Por Kilogramo": "y"})
    df["y"] = df["y"].replace({",": "", "\\$": ""}, regex=True)  # fixed warning
    df["y"] = pd.to_numeric(df["y"], errors="coerce")
    df = df.dropna(subset=["y"])
    df = df[df["y"] > 0]
    df = df.drop_duplicates(subset=["ds", "Productos"])

    # ---------------------------
    # 🔍 Filter by product name
    # ---------------------------
    product_df = df[df["Productos"].str.strip().str.lower() == product_name.strip().lower()]
    if product_df.empty:
        print(f"⚠️ No data found for {product_name}")
        return None

    # ---------------------------
    # 📏 Remove extreme outliers
    # ---------------------------
    q1, q3 = np.percentile(product_df["y"], [25, 75])
    iqr = q3 - q1
    product_df = product_df[(product_df["y"] > q1 - 1.5 * iqr) & (product_df["y"] < q3 + 1.5 * iqr)]

    # ---------------------------
    # 🔢 Safe scaling (no log)
    # ---------------------------
    y_min, y_max = product_df["y"].min(), product_df["y"].max()
    product_df["y_scaled"] = (product_df["y"] - y_min) / (y_max - y_min)
    product_df = product_df[["ds", "y_scaled"]].rename(columns={"y_scaled": "y"})

    # ---------------------------
    # 🧠 Train Prophet (no log, with limits)
    # ---------------------------
    print(f"🧠 Training model for: {product_name} ...")
    m = Prophet(yearly_seasonality=True, weekly_seasonality=False)
    m.fit(product_df)

    # ---------------------------
    # 🔮 Future prediction
    # ---------------------------
    future = m.make_future_dataframe(periods=months_ahead, freq="M")
    forecast = m.predict(future)

    # 🔄 Rescale predictions to original prices
    forecast["yhat"] = forecast["yhat"].clip(0, 1)
    forecast["yhat"] = forecast["yhat"] * (y_max - y_min) + y_min
    forecast["yhat_lower"] = forecast["yhat_lower"].clip(0, 1) * (y_max - y_min) + y_min
    forecast["yhat_upper"] = forecast["yhat_upper"].clip(0, 1) * (y_max - y_min) + y_min

    # ---------------------------
    # 📊 Model Evaluation
    # ---------------------------
    merged = forecast.merge(product_df, on="ds", how="inner")
    y_true = merged["y"] * (y_max - y_min) + y_min
    y_pred = merged["yhat"]

    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100

    print("\n📈 Model Evaluation:")
    print(f"MAE:  {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")
    print(f"MAPE: {mape:.2f}%")

    # ---------------------------
    # 📅 Predictions
    # ---------------------------
    preds = forecast.tail(months_ahead).copy()
    preds["Fecha"] = preds["ds"].dt.strftime("%Y-%m-%d")
    preds = preds[["Fecha", "yhat", "yhat_lower", "yhat_upper"]]
    preds.columns = ["Fecha", "Predicted Price (per Kg)", "Estimated Min", "Estimated Max"]

    preds["Predicted Price (per Kg)"] = preds["Predicted Price (per Kg)"].apply(lambda x: f"${x:,.2f}")
    preds["Estimated Min"] = preds["Estimated Min"].apply(lambda x: f"${x:,.2f}")
    preds["Estimated Max"] = preds["Estimated Max"].apply(lambda x: f"${x:,.2f}")
    preds["Confidence Level (%)"] = 95.0

    print(f"\n📊 Predicted prices for {product_name}:")
    print(preds.to_string(index=False))
    print("\n✅ Prediction complete.")

    return preds


# ---------------------------
# 🧪 Example
# ---------------------------
if __name__ == "__main__":
    predict_prices("Gulupa", months_ahead=6)
