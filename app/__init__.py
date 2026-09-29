"""
Inicializador y configuración de la aplicación Flask MultaRD Smart.
"""

import os
from flask import Flask

def create_app(test_config=None):
    # Crear y configurar la instancia de la aplicación
    app = Flask(
        __name__,
        instance_relative_config=True,
        template_folder="templates",
        static_folder="static"
    )

    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY", "dev-secret-multard-2026-key"),
        DATA_DIR=os.path.join(os.path.dirname(__file__), "data"),
    )

    if test_config is not None:
        app.config.from_mapping(test_config)

    # Registrar rutas y controladores
    from . import routes
    app.register_blueprint(routes.bp)

    return app
