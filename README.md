# Mapas de Ensayo para Banda

App local en React/Vite para crear mapas de ensayo por compases, editar acordes, importar JSON, transponer la canción y exportar/imprimir hojas para la banda.

## Requisitos

1. Instala Node.js LTS desde la web oficial.
2. Descomprime este ZIP.
3. Abre la Terminal dentro de la carpeta `mapas-ensayo-banda`.

## Arrancar la app

```bash
npm install
npm run dev
```

Después abre en el navegador la dirección que muestre la terminal, normalmente:

```text
http://localhost:5173/
```

## Uso rápido

- **Editar**: cambia título, artista, tonalidad, secciones, acordes y notas.
- **Transposición**: usa el bloque “Transposición” para subir o bajar todos los acordes por semitonos.
- **IA / JSON**: genera una petición para pedir a ChatGPT/Gemini un JSON compatible o pega un JSON ya generado.
- **Tests**: comprueba funciones internas, incluida la transposición.
- **Vista previa**: muestra la hoja visual.
- **Hoja A4 / Póster**: cambia el modo visual desde la barra superior.
- **PDF/Imprimir**: usa el cuadro de impresión del navegador para guardar como PDF.
- **JSON**: descarga la canción editada como archivo JSON.

## Notas

La app funciona en local. No sube tus canciones ni datos a ningún servidor. La parte IA es manual: copias la petición, la envías a la IA y pegas el JSON resultante.
