#!/usr/bin/env python3
"""Extrae títulos y notas del expositor de index.html a NOTAS-EXPOSITOR.md.

Se genera desde la presentación para que las notas nunca se desincronicen
del contenido proyectado. Uso:  python3 generar-notas.py
"""
import html
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
ORIGEN = BASE / "index.html"
DESTINO = BASE / "NOTAS-EXPOSITOR.md"

SECCION = re.compile(r'<section class="marco">(.*?)</section>', re.S)
TITULO = re.compile(r'<h[12] class="h[12]"[^>]*>(.*?)</h[12]>', re.S)
CINTILLO = re.compile(r'<div class="cintillo">(.*?)</div>', re.S)
NOTA = re.compile(r'<div class="notas-fuente">(.*?)</div>', re.S)
NUMERO = re.compile(r'<span>([0-9]{2} / 24|[ABC]1)</span>')


def texto_plano(fragmento: str) -> str:
    """Quita etiquetas y normaliza espacios de un fragmento de HTML."""
    limpio = re.sub(r"<[^>]+>", " ", fragmento)
    return re.sub(r"\s+", " ", html.unescape(limpio)).strip()


def main() -> int:
    if not ORIGEN.exists():
        print(f"No se encontró {ORIGEN}", file=sys.stderr)
        return 1

    fuente = ORIGEN.read_text(encoding="utf-8")
    secciones = SECCION.findall(fuente)
    if not secciones:
        print("No se encontraron diapositivas en index.html", file=sys.stderr)
        return 1

    lineas = [
        "# Notas del expositor",
        "",
        "**Del aviso a la acción** · Jalisco Alerta + SAI Jalisco",
        "",
        "> Archivo generado automáticamente desde `index.html` con `generar-notas.py`.",
        "> Para editar una nota, cámbiala en el bloque `notas-fuente` de la diapositiva",
        "> correspondiente y vuelve a ejecutar el script.",
        "",
        "Duración estimada: 15–20 minutos para las 24 diapositivas principales.",
        "Los tres anexos se usan solo para responder preguntas.",
        "",
        "---",
        "",
    ]

    for indice, seccion in enumerate(secciones, start=1):
        titulo_m = TITULO.search(seccion)
        titulo = texto_plano(titulo_m.group(1)) if titulo_m else "(sin título)"

        cintillo_m = CINTILLO.search(seccion)
        numero = "—"
        aviso = ""
        if cintillo_m:
            numero_m = NUMERO.search(cintillo_m.group(1))
            if numero_m:
                numero = numero_m.group(1)
            partes = texto_plano(cintillo_m.group(1)).split(numero)
            aviso = partes[0].strip() if partes else ""

        nota_m = NOTA.search(seccion)
        nota = texto_plano(nota_m.group(1)) if nota_m else "(sin notas)"

        lineas.append(f"## {numero} · {titulo}")
        lineas.append("")
        if aviso:
            lineas.append(f"*Cintillo en pantalla:* {aviso}")
            lineas.append("")
        lineas.append(nota)
        lineas.append("")
        lineas.append(f"<sub>Enlace directo a la diapositiva: `index.html#d{indice}`</sub>")
        lineas.append("")

    DESTINO.write_text("\n".join(lineas), encoding="utf-8")
    print(f"Escritas {len(secciones)} notas en {DESTINO.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
