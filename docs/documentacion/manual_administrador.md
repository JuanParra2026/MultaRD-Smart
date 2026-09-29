# 🛠️ Manual de Administración del Sistema | MultaRD Smart

## 1. Configuración del Servidor Flask
- **Entorno de ejecución**: Python 3.10+
- **Fichero de arranque**: `run.py`
- **Variables de entorno opcionales**:
  - `PORT`: Puerto de escucha HTTP (por defecto `5000`).
  - `FLASK_DEBUG`: Activar/Desactivar recarga en caliente (`True`/`False`).
  - `SECRET_KEY`: Llave de sesión criptográfica.

## 2. Gestión del Catálogo de Tarifas
Las tarifas base se encuentran en `app/data/tarifas.json`. Para añadir o modificar categorías e importes, edite la estructura JSON manteniendo el esquema de identificadores `INF-XXX`.

## 3. Políticas de Copia de Seguridad
- El módulo de Backup permite exportar todos los datos en formato JSON y CSV.
- Se recomienda realizar respaldos periódicos antes de limpiar datos locales.
