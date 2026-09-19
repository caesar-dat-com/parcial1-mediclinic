"""Genera el icono de la PWA y la imagen del encabezado."""

from PIL import Image, ImageDraw

AZUL = (37, 99, 235)
BLANCO = (255, 255, 255)


def dibujar_persona(d, cx, cy, r, color):
    """Silueta simple: cabeza redonda y hombros."""
    d.ellipse([cx - r, cy - r * 2.1, cx + r, cy - r * 0.1], fill=color)
    d.pieslice(
        [cx - r * 1.65, cy + r * 0.15, cx + r * 1.65, cy + r * 3.4],
        start=180,
        end=360,
        fill=color,
    )


def icono(tam, margen):
    """Icono cuadrado azul con la silueta. margen = espacio seguro (maskable)."""
    esc = 4
    img = Image.new("RGBA", (tam * esc, tam * esc), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    lado = tam * esc

    d.rounded_rectangle([0, 0, lado, lado], radius=lado * 0.22, fill=AZUL)

    util = lado * (1 - margen * 2)
    dibujar_persona(d, lado / 2, lado / 2 + util * 0.04, util * 0.185, BLANCO)

    return img.resize((tam, tam), Image.LANCZOS)


def encabezado():
    """Banner azul para la cabecera de la app."""
    esc = 3
    an, al = 960 * esc, 300 * esc
    img = Image.new("RGB", (an, al), AZUL)
    d = ImageDraw.Draw(img)

    # circulos suaves de fondo
    for cx, cy, r, tono in [
        (an * 0.18, al * 0.75, al * 0.55, (59, 118, 240)),
        (an * 0.85, al * 0.25, al * 0.60, (29, 84, 214)),
    ]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=tono)

    # tres siluetas en fila
    for i, f in enumerate([0.36, 0.5, 0.64]):
        r = al * (0.15 if i == 1 else 0.12)
        dibujar_persona(d, an * f, al * 0.46, r, BLANCO)

    return img.resize((960, 300), Image.LANCZOS)


if __name__ == "__main__":
    icono(192, 0.0).save("public/icon-192.png")
    icono(512, 0.0).save("public/icon-512.png")
    icono(512, 0.1).save("public/icon-maskable-512.png")
    icono(180, 0.0).save("public/apple-touch-icon.png")
    icono(32, 0.0).save("public/favicon.png")
    encabezado().save("src/assets/contactos.png")
    print("listo")
