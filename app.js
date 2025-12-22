const API_URL = "https://crud-trabajadores.mauxmora.workers.dev/api/trabajadores";
let trabajadoresLocales = []; 
let editandoId = null; 

// CARGAR DATOS
async function cargarTrabajadores() {
    try {
        const res = await fetch(API_URL);
        trabajadoresLocales = await res.json();
        renderizarTabla(trabajadoresLocales);
    } catch (e) { console.error("Error cargando:", e); }
}

// RENDERIZAR TABLA Y SUMA
function renderizarTabla(lista) {
    const tabla = document.getElementById('tabla-cuerpo');
    const pie = document.getElementById('tabla-pie');
    tabla.innerHTML = ""; 
    let sumaSalarios = 0;

    lista.forEach(t => {
        sumaSalarios += Number(t.salario || 0);
        tabla.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.nombre} ${t.apellido} <br><small>${t.dni}</small></td>
                <td>${t.cargo}</td>
                <td>$${Number(t.salario).toLocaleString()}</td>
                <td class="no-print">
                    <button class="outline" onclick='prepararEdicion(${JSON.stringify(t)})'>✏️</button>
                    <button class="outline secondary" onclick="eliminarTrabajador(${t.id})">🗑️</button>
                </td>
            </tr>`;
    });

    pie.innerHTML = `<tr><td colspan="3" style="text-align:right">TOTAL NÓMINA:</td><td>$${sumaSalarios.toLocaleString()}</td><td class="no-print"></td></tr>`;
}

// BUSCADOR REACTIVO
document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = trabajadoresLocales.filter(t => 
        `${t.nombre} ${t.apellido} ${t.cargo} ${t.dni}`.toLowerCase().includes(texto)
    );
    renderizarTabla(filtrados);
});

// GUARDAR / ACTUALIZAR
document.getElementById('workerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
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
        body: JSON.stringify(data)
    });

    editandoId = null;
    e.target.reset();
    document.getElementById('titulo-form').innerText = "➕ Añadir Trabajador";
    document.getElementById('btn-guardar').innerText = "Guardar Trabajador";
    cargarTrabajadores();
});

// FUNCIONES DE REPORTE CORREGIDAS
function exportarExcel() {
    if (trabajadoresLocales.length === 0) return alert("No hay datos");

    let csv = "\uFEFFID,Nombre,Apellido,DNI,Cargo,Salario\n";
    let total = 0;
    trabajadoresLocales.forEach(t => {
        csv += `${t.id},"${t.nombre}","${t.apellido}","${t.dni}","${t.cargo}",${t.salario}\n`;
        total += Number(t.salario || 0);
    });
    csv += `\n,,,TOTAL,$${total}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_personal.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generarPDF() {
    window.print();
}

// OTRAS FUNCIONES
function prepararEdicion(t) {
    editandoId = t.id;
    document.getElementById('nombre').value = t.nombre;
    document.getElementById('apellido').value = t.apellido;
    document.getElementById('dni').value = t.dni;
    document.getElementById('cargo').value = t.cargo;
    document.getElementById('salario').value = t.salario;
    document.getElementById('titulo-form').innerText = "✏️ Editando #" + t.id;
    document.getElementById('btn-guardar').innerText = "Actualizar Cambios";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function eliminarTrabajador(id) {
    if (confirm("¿Eliminar registro?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarTrabajadores();
    }
}

cargarTrabajadores();