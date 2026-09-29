# 🚗 Guía de Cálculo, Tarifas y Fiscalización Vial | MultaRD Smart

## 1. Visión y Propósito del Sistema
**MultaRD Smart** implementa un modelo sistemático y transparente para la fiscalización, emisión, cálculo de tarifas y análisis de infracciones de tránsito en la República Dominicana (en moneda oficial RD$).

---

## 2. Modelo Matemático de Liquidación de Multas

El cálculo de cada acta de infracción se realiza en tiempo real a través del siguiente algoritmo:

$$\text{Total Liquidado (RD\$)} = \max\Big(0, \text{Monto Base} \times \Big(1 + \frac{\% \text{ Recargo}}{100}\Big) - \Big(\text{Monto Base} \times \frac{\% \text{ Descuento}}{100}\Big)\Big)$$

### Parámetros del Cálculo:
- **Monto Base:** Tarifa estandarizada según el catálogo de infracciones tipificadas (`app/data/tarifas.json`).
- **Recargo (%):** Incremento por morosidad, nocturnidad o reincidencia comprobada del conductor.
- **Descuento (%):** Deducción por pronto pago voluntario (dentro de los primeros 5 a 15 días hábiles).

---

## 3. Escala de Gravedad y Puntos de Licencia

| Nivel de Gravedad | Monto Base Promedio (RD$) | Puntos Licencia | Ejemplos de Infracción |
| :--- | :--- | :--- | :--- |
| **Leve** | RD$ 1,500 - RD$ 1,800 | 1 | Estacionamiento indebido, rampa obstruida |
| **Moderada** | RD$ 1,500 - RD$ 2,000 | 2 | No portar cinturón de seguridad, falta de luces |
| **Grave** | RD$ 2,000 - RD$ 3,500 | 3 - 4 | Exceso de velocidad, uso de celular al volante, marbete vencido |
| **Muy Grave** | RD$ 3,000 - RD$ 10,000 | 6 - 10 | Luz roja, vía contraria, conducción bajo efectos del alcohol |

---

## 4. Pipeline de Análisis de Datos de Tránsito

El sistema incorpora un flujo de analítica de datos en Python (`Analisis_Multas_Transito.ipynb` y `app/routes.py`):
1. **Ingesta de Actas:** Carga de registros desde el backend o dataset histórico `app/data/estadisticas_viales.csv`.
2. **KPIs en Vivo:** Total emitido, porcentaje de cobro efectivo, tasa de morosidad y promedio por multa.
3. **Análisis de Reincidencia:** Detección automática por número de cédula/licencia y matrícula de vehículo.
4. **Exportación Abierta:** Descarga de reportes consolidados en formatos universales (CSV y JSON).
