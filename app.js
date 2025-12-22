// URL de tu Worker de Cloudflare
const API_URL = "https://crud-trabajadores.mauxmora.workers.dev/api/trabajadores";

// Variable global para almacenar los datos y permitir el filtrado sin recargar
let trabajadoresLocales = []; 
let editandoId = null; 

// 1. FUNCIÓN PARA CARGAR DATOS DESDE EL BACKEND (GET)
async function cargarTrabajadores() {
    try {
        const res = await fetch(API_URL);
        trabajadoresLocales = await res.json();
        renderizarTabla(trabajadoresLocales); // Dibujamos la tabla con los datos obtenidos
    } catch (error) {
        console.error("Error al cargar trabajadores:", error);
    }
}

// 2. FUNCIÓN PARA DIBUJAR LA TABLA (RENDER)
// Esta función se encarga de mostrar los datos que reciba (ya sean todos o filtrados)
function renderizarTabla(lista) {
    const tabla = document.getElementById('tabla-cuerpo');
    tabla.innerHTML = ""; 
    
    lista.forEach(t => {
        tabla.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td><strong>${t.nombre} ${t.apellido}</strong><br><small>${t.dni}</small></td>
                <td>${t.cargo}</td>
                <td>$${t.salario}</td>
                <td>
                    <div class="grid">
                        <button class="outline" onclick='prepararEdicion(${JSON.stringify(t)})'>✏️</button>
                        <button class="outline secondary" onclick="eliminarTrabajador(${t.id})">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// 3. LÓGICA DEL BUSCADOR (FILTRADO REACTIVO)
document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    
    const filtrados = trabajadoresLocales.filter(t => 
        t.nombre.toLowerCase().includes(texto) || 
        t.apellido.toLowerCase().includes(texto) ||
        t.cargo.toLowerCase().includes(texto) ||
        t.dni.includes(texto)
    );
    
    renderizarTabla(filtrados);
});

// 4. PREPARAR FORMULARIO PARA EDICIÓN
function prepararEdicion(trabajador) {
    editandoId = trabajador.id;
    
    // Llenamos los inputs con los datos del trabajador seleccionado
    document.getElementById('nombre').value = trabajador.nombre;
    document.getElementById('apellido').value = trabajador.apellido;
    document.getElementById('dni').value = trabajador.dni;
    document.getElementById('cargo').value = trabajador.cargo;
    document.getElementById('salario').value = trabajador.salario;
    
    // Cambiamos el estilo visual para indicar que estamos editando
    document.getElementById('titulo-form').innerText = "✏️ Editando Trabajador #" + trabajador.id;
    document.getElementById('btn-guardar').innerText = "Actualizar Cambios";
    document.getElementById('btn-guardar').classList.remove('primary');
    
    // Hacemos scroll hacia arriba para que el usuario vea el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5. GUARDAR O ACTUALIZAR (POST / PUT)
document.getElementById('workerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const trabajadorData = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        dni: document.getElementById('dni').value,
        cargo: document.getElementById('cargo').value,
        salario: parseFloat(document.getElementById('salario').value)
    };

    // Si editandoId tiene valor, usamos PUT (actualizar), si no, POST (crear)
    const metodo = editandoId ? 'PUT' : 'POST';
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

    try {
        const res = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trabajadorData)
        });

        if (res.ok) {
            // Resetear el formulario y el estado de edición
            editandoId = null;
            document.getElementById('workerForm').reset();
            document.getElementById('titulo-form').innerText = "➕ Añadir Nuevo Trabajador";
            document.getElementById('btn-guardar').innerText = "Guardar Trabajador";
            
            cargarTrabajadores(); // Refrescar la lista
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
    }
});

// 6. ELIMINAR TRABAJADOR (DELETE)
async function eliminarTrabajador(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            cargarTrabajadores();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

// Inicializar la aplicación
cargarTrabajadores();