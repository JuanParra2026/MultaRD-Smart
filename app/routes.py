"""
Rutas y controladores web de la aplicación Flask MultaRD Smart.
Define endpoints para vistas HTML, API RESTful de multas, catálogo de tarifas y exportación.
"""

import os
import json
import csv
from io import StringIO
from datetime import datetime
from flask import Blueprint, render_template, request, jsonify, current_app, Response, send_file

bp = Blueprint("main", __name__)

def get_data_filepath(filename):
    data_dir = current_app.config.get("DATA_DIR", os.path.join(os.path.dirname(__file__), "data"))
    return os.path.join(data_dir, filename)

def load_json_file(filename, default=None):
    filepath = get_data_filepath(filename)
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default or []
    return default or []

def save_json_file(filename, data):
    filepath = get_data_filepath(filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# ==========================================
# RUTAS DE INTERFAZ DE USUARIO (VISTAS)
# ==========================================

@bp.route("/")
def index():
    """Renderiza la vista principal de la aplicación."""
    tarifas = load_json_file("tarifas.json", [])
    multas = load_json_file("multas_iniciales.json", [])
    return render_template("index.html", tarifas=tarifas, multas=multas)

# ==========================================
# RUTAS DE API REST (ENDPOINTS)
# ==========================================

@bp.route("/api/health", methods=["GET"])
def health_check():
    """Verifica el estado del servicio."""
    return jsonify({
        "status": "success",
        "app": "MultaRD Smart API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "mode": "Flask / Python"
    }), 200

@bp.route("/api/info", methods=["GET"])
def app_info():
    """Información general y metadatos de la plataforma."""
    return jsonify({
        "nombre": "MultaRD Smart",
        "tipo": "Sistema de Gestión y Cálculo de Infracciones de Tránsito",
        "finalidad": "Demostrativo, educativo y de gestión y fiscalización vial",
        "pais_referencia": "República Dominicana (RD$)",
        "stack": ["Python 3", "Flask", "Jinja2", "Pandas", "JavaScript ES6+", "HTML5", "CSS3 Custom Properties"],
        "modulos": ["Dashboard", "Calculadora", "Historial", "Estadísticas", "AI Insights", "Catálogo Tarifas", "Exportador"]
    }), 200

@bp.route("/api/tarifas", methods=["GET"])
def get_tarifas():
    """Retorna el catálogo oficial simulado de tarifas de infracción."""
    tarifas = load_json_file("tarifas.json", [])
    return jsonify({"status": "success", "count": len(tarifas), "data": tarifas}), 200

@bp.route("/api/multas", methods=["GET"])
def get_multas():
    """Retorna la lista de multas registradas en el backend."""
    multas = load_json_file("multas_iniciales.json", [])
    return jsonify({"status": "success", "count": len(multas), "data": multas}), 200

@bp.route("/api/multas", methods=["POST"])
def create_multa():
    """Registra una nueva multa en el sistema."""
    data = request.get_json() or {}
    
    # Validaciones mínimas
    required_fields = ["conductor", "cedula", "placa", "infraccion", "montoBase"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"status": "error", "message": f"El campo '{field}' es obligatorio."}), 400

    multas = load_json_file("multas_iniciales.json", [])
    
    # Calcular correlativo si no existe
    nuevo_id = data.get("id")
    if not nuevo_id:
        num = len(multas) + 1
        nuevo_id = f"MRD-2026-{num:04d}"

    monto_base = float(data.get("montoBase", 0))
    recargo_porc = float(data.get("recargoPorc", 0))
    descuento_porc = float(data.get("descuentoPorc", 0))
    
    recargo_val = monto_base * (recargo_porc / 100.0)
    descuento_val = monto_base * (descuento_porc / 100.0)
    total = max(0, round(monto_base + recargo_val - descuento_val, 2))

    nueva_multa = {
        "id": nuevo_id,
        "fecha": data.get("fecha") or datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "conductor": data.get("conductor"),
        "cedula": data.get("cedula"),
        "placa": data.get("placa"),
        "tipoVehiculo": data.get("tipoVehiculo", "Automóvil Sedán"),
        "lugar": data.get("lugar", "Santo Domingo, DN"),
        "infraccionId": data.get("infraccionId", "INF-001"),
        "infraccion": data.get("infraccion"),
        "gravedad": data.get("gravedad", "Moderada"),
        "montoBase": monto_base,
        "recargoPorc": recargo_porc,
        "descuentoPorc": descuento_porc,
        "total": total,
        "estado": data.get("estado", "Pendiente"),
        "oficial": data.get("oficial", "Agente de Guardia"),
        "notas": data.get("notas", "")
    }

    multas.append(nueva_multa)
    save_json_file("multas_iniciales.json", multas)

    return jsonify({"status": "success", "message": "Multa registrada exitosamente", "data": nueva_multa}), 201

