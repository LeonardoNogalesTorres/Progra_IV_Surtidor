import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { BitwiseDecoder } from '../utils/BitwiseDecoder.js';
import { renderSidebar } from '../components/Sidebar.js';

class DashboardController {
  constructor() {
    this.adapter = new SupabaseAdapter();
    this.init();
  }

  async init() {
    // 1. Renderizar el Sidebar
    renderSidebar('index.html');

    // 2. Cargar datos
    await this.cargarKPIs();
    await this.cargarSurtidores();
  }

  async cargarKPIs() {
    try {
      const ventas = await this.adapter.obtenerVentasHoy();
      const surtidores = await this.adapter.obtenerSurtidores();
      const alertas = await this.adapter.obtenerAlertasPendientes();

      // Totales
      const totalMonto = ventas.reduce((acc, v) => acc + Number(v.total), 0);
      const totalLitros = ventas.reduce((acc, v) => acc + Number(v.litros), 0);
      
      // Surtidores operativos (Bit 0 activo)
      const operativos = surtidores.filter(s => s.estado_mask & BitwiseDecoder.OPERATIVO).length;

      // Actualizar DOM
      document.getElementById('kpi-total-ventas').textContent = `$${totalMonto.toFixed(2)}`;
      document.getElementById('kpi-total-litros').textContent = `${totalLitros.toFixed(2)} L`;
      document.getElementById('kpi-surtidores-activos').textContent = `${operativos}/${surtidores.length}`;
      document.getElementById('kpi-alertas-activas').textContent = alertas.length;
    } catch (error) {
      console.error("Error al cargar KPIs:", error);
    }
  }

  async cargarSurtidores() {
    const container = document.getElementById('grid-surtidores-dashboard');
    if (!container) return;

    try {
      const surtidores = await this.adapter.obtenerSurtidores();
      container.innerHTML = '';

      surtidores.forEach(surtidor => {
        const porcentaje = Math.round((surtidor.nivel / surtidor.capacidad) * 100);
        const bitInfo = BitwiseDecoder.decodificarEstado(surtidor.estado_mask);

        // Color de la barra según nivel
        let barColor = 'bg-emerald-500';
        if (porcentaje <= 15) barColor = 'bg-red-500 animate-pulse';
        else if (porcentaje <= 40) barColor = 'bg-amber-500';

        container.innerHTML += `
          <div class="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div class="flex justify-between items-center mb-3">
              <div>
                <h3 class="font-bold text-base">Surtidor #${surtidor.numero}</h3>
                <span class="text-xs font-semibold px-2 py-0.5 rounded ${porcentaje <= 15 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}">
                  ${bitInfo.estados.join(' | ')}
                </span>
              </div>
              <span class="text-xs font-bold px-2.5 py-1 rounded bg-slate-800 text-white uppercase">
                ${surtidor.combustible}
              </span>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between text-xs font-medium text-slate-600">
                <span>Nivel de Tanque</span>
                <span class="font-mono font-bold">${surtidor.nivel}L / ${surtidor.capacidad}L</span>
              </div>
              <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full ${barColor} transition-all duration-500" style="width: ${porcentaje}%"></div>
              </div>
            </div>
          </div>
        `;
      });
    } catch (error) {
      container.innerHTML = `<p class="text-red-500">Error cargando surtidores: ${error.message}</p>`;
    }
  }
}

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => new DashboardController());