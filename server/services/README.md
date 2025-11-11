# 🧠 Price Prediction Service with Prophet

This module implements a **price prediction service** using **Facebook Prophet**, with database persistence and interactive visualization through **Plotly**.  

The service can be executed directly or accessed via the integrated **`/predictions/`** FastAPI endpoint.

---

## 🚀 Running the Prediction Service Manually

The script can be executed directly from the `server/services` folder using Python’s `-m` option to ensure relative paths are respected.

### 1 Install dependencies

```bash
pip install -r server/requirements.txt
```

```bash
cd server/services
python -m prediction_service
```

This will execute the example configured at the end of the file:

```python
if __name__ == "__main__":
    result = predict_prices("Aguacate Común", months_ahead=6)
    print(result)
```

##🧩 Expected Output
* The existence of the CSV file is verified.
* The product’s price data is loaded and cleaned.
* A Prophet model is trained or loaded from saved_models/.
* If a saved model exists, its graph is also reused.
* Price predictions for the next 6 months are generated.
* Predictions are saved into the database (Predicciones).
* An interactive HTML plot is created at:

```bash
server/data/prediccion_<nombre_producto>.html
```

Model performance metrics are printed in the terminal:

```makefile
MAE=145.32, RMSE=182.47, MAPE=12.3%
Predicciones guardadas correctamente.
```

## 🌐 Using the /predictions/ Endpoint (FastAPI)

The prediction service can also be executed through the API endpoint:

```bash
GET /predictions/
```

Example Request
```bash
http://127.0.0.1:8000/predictions/?product_name=Aguacate%20Común&months_ahead=6
```
### Notes
* A secure relative path based on __file__ is used, so there is no need to modify local paths.
* Prophet models are saved in:

```bash
server/services/saved_models/<product>_prophet.pkl
```

* Interactive graphs are generated with Plotly and saved in .html format.
* If a prediction record already exists, the system skips it to avoid duplicates.