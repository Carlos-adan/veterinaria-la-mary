const formTurno = document.getElementById("form-turno");
const tablaTurnos = document.getElementById("tabla-turnos");
const total = document.getElementById("total");
const selectMascota = document.getElementById("mascota");
const selectVeterinario = document.getElementById("veterinario");
const inputFecha = document.getElementById("fecha");
const aviso = document.getElementById("aviso");
const mensajeError = document.getElementById("mensajeError");
const btnGuardar = document.getElementById("btn-guardar");
const filtroVeterinario = document.getElementById("filtroVeterinario");
const filtroFecha = document.getElementById("filtroFecha");
const btnLimpiar = document.getElementById("btn-limpiar");

function leer(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

// Evita que un texto con <etiquetas> se interprete como HTML
function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function fechaHoy() {
    const h = new Date();
    const mes = String(h.getMonth() + 1).padStart(2, "0");
    const dia = String(h.getDate()).padStart(2, "0");
    return `${h.getFullYear()}-${mes}-${dia}`;
}

function horaAhora() {
    const h = new Date();
    return `${String(h.getHours()).padStart(2, "0")}:${String(h.getMinutes()).padStart(2, "0")}`;
}

function formatearFecha(iso) {
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
}

function mostrarError(texto) {
    mensajeError.textContent = texto;
    mensajeError.classList.remove("d-none");
}

function cargarSelects() {
    const mascotas = leer("mascotas");
    const veterinarios = leer("veterinarios");

    selectMascota.innerHTML = '<option value="">Seleccioná una mascota</option>';
    mascotas.forEach(function (m) {
        selectMascota.innerHTML +=
            `<option value="${m.idMascota}">${escapar(m.nombreMascota)} (${escapar(m.nombreDuenio)})</option>`;
    });

    selectVeterinario.innerHTML = '<option value="">Seleccioná un veterinario</option>';
    veterinarios.forEach(function (v) {
        selectVeterinario.innerHTML +=
            `<option value="${v.idVeterinario}">${escapar(v.nombre)} - ${escapar(v.especializacion)}</option>`;
    });

        // Select del filtro (conserva la selección actual)
    const seleccionado = filtroVeterinario.value;
    filtroVeterinario.innerHTML = '<option value="">Todos los veterinarios</option>';
    veterinarios.forEach(function (v) {
        filtroVeterinario.innerHTML +=
            `<option value="${v.idVeterinario}">${escapar(v.nombre)}</option>`;
    });
    filtroVeterinario.value = seleccionado;

    // Aviso si falta cargar datos previos
    const faltan = [];
    if (mascotas.length === 0) faltan.push("mascotas");
    if (veterinarios.length === 0) faltan.push("veterinarios");

    if (faltan.length > 0) {
        aviso.textContent = "Para registrar turnos primero tenés que cargar " + faltan.join(" y ") + ".";
        aviso.classList.remove("d-none");
        btnGuardar.disabled = true;
    } else {
        aviso.classList.add("d-none");
        btnGuardar.disabled = false;
    }
}

function turnosFiltrados() {
    const idVet = filtroVeterinario.value;
    const fecha = filtroFecha.value;

    let turnos = leer("turnos");

    if (idVet !== "") {
        turnos = turnos.filter(function (t) { return t.idVeterinario === idVet; });
    }
    if (fecha !== "") {
        turnos = turnos.filter(function (t) { return t.fecha === fecha; });
    }

    turnos.sort(function (a, b) {
        return (a.fecha + a.hora).localeCompare(b.fecha + b.hora);
    });

    return turnos;
}

function mostrarTurnos() {
    const turnos = turnosFiltrados();
    const mascotas = leer("mascotas");
    const veterinarios = leer("veterinarios");

    tablaTurnos.innerHTML = "";

    if (turnos.length === 0) {
        tablaTurnos.innerHTML =
            '<tr><td colspan="6" class="text-center text-muted">No hay turnos para mostrar.</td></tr>';
    }

    turnos.forEach(function (turno) {
        const mascota = mascotas.find(function (m) { return m.idMascota === turno.idMascota; });
        const vet = veterinarios.find(function (v) { return v.idVeterinario === turno.idVeterinario; });

        tablaTurnos.innerHTML += `
            <tr>
                <td>${formatearFecha(turno.fecha)}</td>
                <td>${turno.hora} hs</td>
                <td>${mascota ? escapar(mascota.nombreMascota) : "(eliminada)"}</td>
                <td>${vet ? escapar(vet.nombre) : "(eliminado)"}</td>
                <td>${escapar(turno.motivo)}</td>
                <td><button class="btn btn-sm btn-danger" data-id="${turno.idTurno}">Eliminar</button></td>
            </tr>
        `;
    });

    total.textContent = turnos.length;
}

formTurno.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensajeError.classList.add("d-none");

    const idMascota = selectMascota.value;
    const idVeterinario = selectVeterinario.value;
    const fecha = inputFecha.value;
    const hora = document.getElementById("hora").value;
    const motivo = document.getElementById("motivo").value.trim();

    if (fecha < fechaHoy() || (fecha === fechaHoy() && hora < horaAhora())) {
        mostrarError("No se pueden registrar turnos en una fecha u hora pasada.");
        return;
    }

    const turnos = leer("turnos");

    const ocupado = turnos.some(function (t) {
        return t.idVeterinario === idVeterinario && t.fecha === fecha && t.hora === hora;
    });

    if (ocupado) {
        mostrarError("Ese veterinario ya tiene un turno en esa fecha y hora.");
        return;
    }

    turnos.push({
        idTurno: crypto.randomUUID(),
        idMascota: idMascota,
        idVeterinario: idVeterinario,
        fecha: fecha,
        hora: hora,
        motivo: motivo
    });

    localStorage.setItem("turnos", JSON.stringify(turnos));
    mostrarTurnos();
    formTurno.reset();
});

tablaTurnos.addEventListener("click", function (evento) {
    const boton = evento.target;

    if (boton.classList.contains("btn-danger")) {
        const id = boton.dataset.id;

        if (confirm("¿Seguro que querés eliminar este turno?")) {
            const filtrados = leer("turnos").filter(function (t) {
                return t.idTurno !== id;
            });
            localStorage.setItem("turnos", JSON.stringify(filtrados));
            mostrarTurnos();
        }
    }
});

filtroVeterinario.addEventListener("change", mostrarTurnos);
filtroFecha.addEventListener("change", mostrarTurnos);

btnLimpiar.addEventListener("click", function () {
    filtroVeterinario.value = "";
    filtroFecha.value = "";
    mostrarTurnos();
});

// Inicio
inputFecha.min = fechaHoy();
cargarSelects();
mostrarTurnos();

