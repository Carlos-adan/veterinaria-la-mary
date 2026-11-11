const listaItems = document.querySelector('.navegacion > ul');

if (estaLogueado() && listaItems) {
    // Saca el ítem "Iniciar Sesión" (no hace falta que tenga id)
    const itemLogin = listaItems.querySelector('a[href="login.html"]')?.closest('li');
    if (itemLogin) itemLogin.remove();

    // Agrega Panel y Cerrar Sesión al final, conservando el resto del menú
    listaItems.insertAdjacentHTML('beforeend', `
        <li class="nav-item">
            <a href="panelAdmin.html" class="nav-link">Panel</a>
        </li>
        <li class="nav-item">
            <button class="nav-link btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
        </li>
    `);
}
