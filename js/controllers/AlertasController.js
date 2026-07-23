import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { AlertaObserver } from '../patterns/observer/AlertaObserver.js';
import { renderSidebar } from '../components/Sidebar.js';

class AlertasController {
  constructor() {
    this.adapter = new SupabaseAdapter();
    this.observer = new AlertaObserver();
    this.init();
  }

  async init() {
    // 1. Sidebar
    renderSidebar('alertas.html');

    // 2. Cargar alertas iniciales de la BD
    await this.cargarTablaAlertas();

    // 3. Suscribir el Observer para recibir alertas en Realtime de Supabase
    this.observer.suscribir((nuevaAlerta) => {
      this.mostrarBannerAlerta(nuevaAlerta);
      this.cargarTablaAlertas(); // Recargar la tabla automáticamente
    });
  }

  async cargarTablaAlertas() {
    const tbody = document.getElementById('tabla-alertas-body');
    const bannerCritico = document.getElementById('banner-alerta-critica');
    if (!tbody) return;

    try {
      const alertas = await this.adapter.obtenerAlertas();
      tbody.innerHTML = '';

      let tieneCriticas = false;

      if (alertas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">No hay alertas registradas en el sistema.</td></tr>`;
        bannerCritico?.classList.add('hidden');
        return;
      }

      alertas.forEach(alerta => {
        const esPendiente = alerta.estado === 'pendiente';
        if (esPendiente) tieneCriticas = true;

        const fechaFormateada = new Date(alerta.fecha).toLocaleString();

        tbody.innerHTML += `
          <tr class="hover:bg-slate-50 transition-colors ${esPendiente ? 'bg-red-50/40' : ''}">
            <td class="p-4 font-bold font-mono">Surtidor #${alerta.surtidor_id.substring(0, 5)}</td>
            <td class="p-4 font-semibold ${esPendiente ? 'text-red-600' : 'text-slate-700'}">${alerta.tipo}</td>
            <td class="p-4 text-xs text-slate-500">${fechaFormateada}</td>
            <td class="p-4">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
                esPendiente ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
              }">
                ${alerta.estado.toUpperCase()}
              </span>
            </td>
            <td class="p-4 text-right">
              ${esPendiente ? `
                <button data-id="${alerta.id}" class="btn-atender bg-slate-800 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-slate-900 transition-colors">
                  Marcar como Atendida
                </button>
              ` : '<span class="text-xs text-slate-400 italic">Atendida</span>'}
            </td>
          </tr>
        `;
      });

      // Mostrar/Ocultar Banner Crítico superior
      if (bannerCritico) {
        if (tieneCriticas) bannerCritico.classList.remove('hidden');
        else bannerCritico.classList.add('hidden');
      }

      this.setupEventListeners();
    } catch (error) {
      console.error("Error al cargar alertas:", error);
    }
  }

  mostrarBannerAlerta(alerta) {
    alert(`🚨 ALERTA RECIBIDA EN TIEMPO REAL:\n${alerta.tipo}`);
  }

  setupEventListeners() {
    // Delegación de eventos para botones de "Marcar como Atendida"
    document.querySelectorAll('.btn-atender').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        try {
          await this.adapter.atenderAlerta(id);
          await this.cargarTablaAlertas(); // Recargar cambios
        } catch (err) {
          alert("Error al actualizar la alerta");
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new AlertasController());