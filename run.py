"""
Script principal de ejecución para la aplicación MultaRD Smart / Sistema de Gestión de Multas.
Inicia el servidor web Flask en el puerto 5000.
"""

import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    print("==================================================")
    print("MultaRD Smart - Sistema de Gestion de Multas")
    print(f"Servidor iniciado en: http://127.0.0.1:{port}")
    print(f"Modo Debug: {debug_mode}")
    print("==================================================")
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
