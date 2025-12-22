const API_URL = "https://crud-trabajadores.mauxmora.workers.dev/api/trabajadores";
let editandoId = null; // Variable para saber qué ID estamos editando

// 1. CARGAR DATOS (Modificado para añadir botón editar)
async function cargarTrabajadores() {
    const res = await fetch(API_URL);
    const datos = await res.json();
    const tabla = document.getElementById('tabla-cuerpo');
    tabla.innerHTML = ""; 
    
    datos.forEach(t => {
        tabla.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.nombre} ${t.apellido}</td>
                <td>${t.cargo}</td>
                <td>$${t.salario}</td>
                <td>
                    <button class="outline" onclick='prepararEdicion(${JSON.stringify(t)})'>✏️</button>
                    <button class="outline secondary" onclick="eliminarTrabajador(${t.id})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// 2. PREPARAR EDICIÓN (Poner los datos en el formulario)
function prepararEdicion(trabajador) {
    editandoId = trabajador.id;
    document.getElementById('nombre').value = trabajador.nombre;
    document.getElementById('apellido').value = trabajador.apellido;
    document.getElementById('dni').value = trabajador.dni;
    document.getElementById('cargo').value = trabajador.cargo;
    document.getElementById('salario').value = trabajador.salario;
    
    // Cambiar el texto del botón para que el usuario sepa que está editando
    document.querySelector('#workerForm button').innerText = "Actualizar Cambios";
}

// 3. GUARDAR O ACTUALIZAR (Evento Submit)
document.getElementById('workerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const trabajadorData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        dni: document.getElementById('dni').value,
        cargo: document.getElementById('cargo').value,
        salario: parseFloat(document.getElementById('salario').value)
    };

    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

    await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trabajadorData)
    });

    // Resetear estado
    editandoId = null;
    document.getElementById('workerForm').reset();
    document.querySelector('#workerForm button').innerText = "Guardar Trabajador";
    cargarTrabajadores();
});

// (Mantén aquí tu función eliminarTrabajador anterior)
cargarTrabajadores();