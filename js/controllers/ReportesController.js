// js/controllers/ReportesController.js

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
    await this.cargarTablaDiagnostico();
  }

  async cargarTablaDiagnostico() {
    const tbody = document.getElementById('tabla-reporte-bitmask');
    if (!tbody) return;

    try {
      const surtidores = await this.adapter.obtenerSurtidores();
      tbody.innerHTML = '';

      surtidores.forEach(surtidor => {
        const mask = surtidor.estado_mask || 0;
        const decoded = BitwiseDecoder.decodificarEstado(mask);
        const bitsArray = decoded.binaryString.split(''); // ej: ['0', '0', '1', '1']

        // Generar badges de bits (1 = azul/activo, 0 = gris)
        const bitsHTML = bitsArray.map((bit, idx) => `
          <span class="w-6 h-7 inline-flex items-center justify-center font-bold text-xs border rounded-md transition-all ${
            bit === '1' 
              ? 'bg-sky-500 text-white border-sky-600 shadow-sm' 
              : 'bg-slate-100 text-slate-400 border-slate-300'
          }" title="Bit ${3 - idx}">
            ${bit}
          </span>
        `).join('');

        tbody.innerHTML += `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="p-4 font-bold text-slate-900">Surtidor #${surtidor.numero}</td>
            <td class="p-4 font-bold font-mono text-sky-600">${mask}</td>
            <td class="p-4">
              <div class="flex gap-1 items-center">
                ${bitsHTML}
              </div>
            </td>
            <td class="p-4">
              <div class="flex flex-wrap gap-1">
                ${decoded.estados.map(st => `
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    st.includes('Alerta') || st.includes('Fuga')
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-sky-100 text-sky-800 border border-sky-200'
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
      console.error("Error al cargar diagnóstico binario:", err);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new ReportesController());