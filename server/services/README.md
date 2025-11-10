# Ejecución del servicio de predicción
El script puede ejecutarse directamente desde la carpeta server/services utilizando la opción -m de Python para respetar las rutas relativas:

* Instala las dependencias:
```bash
pip install -r requirements.txt
```

```bash
cd server/services
python -m prediction_service
```

Esto ejecutará el ejemplo configurado al final del archivo:

```python
if __name__ == "__main__":
    result = predict_prices("Aguacate Común", months_ahead=6)
    print(result)
```

## Resultado esperado
1. Se verifica la existencia del archivo CSV.
2. Se carga y limpia la información del producto solicitado.
3. Se entrena o carga un modelo Prophet desde saved_models/. Si se recupera un modelo, se realiza lo mismo con su gráfico de predicción
4. Se generan predicciones a 6 meses.
5. Las predicciones se guardan en la base de datos (Predicciones).
6. Se genera una gráfica interactiva HTML en:

```bash
server/data/prediccion_<nombre_producto>.html
```

7. En la terminal se imprimen las métricas de rendimiento del modelo:

```makefile
MAE=145.32, RMSE=182.47, MAPE=12.3%
Predicciones guardadas correctamente.
```

### Notas
* Se usa ruta relativa segura basada en __file__, por lo que no hay que modificar rutas locales.

* Los modelos Prophet se guardan en:

```bash
server/services/saved_models/<producto>_prophet.pkl
```

* Las gráficas interactivas se generan con Plotly y se guardan en formato .html.

* Si el registro de una predicción ya existe, el sistema la omite para evitar duplicados.