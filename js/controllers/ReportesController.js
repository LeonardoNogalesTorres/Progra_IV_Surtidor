import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { BitwiseDecoder } from '../utils/BitwiseDecoder.js';
import { renderSidebar } from '../components/Sidebar.js';

class ReportesController {
  constructor() {
    this.adapter = new SupabaseAdapter();
    this.init();
  }

  async init() {
    renderSidebar('reportes.html');
    await this.cargarDiagnosticoBitmask();
  }

  async cargarDiagnosticoBitmask() {
    const tbody = document.getElementById('tabla-reporte-bitmask');
    if (!tbody) return;

    try {
      const surtidores = await this.adapter.obtenerSurtidores();
      tbody.innerHTML = '';

      surtidores.forEach(surtidor => {
        const mask = surtidor.estado_mask || 0;
        const decoded = BitwiseDecoder.decodificarEstado(mask);
        const bitsArray = decoded.binaryString.split('');

        // Generar cuadritos de bits (1 = azul/activo, 0 = gris)
        const bitsHTML = bitsArray.map(bit => `
          <span class="w-5 h-6 inline-flex items-center justify-center font-bold text-xs border rounded ${
            bit === '1' ? 'bg-sky-500 text-white border-sky-600' : 'bg-slate-200 text-slate-400 border-slate-300'
          }">
            ${bit}
          </span>
        `).join('');

        tbody.innerHTML += `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="p-4 font-bold text-sky-700">Surtidor #${surtidor.numero}</td>
            <td class="p-4 font-bold">${mask}</td>
            <td class="p-4"><div class="flex gap-1">${bitsHTML}</div></td>
            <td class="p-4">
              <div class="flex flex-wrap gap-1">
                ${decoded.estados.map(st => `
                  <span class="px-2 py-0.5 rounded text-xs font-bold ${
                    st.includes('Alerta') || st.includes('Fuga') ? 'bg-red-100 text-red-700' : 'bg-sky-100 text-sky-800'
                  }">
                    ${st}
                  </span>
                `).join('')}
              </div>
            </td>
          </tr>
        `;
      });
    } catch (err) {
      console.error("Error al cargar diagnóstico:", err);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new ReportesController());