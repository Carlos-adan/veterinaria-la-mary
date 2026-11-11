# Veterinaria La Mary

Trabajo Final Integrador - 4ta etapa
Introducción al Desarrollo Web - Tecnicatura Universitaria en Desarrollo Web - UNER

## Integrantes

- Bozzo, Francisco Emanuel
- Bacchini, Eliana
- Cerros Masetto, José Gabriel
- Monzón, Carlos Adán
- Gallegos, Agostina

## Video de exposición

[Ver video](PEGAR-AQUÍ-EL-LINK-DE-YOUTUBE)

## Descripción

Sitio web de Veterinaria La Mary, desarrollado con HTML, CSS, Bootstrap 5 y JavaScript.
En esta cuarta etapa se completaron las entidades restantes, se incorporó el inicio de sesión
contra una API externa y se integró todo en una aplicación completa.

### Páginas públicas

- **Inicio**, **Institucional** y **Contacto**.
- **Iniciar sesión**: acceso para administradores.

### Páginas de administración (requieren sesión)

- **Panel de administración**: acceso a cada entidad, con contadores de mascotas y veterinarios.
- **Mascotas**: alta, listado con contador, edición y eliminación (con confirmación).
- **Veterinarios**: alta, listado con el valor de la consulta en formato moneda, edición y eliminación (con confirmación).
- **Turnos**: registro, listado y eliminación. Cada turno relaciona una mascota con un veterinario.
- **Historia Clínica**: registro de consultas, listado y visualización del historial completo de cada mascota.

## Inicio de sesión

Se consume la API pública [DummyJSON](https://dummyjson.com/docs/auth) mediante `fetch`
(`POST https://dummyjson.com/auth/login`).

- Si las credenciales son incorrectas, se informa al usuario.
- El token se guarda en `sessionStorage`, por lo que la sesión termina al cerrar la pestaña.
- El menú de navegación muestra las opciones de administración solo con sesión iniciada.
- Las páginas de administración están protegidas: si se accede por URL directa sin sesión,
  se redirige al login.
- Se incluye la opción de cerrar sesión.

Usuario de prueba: `emilys` / `emilyspass`.

## Persistencia

Los datos se guardan en el LocalStorage del navegador, cada entidad bajo su propia clave
(`mascotas`, `veterinarios`, `turnos` e `historias`). El identificador de cada registro
se genera automáticamente.

Las entidades se relacionan guardando ids (`idMascota`, `idVeterinario`) y no nombres.

## Decisiones de diseño

- **Borrado bloqueado:** no se puede eliminar una mascota o un veterinario que tenga turnos o
  historia clínica asociados, para evitar registros huérfanos y pérdida de datos.
- **Validaciones en turnos:** no se aceptan fechas ni horas pasadas, y un veterinario no puede
  tener dos turnos en la misma fecha y hora.
- **Seguridad en las tablas:** los textos ingresados por el usuario se escapan antes de mostrarse,
  para que no se interpreten como HTML.
- **Protección de páginas:** la verificación de sesión se hace en el `head`, antes de dibujar
  la página.

### Extras incorporados

- Selección de la especialización del veterinario desde una lista desplegable.
- Unidades visibles en los formularios y tablas (kg y años).
- **Filtro de turnos** por veterinario y/o fecha.
- **Historia clínica ampliada:** peso, temperatura y fecha del próximo control (opcionales).
- Historial filtrable por mascota, con la consulta más reciente primero.

## Cómo ejecutarlo

Requiere [Node.js](https://nodejs.org/).

```bash
npm install
npx vite
```

Luego abrir la dirección que indica la terminal (normalmente `http://localhost:5173`).

## Estructura principal

| Archivo | Función |
|---|---|
| `sesion.js` | Funciones de sesión: token, `estaLogueado` y `cerrarSesion` |
| `header.js` | Ajusta el menú de las páginas públicas según la sesión |
| `login.html` / `login.js` | Inicio de sesión con `fetch` a DummyJSON |
| `panelAdmin.html` / `panelAdmin.js` | Panel de administración |
| `mascotas.html` / `mascotas.js` | Gestión de mascotas |
| `veterinarios.html` / `veterinarios.js` | Gestión de veterinarios |
| `turnos.html` / `turnos.js` | Gestión de turnos con filtros |
| `historia-clinica.html` / `historia.js` | Historia clínica por mascota |
