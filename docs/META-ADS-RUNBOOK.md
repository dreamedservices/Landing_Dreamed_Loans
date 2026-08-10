# Meta Ads — Pixel

## Estado implementado

- Pixel/dataset: `1312615597393703`.
- `PageView`: se envía tras aceptar el banner.
- `Lead`: se envía únicamente después de que EmailJS confirma el correo al negocio.
- Solo Pixel de navegador — sin Conversions API. El hosting es un VPS que solo sirve
  archivos estáticos (sin Node ni funciones serverless), así que el sitio se publica
  como export estático (`output: "export"`) y no puede ejecutar una ruta de servidor.
- No se envía correo, teléfono, mensaje, empresa, cartera ni otro dato personal o
  financiero a Meta. El Pixel no recibe parámetros con PII.
- Sin consentimiento, no carga el script de Meta.

## Variables de producción

```env
NEXT_PUBLIC_META_PIXEL_ID=1312615597393703
```

## Configuración en Meta Business Manager

1. Abrir Events Manager y seleccionar el dataset `1312615597393703`.
2. Verificar `dreamprestamos.com` en Business Settings, preferiblemente mediante DNS TXT
   (necesario para Aggregated Event Measurement en iOS 14.5+).
3. Asociar el dataset con la cuenta publicitaria que ejecutará las campañas.
4. Abrir **Test Events**, visitar la landing, aceptar cookies y enviar un formulario de
   prueba válido. Confirmar un `PageView` y un `Lead` en la pestaña de pruebas.
5. Revisar **Diagnostics** y **Event Match Quality**; sin Conversions API el match
   quality va a ser más bajo (solo cookies del navegador, sin correo/teléfono
   hasheados) — es la limitación esperada de este modelo, no un error.
6. En **Aggregated Event Measurement**, priorizar `Lead` como evento principal (es el
   único evento de conversión que dispara este sitio).

## Campañas

Usar la landing como destino y añadir parámetros de URL:

```text
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
```

En el conjunto de anuncios:

- Ubicación de conversión: sitio web.
- Dataset: `1312615597393703`.
- Evento de conversión: `Lead`.
- Si el anuncio ofrece créditos o servicios financieros al consumidor, revisar y
  seleccionar la categoría especial aplicable. Si anuncia únicamente el software B2B,
  confirmar la clasificación con Meta antes de publicar.

## Por qué no hay Conversions API

Sin CAPI, algunos eventos `Lead` se pierden por bloqueadores de anuncios, Safari ITP o
iOS 14.5+ — es una limitación conocida y aceptada, no un bug pendiente. Si en el futuro
se dispone de un hosting con Node (Vercel, un servidor propio, o una función serverless
externa apuntada desde el navegador), se puede reintroducir CAPI como una ruta de
servidor separada sin tocar el Pixel del navegador.

## Diagnóstico

- No aparece `Lead` en Test Events: aceptar el banner, comprobar que EmailJS confirmó
  el envío (mira la Network tab, no debe haber error en la llamada a EmailJS), y que
  `window.fbq` existe en la consola del navegador.
- No aparece `PageView`: revisar que el banner de consentimiento se aceptó y que
  `NEXT_PUBLIC_META_PIXEL_ID` está configurado en el build desplegado.
