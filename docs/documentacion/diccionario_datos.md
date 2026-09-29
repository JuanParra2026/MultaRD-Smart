# 📖 Diccionario de Datos y Esquemas | MultaRD Smart

Este documento describe la estructura, tipos de datos y restricciones de las entidades del sistema.

---

## 1. Entidad: Infracción / Tarifa (`tarifas.json`)

| Campo | Tipo | Requerido | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Sí | Identificador único de la falta | `"INF-001"` |
| `nombre` | String | Sí | Denominación legal resumida | `"Exceso de Velocidad"` |
| `categoria` | String | Sí | Agrupador temático | `"Velocidad y Tránsito"` |
| `montoBase` | Number | Sí | Importe base en pesos (RD$) | `2500` |
| `gravedad` | String | Sí | Nivel de severidad | `"Grave"` |
| `puntosLicencia`| Number | Sí | Puntos descontables simulados | `4` |
| `descripcion` | String | No | Detalle de la infracción | `"Superar límite..."` |

---

## 2. Entidad: Multa / Acta (`multas_iniciales.json` / `estadisticas_viales.csv`)

| Campo | Tipo | Requerido | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- | :--- |
| `id` | String | Sí | Código de acta consecutivo | `"MRD-2026-0001"` |
| `fecha` | String | Sí | Fecha y hora de emisión (ISO) | `"2026-09-15 08:30:00"` |
| `conductor` | String | Sí | Nombre y apellidos del infractor | `"Carlos Mendoza"` |
| `cedula` | String | Sí | Documento de identidad | `"001-1827364-9"` |
| `placa` | String | Sí | Matrícula del vehículo | `"A-849201"` |
| `tipoVehiculo`| String | Sí | Categoría del automotor | `"Automóvil Sedán"` |
| `lugar` | String | Sí | Ubicación o intersección vial | `"Av. 27 de Febrero"` |
| `total` | Number | Sí | Importe total liquidado (RD$) | `3300.0` |
| `estado` | String | Sí | Estado del cobro | `"Pendiente"` / `"Pagada"` |
