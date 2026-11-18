# Mesa de Ayuda IFTS 18

Trabajo Práctico Integrador de **Desarrollo de Sistemas Web (Front-End)**
Tecnicatura Superior en Desarrollo de Software, IFTS 18. Segundo cuatrimestre de 2026.

**Alumno:** Hernan Machado

## Descripción

Sitio web de una **mesa de ayuda de soporte técnico** para el IFTS 18. Presenta los servicios
que se atienden, los tiempos de respuesta según la prioridad y permite abrir un ticket de
soporte y seguir su estado. El tema se conecta con mi otro trabajo práctico, una ticketera
con autenticación en Active Directory, y reutiliza la paleta de colores del logo del instituto.

## Cómo abrirlo

No necesita instalación ni servidor. Se abre haciendo doble clic en `index.html`
con cualquier navegador actual.

## Estructura de archivos

```
machado_hernan_tp_integrador/
├── index.html        estructura de la página
├── style.css         estilos propios
├── script.js         interacción con JavaScript
├── uso_ia.txt        declaración de uso de inteligencia artificial
├── README.md         este documento
└── img/
    └── logo-ifts18.svg
```

## Secciones del sitio

| Sección | Contenido |
|---|---|
| Inicio | Presentación, botones de acción, aviso de atención abierta o cerrada y contadores de tickets por estado |
| Servicios | Cuatro tarjetas: redes, cuentas y accesos, equipos y programas |
| Prioridades | Tabla con la prioridad, cuándo se usa y el tiempo de primera respuesta |
| Seguimiento | Lista de tickets filtrable por estado, con detalle desplegable |
| Contacto | Formulario para abrir un ticket, con validación |
| Pie de página | Horario de atención, enlaces internos y datos del trabajo |

## Tecnologías

- **HTML5** con etiquetas semánticas: `header`, `nav`, `main`, `section`, `article`, `form`, `table` y `footer`.
- **CSS3** propio: variables, Flexbox, Grid y media queries.
- **JavaScript** puro, sin librerías.
- No se usó Bootstrap, ni otros frameworks, ni plantillas. Todo el CSS está escrito en `style.css`.

## Funcionalidades de JavaScript

- **Menú hamburguesa** en pantallas chicas, que se cierra al elegir una sección.
- **Aviso de atención**: indica si la mesa está abierta (lunes a viernes de 08:00 a 18:00 hs) según el día y la hora actuales.
- **Lista de tickets** generada desde los datos, con filtros por estado: Todos, Abierto, En Progreso, Resuelto y Cerrado.
- **Contadores del inicio** que se actualizan al cambiar los tickets.
- **Formulario con validación** y mensajes de error debajo de cada campo.
- **Persistencia con `localStorage`**: los tickets enviados se guardan en el navegador y siguen ahí al recargar la página. El botón «Borrar mis tickets» los elimina.

### Reglas de validación del formulario

| Campo | Regla |
|---|---|
| Nombre y apellido | Mínimo 3 caracteres, solo letras, espacios y apóstrofes |
| Correo o teléfono | Un correo con formato válido, o un teléfono de 8 a 13 dígitos |
| Categoría | Hay que elegir una de la lista |
| Prioridad | Lista con valor por defecto (Media) |
| Consulta | Entre 10 y 500 caracteres, con contador |

Se validan todos los campos a la vez, así se ven todos los errores juntos. También se valida
en vivo al salir de un campo y mientras se corrige un error.

### Seguridad

Los textos que escribe el usuario se insertan con `textContent` y no con `innerHTML`, por lo que
un texto con código HTML se muestra como texto y no se ejecuta.

## Diseño responsive

Se verificó en escritorio (1280 px), tablet (820 px) y celular (390 px), sin desborde horizontal.

| Ancho | Cambio |
|---|---|
| Hasta 900 px | Las secciones de dos columnas pasan a una |
| Hasta 768 px | El menú se convierte en hamburguesa |
| Hasta 480 px | Botones y campos a ancho completo |

Además se usan unidades relativas (`rem`, `fr`, `%`), imágenes con `max-width: 100%` y tarjetas
con `auto-fit` que se reacomodan solas. La tabla se desplaza dentro de su contenedor.

## Accesibilidad

- Un solo `h1` y jerarquía de títulos ordenada.
- Cada campo del formulario tiene su `label` asociado.
- Atributos `aria-expanded`, `aria-pressed` y `aria-invalid` según el estado de cada elemento.
- Estilo de foco visible para navegar con teclado.
- Respeta la preferencia del sistema de reducir animaciones.

## Uso de inteligencia artificial

El detalle de qué herramienta se usó, para qué y qué modificaciones propias se hicieron está
declarado en el archivo `uso_ia.txt`.
