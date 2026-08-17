# Portal web de Proyecto Génesis

La página vive en `web/` y está pensada para publicarse con GitHub Pages mediante el workflow de `.github/workflows/pages.yml`.

## Probar localmente

Desde la raíz del proyecto:

```powershell
python -m http.server 4173 --directory web
```

Abre `http://127.0.0.1:4173/`.

## Builds

Los ejecutables se generan con el método `StandaloneReleaseBuilder.BuildAll` de Unity. Después comprime cada carpeta para crear:

- `web/downloads/ProyectoGenesis-Windows.zip`
- `web/downloads/ProyectoGenesis-macOS.zip`

Los dos `.zip` generados quedan disponibles para los botones de descarga. También puedes publicarlos como assets de un GitHub Release si prefieres mantener el repositorio más liviano.

## Video

`assets/media/inicio.mp4` conserva el videoclip entregado. Pesa más de 100 MB, por lo que GitHub no permite subirlo como blob normal. Para la publicación gratuita, súbelo como asset de un GitHub Release/CDN y reemplaza la fuente del video en `index.html` por su URL pública. El archivo local ya está conectado y funciona en desarrollo.
