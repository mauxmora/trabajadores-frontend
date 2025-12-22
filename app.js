// Asegúrate de que esta URL sea la de TU Worker
const API_URL = "https://crud-trabajadores.mauxmora.workers.dev/api/trabajadores";

// 1. FUNCIÓN PARA CARGAR LOS TRABAJADORES (GET)
async function cargarTrabajadores() {
    try {
        const respuesta = await fetch(API_URL);
        const datos = await respuesta.json();
        
        const tabla = document.getElementById('tabla-cuerpo');
        tabla.innerHTML = ""; // Limpiamos la tabla antes de llenarla

        datos.forEach(trabajador => {
            tabla.innerHTML += `
                <tr>
                    <td>${trabajador.id}</td>
                    <td>${trabajador.nombre} ${trabajador.apellido}</td>
                    <td>${trabajador.cargo}</td>
                    <td>$${trabajador.salario}</td>
                    <td>
                        <button class="outline secondary" onclick="eliminarTrabajador(${trabajador.id})">
                            🗑️ Borrar
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

// 2. FUNCIÓN PARA GUARDAR UN NUEVO TRABAJADOR (POST)
document.getElementById('workerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Recogemos los datos del formulario
    const nuevoTrabajador = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        dni: document.getElementById('dni').value,
        cargo: document.getElementById('cargo').value,
        salario: parseFloat(document.getElementById('salario').value)
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoTrabajador)
        });

        if (respuesta.ok) {
            alert("✅ Trabajador guardado correctamente");
            document.getElementById('workerForm').reset(); // Limpiamos el formulario
            cargarTrabajadores(); // Refrescamos la tabla para ver el nuevo registro
        }
    } catch (error) {
        alert("❌ Error al guardar");
        console.error(error);
    }
});

// 3. FUNCIÓN PARA ELIMINAR UN TRABAJADOR (DELETE)
async function eliminarTrabajador(id) {
    if (confirm("¿Estás seguro de que deseas eliminar a este trabajador?")) {
        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarTrabajadores(); // Refrescamos la tabla
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

// Ejecutamos la carga inicial al abrir la página
cargarTrabajadores();