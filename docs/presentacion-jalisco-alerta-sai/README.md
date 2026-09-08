# Del aviso a la acción

Presentación ejecutiva de la propuesta de vinculación tecnológica
**Jalisco Alerta + SAI Jalisco**, para exponerse ante la Unidad Estatal de
Protección Civil y Bomberos de Jalisco.

> **Esto es una propuesta.** No constituye convenio, alianza formalizada,
> respaldo gubernamental ni integración autorizada. Ninguna de las pantallas
> mostradas existe hoy en operación.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La presentación completa. Un solo archivo, sin dependencias que instalar. |
| `NOTAS-EXPOSITOR.md` | Notas del expositor en español, una por diapositiva. **Generado**, no se edita a mano. |
| `generar-notas.py` | Regenera `NOTAS-EXPOSITOR.md` a partir de `index.html`. |

## Cómo se usa

Abre `index.html` en cualquier navegador moderno. No requiere servidor ni conexión;
si no hay internet, las tipografías caen a las del sistema y todo sigue legible.

| Tecla | Acción |
| --- | --- |
| `→` `Espacio` `Av Pág` | Siguiente diapositiva |
| `←` `Re Pág` | Diapositiva anterior |
| `Inicio` / `Fin` | Primera / última |
| `N` | Mostrar u ocultar las notas del expositor |
| `G` | Ver todas las diapositivas; clic en una para ir a ella |
| `P` | Exportar a PDF |

Cada diapositiva tiene enlace directo: `index.html#d8` abre la número 8.
Útil para citarla en una minuta.

### Exportar a PDF

Pulsa `P` (o usa Imprimir del navegador) y elige **Guardar como PDF**.
En el diálogo: orientación horizontal, márgenes en cero y **activa
“Gráficos de fondo”**; sin esa opción se pierden los fondos azules.
Cada diapositiva sale en su propia página de 1280 × 720.

> No se genera PowerPoint. El formato editable de esta entrega es el HTML.

## Estructura

24 diapositivas principales (15–20 minutos) y 3 anexos que solo se usan
para responder preguntas.

Las diapositivas **08 a 11** forman la sección *“Alerta Jalisco en SAI Jalisco ·
Hasta dónde podemos llegar”*: cómo se vería el módulo dentro de SAI, qué ocurre
al abrir un aviso, el asistente operativo y los tres horizontes de evolución.

En el menú propuesto la sección se llama **Alerta Jalisco**; la aplicación
oficial se identifica siempre con su nombre publicado, **Jalisco Alerta**.

## Cómo leer las etiquetas de evidencia

Toda afirmación de la presentación lleva una de estas marcas. La disciplina es
deliberada: sin ella, una propuesta no se puede defender ante un auditor.

| Etiqueta | Significado |
| --- | --- |
| **Existente** | Respaldado por una fuente pública consultable. |
| **Revisado en SAI** | Verificado el 7 de septiembre de 2026 mediante la conexión autorizada de Base44 a la aplicación “SAI Jalisco”. |
| **Antecedente** | Información operativa aportada por el promotor, no verificada de forma independiente. |
| **Propuesto** | Función por desarrollar. No existe. |
| **Por validar** | Acceso, autorización, acuerdo o capacidad pendiente de comprobar. |

Los prototipos llevan además **“Concepto propuesto · Datos de demostración”**, y
los mapas inventados dicen **“Esquema ilustrativo”**. Ninguna cifra de litros,
unidades, tiempos de respuesta o personas beneficiadas aparece en la
presentación: se excluyeron por carecer de documento y periodo verificables.

El **Anexo C** deja por escrito las fuentes, el alcance real de la revisión y
los siete pendientes. Incluye una limitación importante: la red donde se preparó
este material bloqueó abrir directamente las fichas de tienda y el portal
institucional, así que esa información proviene de resultados de búsqueda.
**Antes de exponer, conviene abrir cada enlace del Anexo C y confirmar el texto vigente.**

## Editar la presentación

Es HTML plano con estilos en un solo bloque al inicio del archivo.

- **Contenido de una diapositiva**: busca su comentario, por ejemplo
  `<!-- ============ 08 · [A] ALERTA JALISCO DENTRO DE SAI ============ -->`.
- **Notas del expositor**: están en el `<div class="notas-fuente">` al final de
  cada diapositiva. Después de cambiarlas, ejecuta `python3 generar-notas.py`.
- **Paleta y tipografía**: variables CSS en `:root`, al inicio del archivo.
- **Lienzo**: fijo en 1280 × 720 px; el navegador lo escala para llenar la
  ventana y para imprimir.

La presentación usa un solo tema visual a propósito: debe verse igual para
todos al proyectarla, sin seguir el modo claro u oscuro de quien la abre.
