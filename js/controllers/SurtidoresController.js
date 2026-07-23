import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { BitwiseDecoder } from '../utils/BitwiseDecoder.js';
import { renderSidebar } from '../components/Sidebar.js';

class SurtidoresController {
  constructor() {
    this.adapter = new SupabaseAdapter();
    this.init();
  }

  async init() {
    // 1. Renderizar Sidebar indicando página activa
    renderSidebar('surtidores.html');
    
    // 2. Cargar Surtidores
    await this.cargarSurtidores();
  }

  async cargarSurtidores() {
    const container = document.getElementById('surtidores-container');
    if (!container) return;

    try {
      const surtidores = await this.adapter.obtenerSurtidores();
      container.innerHTML = '';

      surtidores.forEach(surtidor => {
        const porcentaje = Math.round((surtidor.nivel / surtidor.capacidad) * 100);
        const bitInfo = BitwiseDecoder.decodificarEstado(surtidor.estado_mask || 0);

        // Color del indicador según el nivel de combustible
        let barColor = 'bg-amber-500';
        if (surtidor.combustible.toLowerCase().includes('premium')) barColor = 'bg-sky-500';
        if (surtidor.combustible.toLowerCase().includes('especial')) barColor = 'bg-emerald-500';

        container.innerHTML += `
          <div class="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
            <!-- Header de Tarjeta -->
            <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div class="flex items-center gap-3">
                <span class="font-bold text-lg">Surtidor #${surtidor.numero}</span>
                <span class="px-2 py-0.5 text-xs font-black uppercase rounded bg-slate-200 text-slate-700">
                  ${surtidor.combustible}
                </span>
              </div>
            </div>

            <!-- Cuerpo con Medidor Vertical -->
            <div class="p-5 flex gap-6">
              <!-- Tanque / Gauge Vertical -->
              <div class="flex flex-col items-center">
                <div class="w-14 h-40 bg-slate-100 rounded border border-slate-300 relative overflow-hidden flex items-end">
                  <div class="w-full ${barColor} transition-all duration-700" style="height: ${porcentaje}%;"></div>
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span class="font-mono text-xs font-bold drop-shadow">${porcentaje}%</span>
                  </div>
                </div>
                <span class="mt-2 text-[10px] text-slate-500 font-bold uppercase">Nivel</span>
              </div>

              <!-- Información de Capacidad y Bitmask -->
              <div class="flex-1 space-y-4">
                <div>
                  <p class="text-xs text-slate-400 font-bold uppercase">Capacidad Actual</p>
                  <p class="text-2xl font-black text-slate-800">${surtidor.nivel} <span class="text-xs font-normal text-slate-500">Litros</span></p>
                </div>

                <div>
                  <p class="text-xs text-slate-400 font-bold uppercase mb-2">Estado de Hardware (Bitmask)</p>
                  <div class="flex flex-wrap gap-1">
                    ${bitInfo.estados.map(st => `
                      <span class="px-2 py-1 rounded text-xs font-bold ${
                        st.includes('Alerta') ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-700'
                      }">
                        ${st}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button onclick="alert('Función de edición rápida')" class="flex-1 bg-white border border-slate-300 py-2 rounded text-xs font-bold text-slate-700 hover:bg-slate-100">
                Editar
              </button>
              <button class="flex-1 bg-sky-600 text-white py-2 rounded text-xs font-bold hover:bg-sky-700" onclick="window.location.href='ventas.html'">
                Despachar
              </button>
            </div>
          </div>
        `;
      });
    } catch (error) {
      console.error("Error al cargar surtidores:", error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new SurtidoresController());