@bp.route("/api/estadisticas", methods=["GET"])
def get_estadisticas():
    """Genera indicadores agregados y KPIs de gestión vial."""
    multas = load_json_file("multas_iniciales.json", [])
    
    total_multas = len(multas)
    total_recaudado = sum(m.get("total", 0) for m in multas if m.get("estado") == "Pagada")
    monto_pendiente = sum(m.get("total", 0) for m in multas if m.get("estado") == "Pendiente")
    monto_total_emitido = sum(m.get("total", 0) for m in multas)
    
    conteo_estados = {}
    conteo_gravedad = {}
    conteo_infracciones = {}
    
    for m in multas:
        est = m.get("estado", "Desconocido")
        conteo_estados[est] = conteo_estados.get(est, 0) + 1
        
        grav = m.get("gravedad", "Moderada")
        conteo_gravedad[grav] = conteo_gravedad.get(grav, 0) + 1
        
        inf = m.get("infraccion", "Otra")
        conteo_infracciones[inf] = conteo_infracciones.get(inf, 0) + 1

    return jsonify({
        "status": "success",
        "totales": {
            "cantidad_multas": total_multas,
            "monto_total_emitido": monto_total_emitido,
            "total_recaudado": total_recaudado,
            "monto_pendiente": monto_pendiente,
            "promedio_multa": round(monto_total_emitido / total_multas, 2) if total_multas > 0 else 0
        },
        "distribucion_estados": conteo_estados,
        "distribucion_gravedad": conteo_gravedad,
        "top_infracciones": conteo_infracciones
    }), 200

@bp.route("/api/exportar/csv", methods=["GET"])
def exportar_csv():
    """Exporta todas las multas registradas en formato CSV."""
    multas = load_json_file("multas_iniciales.json", [])
    output = StringIO()
    writer = csv.writer(output)
    
    # Cabeceras
    headers = ["ID Multa", "Fecha", "Conductor", "Cédula", "Placa", "Tipo Vehículo", "Lugar", "Infracción", "Gravedad", "Monto Base (RD$)", "Recargo (%)", "Descuento (%)", "Total (RD$)", "Estado", "Oficial", "Notas"]
    writer.writerow(headers)
    
    for m in multas:
        writer.writerow([
            m.get("id"),
            m.get("fecha"),
            m.get("conductor"),
            m.get("cedula"),
            m.get("placa"),
            m.get("tipoVehiculo"),
            m.get("lugar"),
            m.get("infraccion"),
            m.get("gravedad"),
            m.get("montoBase"),
            m.get("recargoPorc"),
            m.get("descuentoPorc"),
            m.get("total"),
            m.get("estado"),
            m.get("oficial"),
            m.get("notas")
        ])
    
    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=multas_multard_smart.csv"}
    )

@bp.route("/api/exportar/json", methods=["GET"])
def exportar_json():
    """Exporta el dataset completo en formato JSON descargable."""
    multas = load_json_file("multas_iniciales.json", [])
    return jsonify(multas), 200, {"Content-Disposition": "attachment;filename=multas_multard_smart.json"}
