if (!estaLogueado()) {
    window.location.replace("login.html");
}

const formMascota = document.getElementById("form-mascota");
const tablaMascotas = document.getElementById("tabla-mascotas");
const total = document.getElementById("total");
const tituloForm = document.getElementById("titulo-form");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
let idEditando = null;

// Deja el formulario en modo "alta" (título, botón principal y botón cancelar)
function volverAModoAlta() {
    idEditando = null;
    formMascota.reset();
    tituloForm.textContent = "Dar de alta";
    btnGuardar.textContent = "Agregar mascota";
    btnCancelar.classList.add("d-none");
}

function mostrarMascotas() {
    // 1. leer el array guardado
    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    // 2. vaciar el tbody para no duplicar filas
    tablaMascotas.innerHTML = "";

    // 3. por cada mascota, agregar una fila
    mascotas.forEach(function (mascota) {
        tablaMascotas.innerHTML += `
            <tr>
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.nombreDuenio}</td>
                <td>${mascota.color}</td>
                <td>${mascota.edad} ${mascota.edad === 1 ? "año" : "años"}</td>
                <td>${mascota.peso} kg</td>
                <td><button class="btn btn-sm btn-warning" data-id="${mascota.idMascota}">Editar</button></td>
                <td><button class="btn btn-sm btn-danger" data-id="${mascota.idMascota}">Eliminar</button></td>
            </tr>
        `;
    });

    // 4. actualizar el contador
    total.textContent = mascotas.length;
}

formMascota.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombreMascota = document.getElementById("nombreMascota").value;
    const nombreDuenio = document.getElementById("nombreDuenio").value;
    const color = document.getElementById("color").value;
    const edad = parseInt(document.getElementById("edad").value);
    const peso = parseFloat(document.getElementById("peso").value);

    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    if (idEditando === null) {
        // ALTA
        const mascota = {
            idMascota: crypto.randomUUID(),
            nombreMascota: nombreMascota,
            nombreDuenio: nombreDuenio,
            color: color,
            edad: edad,
            peso: peso
        };
        mascotas.push(mascota);
    } else {
        // EDICIÓN
        const indice = mascotas.findIndex(function (m) {
            return m.idMascota === idEditando;  
        });

        mascotas[indice] = {
            idMascota: idEditando,
            nombreMascota: nombreMascota,
            nombreDuenio: nombreDuenio,
            color: color,
            edad: edad,
            peso: peso
        };

    }

    localStorage.setItem("mascotas", JSON.stringify(mascotas));
    mostrarMascotas();
    volverAModoAlta();
});

// Cancelar la edición: se descartan los cambios y el formulario vuelve a modo alta
btnCancelar.addEventListener("click", volverAModoAlta);

mostrarMascotas();

tablaMascotas.addEventListener("click", function (evento) {
    const boton = evento.target;

    if (boton.classList.contains("btn-danger")) {
        const id = boton.dataset.id;

                const turnos = JSON.parse(localStorage.getItem("turnos")) || [];
        const tieneTurnos = turnos.some(function (t) {
            return t.idMascota === id;
        });

        if (tieneTurnos) {
            alert("No se puede eliminar: esta mascota tiene turnos asignados. Eliminá primero sus turnos.");
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

        const confirmar = confirm("¿Seguro que querés eliminar esta mascota?");

        if (confirmar) {
            // 1. leer el array (igual que en mostrarMascotas)
            const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

            // 2. quedarte solo con las que tengan un id DISTINTO
            const filtradas = mascotas.filter(function (m) {
                return m.idMascota !== id;
            });

            // 3. guardar el array nuevo (igual que en el alta, pero con "filtradas")
            localStorage.setItem("mascotas", JSON.stringify(filtradas));

            // 4. si justo se estaba editando esta mascota, salir del modo edición
            if (idEditando === id) {
                volverAModoAlta();
            }

            // 5. redibujar la tabla
            mostrarMascotas();
        }
    }



    if (boton.classList.contains("btn-warning")) {
        const id = boton.dataset.id;

        const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

        // 1. buscar la mascota (devuelve el primer elemento que cumple)
        const mascota = mascotas.find(function (m) {
            return m.idMascota === id;
        });

        // 2. cargar sus datos en el formulario
        document.getElementById("nombreMascota").value = mascota.nombreMascota;
        document.getElementById("nombreDuenio").value = mascota.nombreDuenio;
        document.getElementById("color").value = mascota.color;
        document.getElementById("edad").value = mascota.edad;
        document.getElementById("peso").value = mascota.peso;

        // 3. recordar que estamos editando y cambiar los textos del formulario
        idEditando = id;
        tituloForm.textContent = "Editar mascota";
        btnGuardar.textContent = "Guardar cambios";
        btnCancelar.classList.remove("d-none");
    }
});
