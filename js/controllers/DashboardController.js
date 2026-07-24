import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { BitwiseDecoder } from '../utils/BitwiseDecoder.js';
import { renderSidebar } from '../components/Sidebar.js';

class DashboardController {
  constructor() {
    this.adapter = new SupabaseAdapter();
    this.init();
  }

  async init() {
    renderSidebar('index.html');
    await this.cargarDashboard();
  }

  async cargarDashboard() {
    try {
      const [surtidores, ventas, alertas] = await Promise.all([
        this.adapter.obtenerSurtidores(),
        this.adapter.obtenerVentasHoy(),
        this.adapter.obtenerAlertas()
      ]);

      // --- KPIs ---
      const totalMonto = ventas.reduce((acc, v) => acc + Number(v.total || 0), 0);
      const totalLitros = ventas.reduce((acc, v) => acc + Number(v.litros || 0), 0);
      const alertasPendientes = alertas.filter(a => a.estado === 'pendiente').length;

      // Surtidores activos (Bit 0 = Operativo)
      const activos = surtidores.filter(s => s.estado_mask & BitwiseDecoder.OPERATIVO).length;

      document.getElementById('kpi-total-ventas').textContent = `$${totalMonto.toFixed(2)}`;
      document.getElementById('kpi-total-litros').textContent = `${totalLitros.toFixed(2)} L`;
      document.getElementById('kpi-surtidores-activos').textContent = `${activos}/${surtidores.length}`;
      document.getElementById('kpi-alertas-activas').textContent = alertasPendientes;

      // --- Grid de Surtidores ---
      const container = document.getElementById('grid-surtidores-dashboard');
      if (!container) return;

      container.innerHTML = '';

      if (surtidores.length === 0) {
        container.innerHTML = `<p class="text-slate-400 text-sm col-span-3">No hay surtidores registrados en Supabase.</p>`;
        return;
      }

      surtidores.forEach(s => {
        const porcentaje = Math.round((s.nivel / s.capacidad) * 100);
        const bitInfo = BitwiseDecoder.decodificarEstado(s.estado_mask || 0);
        const nombreCombustible = s.tipos_combustible?.nombre || 'Combustible';

        let barColor = 'bg-emerald-500';
        if (porcentaje <= 15) barColor = 'bg-red-500 animate-pulse';
        else if (porcentaje <= 40) barColor = 'bg-amber-500';

        container.innerHTML += `
          <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-black text-lg">Surtidor #${s.numero}</h3>
                <span class="text-[11px] font-bold px-2 py-0.5 rounded ${porcentaje <= 15 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}">
                  ${bitInfo.estados.join(' | ')}
                </span>
              </div>
              <span class="text-xs font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white uppercase">
                ${nombreCombustible}
              </span>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between text-xs font-semibold text-slate-500">
                <span>Nivel de Tanque</span>
                <span class="font-mono font-bold text-slate-800">${s.nivel}L / ${s.capacidad}L</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full ${barColor} transition-all duration-500" style="width: ${porcentaje}%"></div>
              </div>
            </div>
          </div>
        `;
      });

    } catch (err) {
      console.error("Error al cargar Dashboard:", err);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new DashboardController());