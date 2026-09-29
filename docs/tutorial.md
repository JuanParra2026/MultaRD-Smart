# 📖 Tutorial y Guía de Uso del Sistema | MultaRD Smart

![Banner MultaRD Smart](images/banner_multard.png)

Bienvenido a **MultaRD Smart**. Este tutorial le guiará a través de todas las funcionalidades del sistema.

---

## 1. Puesta en Marcha del Sistema

### Opción A: Servidor Flask en Python (Recomendada para Proyecto Completo)
1. Abra la terminal en la raíz del proyecto.
2. Inicie el servidor:
   ```powershell
   .\.venv\Scripts\python.exe run.py
   ```
3. Ingrese desde su navegador a: **`http://127.0.0.1:5000`**

### Opción B: Ejecución Rápida de Frontend (Navegador Directo)
- Simplemente haga doble clic en el archivo **`index.html`** para abrir la interfaz en modo cliente directo con LocalStorage.

---

## 2. Navegación por Módulos

### 📊 1. Dashboard Principal
![Dashboard MultaRD Smart](images/dashboard_preview.png)
- Consulte el resumen de multas registradas, montos totales, recaudación efectiva y monto pendiente.
- Analice los gráficos de barras y donas con la distribución de infracciones.

### 🧮 2. Calculadora y Registro de Infracción
![Calculadora MultaRD Smart](images/calculadora_multas.png)
1. Diríjase a la pestaña **Calculadora / Nueva Multa**.
2. Ingrese los datos del infractor (Nombre, Cédula con guiones, Placa, Tipo de vehículo y Ubicación).
3. Seleccione la infracción del catálogo desplegable.
4. Ajuste los porcentajes de **Recargo** (por mora o reincidencia) o **Descuento** (por pronto pago).
5. Observe el cálculo en tiempo real en la tarjeta lateral.
6. Haga clic en **Registrar Infracción** para guardarla e imprimir el comprobante oficial.

### 📋 3. Historial y Búsqueda Inteligente
- Escriba en la barra de búsqueda para filtrar instantáneamente por nombre, cédula o placa.
- Filtre por estado (*Pendiente, Pagada, En revisión, Anulada*) o gravedad.
- Haga clic en el botón de **Imprimir / Ver Comprobante** para generar el acta formal en PDF.

### 🧠 4. Centro de Análisis de Datos (AI Insights)
- Observe los patrones automáticos detectados: infracción más común, día crítico de la semana y vehículo predominante.

### 📓 5. Módulo de Análisis de Datos (Jupyter Notebook)
- Abra `Analisis_Multas_Transito.ipynb` en Jupyter Notebook o VS Code para ejecutar el análisis estadístico de multas viales con **Pandas** y generar gráficos descriptivos.
