// Configuración inicial
//const API_URL = 'https://crud-trabajadores.mauxmora.workers.dev';
const API_URL = 'https://crud-trabajadores.mauxmora.workers.dev/api/trabajadores';


// Estado global de la aplicación
let trabajadoresLocales = [];

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarTrabajadores();
    configurarEscuchadores();
});

// --- FUNCIONES DEL MODAL ---
const modal = document.getElementById('modal-trabajador');
const formulario = document.getElementById('form-trabajador');

function abrirModal() {
    formulario.reset();
    modal.setAttribute('open', 'true');
}

function cerrarModal() {
    modal.removeAttribute('open');
}

// --- COMUNICACIÓN CON EL SERVIDOR (API) ---

// Obtener trabajadores (GET)
async function cargarTrabajadores() {
    try {
        // 'credentials: include' permite que la sesión de Cloudflare Access 
        // pase del frontend al backend sin errores 401.
        const res = await fetch(API_URL, { credentials: 'include' });
        
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        
        trabajadoresLocales = await res.json();
        renderizarTabla(trabajadoresLocales);
    } catch (error) {
        console.error('Error al cargar:', error);
        // Este es el mensaje que veías en tu captura
        alert('No se pudieron cargar los datos del servidor. Verifica el acceso en Cloudflare.');
    }
}

// Guardar nuevo trabajador (POST)
async function guardarTrabajador(datos) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
            credentials: 'include'
        });

        if (res.ok) {
            cerrarModal();
            await cargarTrabajadores(); // Refresca la lista automáticamente
        } else {
            const errorData = await res.json();
            alert('Error al guardar: ' + (errorData.message || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error en la petición POST:', error);
        alert('Error de conexión al intentar guardar.');
    }
}

// Eliminar trabajador (DELETE)
async function eliminarTrabajador(id) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (res.ok) {
            await cargarTrabajadores();
        } else {
            alert('No se pudo eliminar el trabajador.');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

// --- RENDERIZADO DE TABLA ---
function renderizarTabla(lista) {
    const cuerpo = document.getElementById('tabla-cuerpo');
    cuerpo.innerHTML = '';

    if (lista.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="5" style="text-align:center">No hay trabajadores registrados.</td></tr>';
        return;
    }

    lista.forEach(t => {
        const fila = document.createElement('tr');
        // Usamos toLocaleString para que el salario se vea profesional (ej: $1,200.00)
        const salarioFormateado = parseFloat(t.salario).toLocaleString('es-ES', { 
            style: 'currency', 
            currency: 'USD' 
        });

        fila.innerHTML = `
            <td><strong>${t.nombre}</strong></td>
            <td>${t.puesto}</td>
            <td><code>${t.dni}</code></td>
            <td><ins>${salarioFormateado}</ins></td>
            <td>
                <button class="outline contrast" onclick="eliminarTrabajador('${t.id}')" 
                        style="padding: 4px 8px; font-size: 0.8rem; margin-bottom: 0;">
                    Eliminar
                </button>
            </td>
        `;
        cuerpo.appendChild(fila);
    });
}

// --- CONFIGURACIÓN DE EVENTOS ---
function configurarEscuchadores() {
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datos = {
            nombre: document.getElementById('nombre').value,
            dni: document.getElementById('dni').value,
            puesto: document.getElementById('puesto').value,
            salario: parseFloat(document.getElementById('salario').value)
        };

        await guardarTrabajador(datos);
    });
}