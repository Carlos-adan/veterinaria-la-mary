const formHistoria = document.getElementById("form-historia");
const tablaHistorias = document.getElementById("tabla-historias");
const total = document.getElementById("total");
const selectMascota = document.getElementById("mascota");
const selectVeterinario = document.getElementById("veterinario");
const filtroMascota = document.getElementById("filtroMascota");
const aviso = document.getElementById("aviso");
const mensajeError = document.getElementById("mensajeError");
const btnGuardar = document.getElementById("btn-guardar");

function leer(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function formatearFecha(iso) {
    if (!iso) return "-";
    const [anio, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${anio}`;
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

    // Select para ver el historial: "todas" o una mascota puntual
    const seleccionada = filtroMascota.value;
    filtroMascota.innerHTML = '<option value="">Todas las mascotas</option>';
    mascotas.forEach(function (m) {
        filtroMascota.innerHTML +=
            `<option value="${m.idMascota}">${escapar(m.nombreMascota)} (${escapar(m.nombreDuenio)})</option>`;
    });
    filtroMascota.value = seleccionada;

    const faltan = [];
    if (mascotas.length === 0) faltan.push("mascotas");
    if (veterinarios.length === 0) faltan.push("veterinarios");

    if (faltan.length > 0) {
        aviso.textContent = "Para registrar consultas primero tenés que cargar " + faltan.join(" y ") + ".";
        aviso.classList.remove("d-none");
        btnGuardar.disabled = true;
    } else {
        aviso.classList.add("d-none");
        btnGuardar.disabled = false;
    }
}

function mostrarHistorias() {
    const idFiltro = filtroMascota.value;
    const mascotas = leer("mascotas");
    const veterinarios = leer("veterinarios");

    let historias = leer("historias");

    if (idFiltro !== "") {
        historias = historias.filter(function (h) {
            return h.idMascota === idFiltro;
        });
    }

    // Más reciente primero
    historias.sort(function (a, b) {
        return b.fecha.localeCompare(a.fecha);
    });

    tablaHistorias.innerHTML = "";

    if (historias.length === 0) {
        tablaHistorias.innerHTML =
            '<tr><td colspan="9" class="text-center text-muted">No hay consultas registradas.</td></tr>';
    }

    historias.forEach(function (h) {
        const mascota = mascotas.find(function (m) { return m.idMascota === h.idMascota; });
        const vet = veterinarios.find(function (v) { return v.idVeterinario === h.idVeterinario; });

        tablaHistorias.innerHTML += `
            <tr>
                <td>${formatearFecha(h.fecha)}</td>
                <td>${mascota ? escapar(mascota.nombreMascota) : "(eliminada)"}</td>
                <td>${vet ? escapar(vet.nombre) : "(eliminado)"}</td>
                <td>${escapar(h.diagnostico)}</td>
                <td>${escapar(h.tratamiento)}</td>
                <td>${h.peso !== null ? h.peso + " kg" : "-"}</td>
                <td>${h.temperatura !== null ? h.temperatura + " °C" : "-"}</td>
                <td>${formatearFecha(h.proximoControl)}</td>
                <td><button class="btn btn-sm btn-danger" data-id="${h.idHistoria}">Eliminar</button></td>
            </tr>
        `;
    });

    total.textContent = historias.length;
}

formHistoria.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensajeError.classList.add("d-none");

    const fecha = document.getElementById("fecha").value;
    const proximoControl = document.getElementById("proximoControl").value;
    const pesoTexto = document.getElementById("peso").value;
    const tempTexto = document.getElementById("temperatura").value;

    if (proximoControl !== "" && proximoControl <= fecha) {
        mensajeError.textContent = "La fecha del próximo control debe ser posterior a la de la consulta.";
        mensajeError.classList.remove("d-none");
        return;
    }

    const historias = leer("historias");

    historias.push({
        idHistoria: crypto.randomUUID(),
        idMascota: selectMascota.value,
        idVeterinario: selectVeterinario.value,
        fecha: fecha,
        diagnostico: document.getElementById("diagnostico").value.trim(),
        tratamiento: document.getElementById("tratamiento").value.trim(),
        peso: pesoTexto === "" ? null : parseFloat(pesoTexto),
        temperatura: tempTexto === "" ? null : parseFloat(tempTexto),
        proximoControl: proximoControl === "" ? null : proximoControl
    });

    localStorage.setItem("historias", JSON.stringify(historias));

    // Mostrar enseguida el historial de la mascota que se acaba de cargar
    filtroMascota.value = selectMascota.value;
    mostrarHistorias();
    formHistoria.reset();
});

filtroMascota.addEventListener("change", mostrarHistorias);

tablaHistorias.addEventListener("click", function (evento) {
    const boton = evento.target;

    if (boton.classList.contains("btn-danger")) {
        const id = boton.dataset.id;

        if (confirm("¿Seguro que querés eliminar esta consulta?")) {
            const filtradas = leer("historias").filter(function (h) {
                return h.idHistoria !== id;
            });
            localStorage.setItem("historias", JSON.stringify(filtradas));
            mostrarHistorias();
        }
    }
});

// Inicio
cargarSelects();
mostrarHistorias();