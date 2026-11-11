
const formVeterinario = document.getElementById("form-veterinario");
const tablaVeterinarios = document.getElementById("tabla-veterinarios");
const total = document.getElementById("total");
const tituloForm = document.getElementById("titulo-form");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
let idEditando = null;

// Deja el formulario en modo "alta" (título, botón principal y botón cancelar)
function volverAModoAlta() {
    idEditando = null;
    formVeterinario.reset();
    tituloForm.textContent = "Dar de alta";
    btnGuardar.textContent = "Agregar veterinario";
    btnCancelar.classList.add("d-none");
}

function mostrarVeterinarios() {
    // 1. leer el array guardado
    const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

    // 2. vaciar el tbody para no duplicar filas
    tablaVeterinarios.innerHTML = "";

    // 3. por cada veterinario, agregar una fila
    veterinarios.forEach(function (veterinario) {
        tablaVeterinarios.innerHTML += `
            <tr>
                <td>${veterinario.matricula}</td>
                <td>${veterinario.nombre}</td>
                <td>${veterinario.especializacion}</td>
                                <td>${veterinario.valorConsulta.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</td>
                <td><button class="btn btn-sm btn-warning" data-id="${veterinario.idVeterinario}">Editar</button></td>
                <td><button class="btn btn-sm btn-danger" data-id="${veterinario.idVeterinario}">Eliminar</button></td>
            </tr>
        `;
    });

    // 4. actualizar el contador
    total.textContent = veterinarios.length;
}

formVeterinario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const matricula = parseInt(document.getElementById("matricula").value);
    const nombre = document.getElementById("nombre").value;
    const especializacion = document.getElementById("especializacion").value;
    const valorConsulta = parseFloat(document.getElementById("valorConsulta").value);

    const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

    if (idEditando === null) {
        // ALTA
        const veterinario = {
            idVeterinario: crypto.randomUUID(),
            matricula: matricula,
            nombre: nombre,
            especializacion: especializacion,
            valorConsulta: valorConsulta
        };
        veterinarios.push(veterinario);
    } else {
        // EDICIÓN
        const indice = veterinarios.findIndex(function (v) {
            return v.idVeterinario === idEditando;
        });

        veterinarios[indice] = {
            idVeterinario: idEditando,
            matricula: matricula,
            nombre: nombre,
            especializacion: especializacion,
            valorConsulta: valorConsulta
        };

    }

        localStorage.setItem("veterinarios", JSON.stringify(veterinarios));
        mostrarVeterinarios();
        volverAModoAlta();
    });

// Cancelar la edición: se descartan los cambios y el formulario vuelve a modo alta
btnCancelar.addEventListener("click", volverAModoAlta);

mostrarVeterinarios();

tablaVeterinarios.addEventListener("click", function (evento) {
    const boton = evento.target;

    if (boton.classList.contains("btn-danger")) {
        const id = boton.dataset.id;

                const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
        const tieneTurnos = turnos.some(function (t) {
            return t.idVeterinario === id;
        });

        if (tieneTurnos) {
            alert("No se puede eliminar: este veterinario tiene turnos asignados. Eliminá primero sus turnos.");
            return;
        }

                const historias = JSON.parse(localStorage.getItem("historias")) || [];
    const tieneHistorias = historias.some(function (h) {
        return h.idMascota === id;
    });

    if (tieneHistorias) {
        alert("No se puede eliminar: esta mascota tiene historia clínica registrada.");
        return;
    }

        const confirmar = confirm("¿Seguro que querés eliminar este veterinario?");

        if (confirmar) {
            // 1. leer el array (igual que en mostrarVeterinarios)
            const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

            // 2. quedarte solo con las que tengan un id DISTINTO
            const filtradas = veterinarios.filter(function (v) {
                return v.idVeterinario !== id;
            });

            // 3. guardar el array nuevo (igual que en el alta, pero con "filtradas")
            localStorage.setItem("veterinarios", JSON.stringify(filtradas));
            
            // 4. si justo se estaba editando este veterinario, salir del modo edición
            if (idEditando === id) {
                volverAModoAlta();
            }

            // 5. redibujar la tabla
            mostrarVeterinarios();
        }
    }

    if (boton.classList.contains("btn-warning")) {
        const id = boton.dataset.id;

        const veterinarios = JSON.parse(localStorage.getItem("veterinarios")) || [];

        // 1. buscar el veterinario (devuelve el primer elemento que cumple)
        const veterinario = veterinarios.find(function (v) {
            return v.idVeterinario === id;
        });

        // 2. cargar sus datos en el formulario
        document.getElementById("matricula").value = veterinario.matricula;
        document.getElementById("nombre").value = veterinario.nombre;
        document.getElementById("especializacion").value = veterinario.especializacion;
        document.getElementById("valorConsulta").value = veterinario.valorConsulta;

        // 3. recordar que estamos editando y cambiar los textos del formulario
        idEditando = id;
        tituloForm.textContent = "Editar veterinario";
        btnGuardar.textContent = "Guardar cambios";
        btnCancelar.classList.remove("d-none");
    }
});

            