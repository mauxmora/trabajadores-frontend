// Configuración inicial
const API_URL = 'https://crud-trabajadores.mauxmora.workers.dev';

// Estado de la aplicación
let trabajadoresLocales = [];

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    cargarTrabajadores();
    configurarEscuchadores();
});

// --- LÓGICA DE INTERFAZ (MODAL) ---
const modal = document.getElementById('modal-trabajador');
const formulario = document.getElementById('form-trabajador');

function abrirModal() {
    formulario.reset(); // Limpia el formulario
    // Si estuviéramos editando, aquí cargaríamos los datos en los inputs
    modal.setAttribute('open', 'true');
}

function cerrarModal() {
    modal.removeAttribute('open');
}

// --- COMUNICACIÓN CON EL BACKEND (API) ---

// 1. Obtener todos los trabajadores
async function cargarTrabajadores() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Error al obtener datos');
        
        trabajadoresLocales = await res.json();
        renderizarTabla(trabajadoresLocales);
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar los datos del servidor.');
    }
}

// 2. Guardar nuevo trabajador (POST)
async function guardarTrabajador(datos) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (res.ok) {
            cerrarModal();
            await cargarTrabajadores(); // Recargar tabla
        } else {
            alert('Error al guardar en el servidor');
        }
    } catch (error) {
        console.error('Error al enviar datos:', error);
    }
}

// 3. Eliminar trabajador (DELETE)
async function eliminarTrabajador(id) {
    if (!confirm('¿Estás seguro de eliminar a este trabajador?')) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await cargarTrabajadores();
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

// --- RENDERIZADO ---

function renderizarTabla(lista) {
    const cuerpo = document.getElementById('tabla-cuerpo');
    cuerpo.innerHTML = '';

    lista.forEach(t => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${t.nombre}</strong></td>
            <td>${t.puesto}</td>
            <td><code>${t.dni}</code></td>
            <td><ins>$${parseFloat(t.salario).toLocaleString()}</ins></td>
            <td>
                <button class="outline contrast" onclick="eliminarTrabajador('${t.id}')" style="padding: 2px 10px; font-size: 12px;">
                    Eliminar
                </button>
            </td>
        `;
        cuerpo.appendChild(fila);
    });
}

// --- EVENTOS ---
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