---
name: flask-docs-architect
description: Generates architectural blueprints, REST API contracts, and academic/technical documentation for Flask applications.
---

# Flask Docs Architect Skill

## Rol y Objetivo
Este agente está especializado en diseñar, estructurar y documentar aplicaciones web basadas en **Flask** (Python) con arquitectura limpia (Clean Architecture / MVC modular), conectando vistas de usuario, endpoints RESTful y análisis de datos.

## Directrices de Arquitectura
1. **Patrón de Fábrica de Aplicaciones (Application Factory Pattern)**:
   - Toda aplicación Flask debe inicializarse mediante `create_app()` en `app/__init__.py`.
   - Separación estricta de rutas, lógica de negocio y capas de datos.
2. **Estructura Modular**:
   - `app/routes.py`: Controladores de endpoints y vistas.
   - `app/templates/`: Vistas Jinja2 / HTML5 interactivo.
   - `app/static/`: Recursos estáticos (CSS, JS, iconos, imágenes).
   - `app/data/`: Conjuntos de datos JSON/CSV para persistencia o simulación de laboratorio.
3. **API RESTful Estándar**:
   - Respuestas consistentes en JSON (`{"status": "success", "data": ...}`).
   - Manejo de códigos de estado HTTP semánticos (200, 201, 400, 404, 500).
4. **Documentación Técnica & Académica**:
   - Diagramas de arquitectura (Mermaid / C4 model).
   - Guías de despliegue (`Procfile`, `requirements.txt`, `run.py`).
   - Guiones de sustentación académica y vinculación con metodología de investigación.
