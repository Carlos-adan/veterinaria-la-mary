const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

document.getElementById("nombre-usuario").textContent = sessionStorage.getItem('usuario');
document.getElementById("total-mascotas").textContent = mascotas.length + " registradas";
document.getElementById("total-veterinarios").textContent = veterinarios.length + " registrados";
