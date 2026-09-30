"""
Inicializador y configuración de la aplicación Flask MultaRD Smart.
Configura rutas absolutas para plantillas y estáticos, garantizando compatibilidad en producción (Render/Gunicorn).
"""

import os
from flask import Flask

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

def create_app(test_config=None):
    # Crear y configurar la instancia de la aplicación con rutas absolutas
    app = Flask(
        __name__,
        instance_relative_config=True,
        template_folder=os.path.join(BASE_DIR, "templates"),
        static_folder=os.path.join(BASE_DIR, "static")
    )

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "multard-smart-secret-key-2026"),
        DATA_DIR=os.path.join(BASE_DIR, "data"),
    )

    if test_config is not None:
        app.config.from_mapping(test_config)

    # Registrar rutas y controladores
    from . import routes
    app.register_blueprint(routes.bp)

    return app

# Instancia WSGI exportada para Gunicorn (web: gunicorn app:app)
app = create_app()
