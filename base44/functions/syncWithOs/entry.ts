import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

// El Pecado OS expone una única función en https://<os-app>.base44.app/functions/comandasApi
// que recibe { apiKey, action, payload }. Este menú público solo usa:
//   get_catalog  -> disponibilidad real ("agotado") por producto, cruzada contra receta + inventario
//   create_order -> registra la venta en el OS y descuenta el inventario real
// El menú público es contenido curado (fotos, descripciones, categorías de marca) que el
// dueño edita a mano — el OS nunca sobreescribe nombre/precio/imagen aquí, solo la
// disponibilidad de los MenuItem que ya tienen un os_id vinculado.

async function callOs(baseUrl, apiKey, action, payload) {
  const res = await fetch(`${baseUrl}/functions/comandasApi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
    body: JSON.stringify({ apiKey, action, payload })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `El OS respondió ${res.status}.`);
  return data;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const action = body.action;
    const baseUrl = (secrets.get('PECADO_OS_BASE_URL') || '').replace(/\/$/, '');
    const apiKey = secrets.get('PECADO_OS_API_KEY');

    if (!baseUrl || !apiKey) {
      return Response.json({
        status: 'not_configured',
        message: 'Falta configurar la clave de integración con el OS (PECADO_OS_BASE_URL / PECADO_OS_API_KEY) en Settings → Environment variables.'
      });
    }

    // Sin auth.me(): esta función la llaman visitantes anónimos del menú público.
    // La clave de integración vive solo en el servidor (secrets), nunca llega al navegador.

    if (action === 'pullAvailability') {
      try {
        const catalog = await callOs(baseUrl, apiKey, 'get_catalog');
        const products = catalog.products || [];
        const agotadoByOsId = {};
        products.forEach((p) => { if (p.id) agotadoByOsId[p.id] = !!p.agotado; });

        const items = await base44.asServiceRole.entities.MenuItem.list();
        let updated = 0;
        for (const item of (items || [])) {
          if (!item.os_id || !(item.os_id in agotadoByOsId)) continue;
          const shouldBeAvailable = !agotadoByOsId[item.os_id];
          if (item.is_available !== shouldBeAvailable) {
            await base44.asServiceRole.entities.MenuItem.update(item.id, { is_available: shouldBeAvailable });
            updated++;
          }
        }
        return Response.json({ status: 'synced', checked: items.length, updated });
      } catch (e) {
        return Response.json({ status: 'error', message: e.message });
      }
    }

    if (action === 'pushOrder') {
      try {
        const order = body.order || {};
        const items = await base44.asServiceRole.entities.MenuItem.list();
        const byId = {};
        (items || []).forEach((i) => { byId[i.id] = i; });

        const linkedItems = (order.items || [])
          .filter((it) => it.menu_item_id && byId[it.menu_item_id] && byId[it.menu_item_id].os_id)
          .map((it) => ({
            product_id: byId[it.menu_item_id].os_id,
            quantity: it.quantity,
            unit_price: it.price,
            notes: typeof it.notes === 'string' && it.notes.trim() ? it.notes.trim() : undefined
          }));

        if (linkedItems.length === 0) {
          // Ningún producto de este pedido está vinculado al OS todavía (os_id vacío) —
          // no se registró nada en el OS. Nunca reportamos esto como "synced": ese campo
          // significa "esta venta ya se registró en el OS", y aquí literalmente no se registró.
          return Response.json({ status: 'skipped', message: 'Ninguno de los productos de este pedido tiene os_id vinculado en el OS todavía.' });
        }

        // Se reenvían las notas del cliente (generales y por producto) y sus datos de
        // contacto/entrega para que la cocina (a través de Comandas) tenga todas las
        // especificaciones del pedido, no solo qué productos y cuántos.
        const data = await callOs(baseUrl, apiKey, 'create_order', {
          items: linkedItems,
          total: order.total,
          payment_method: order.payment_method === 'tarjeta' ? 'tarjeta' : 'efectivo',
          notes: typeof order.notes === 'string' && order.notes.trim() ? order.notes.trim() : undefined,
          customer_name: typeof order.customer_name === 'string' ? order.customer_name : undefined,
          customer_phone: typeof order.customer_phone === 'string' ? order.customer_phone : undefined,
          customer_address: typeof order.customer_address === 'string' ? order.customer_address : undefined,
          channel: typeof order.channel === 'string' ? order.channel : undefined,
          source: 'menu_publico'
        });
        return Response.json({ status: 'synced', sale_id: data.sale_id });
      } catch (e) {
        return Response.json({ status: 'error', message: e.message });
      }
    }

    return Response.json({ error: 'Acción no válida. Usa pullAvailability o pushOrder.' }, { status: 400 });
  } catch (error) {
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
