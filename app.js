const API_URL = "https://crud-trabajadores.mauxmora.workers.dev/api/trabajadores";

async function cargarTrabajadores() {
    const respuesta = await fetch(API_URL);
    const datos = await respuesta.json();
    
    const tabla = document.getElementById('tabla-cuerpo');
    tabla.innerHTML = ""; // Limpiar tabla

    datos.forEach(trabajador => {
        tabla.innerHTML += `
            <tr>
                <td>${trabajador.id}</td>
                <td>${trabajador.nombre} ${trabajador.apellido}</td>
                <td>${trabajador.cargo}</td>
                <td>$${trabajador.salario}</td>
                <td>${trabajador.activo ? "✅ Activo" : "❌ Inactivo"}</td>
            </tr>
        `;
    });
}

// Ejecutar al cargar la página
cargarTrabajadores();