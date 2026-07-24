import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { BitwiseDecoder } from '../utils/BitwiseDecoder.js';
import { renderSidebar } from '../components/Sidebar.js';

class SurtidoresController {
  constructor() {
    this.adapter = new SupabaseAdapter();
    this.init();
  }

  async init() {
    renderSidebar('surtidores.html');
    await this.cargarSurtidores();
  }

  async cargarSurtidores() {
    const container = document.getElementById('surtidores-container');
    if (!container) return;

    const userSession = JSON.parse(localStorage.getItem('gasadmin_user') || '{}');
    const isAdmin = userSession.rol === 'admin';

    try {
      const surtidores = await this.adapter.obtenerSurtidores();
      container.innerHTML = '';

      surtidores.forEach(s => {
        const porcentaje = Math.round((s.nivel / s.capacidad) * 100);
        const bitInfo = BitwiseDecoder.decodificarEstado(s.estado_mask || 0);
        const combustible = s.tipos_combustible?.nombre || 'General';

        container.innerHTML += `
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-center mb-4">
                <span class="font-black text-xl">Surtidor #${s.numero}</span>
                <span class="px-3 py-1 bg-slate-100 text-slate-800 font-bold text-xs rounded-lg uppercase">
                  ${combustible}
                </span>
              </div>

              <div class="flex gap-5 items-center mb-4">
                <div class="w-12 h-36 bg-slate-100 rounded-xl border border-slate-200 relative overflow-hidden flex items-end">
                  <div class="w-full bg-sky-500 transition-all duration-500" style="height: ${porcentaje}%"></div>
                  <span class="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold">${porcentaje}%</span>
                </div>

                <div class="space-y-3 flex-1">
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase">Capacidad Disponible</p>
                    <p class="text-2xl font-black">${s.nivel} <span class="text-xs font-normal text-slate-500">/ ${s.capacidad} L</span></p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Estado Bitmask</p>
                    <div class="flex flex-wrap gap-1">
                      ${bitInfo.estados.map(st => `
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${st.includes('Alerta') ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-700'}">
                          ${st}
                        </span>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            ${isAdmin ? `
              <div class="pt-3 border-t border-slate-100 flex gap-2">
                <button data-id="${s.id}" class="btn-rellenar flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs">
                  + Rellenar Tanque
                </button>
              </div>
            ` : ''}
          </div>
        `;
      });

      // Eventos para rellenar
      document.querySelectorAll('.btn-rellenar').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const id = e.target.getAttribute('data-id');
          const litros = prompt("Ingrese la cantidad de litros a ingresar:");
          if (litros && !isNaN(litros)) {
            try {
              await this.adapter.reabastecerSurtidor(id, userSession.id, parseFloat(litros));
              alert("✅ Surtidor reabastecido con éxito.");
              await this.cargarSurtidores();
            } catch (err) {
              alert("Error al reabastecer: " + err.message);
            }
          }
        });
      });

    } catch (err) {
      console.error("Error cargando surtidores:", err);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new SurtidoresController());