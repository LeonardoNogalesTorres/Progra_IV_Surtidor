// js/controllers/AlertasController.js

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
    renderSidebar('alertas.html');
    await this.cargarTablaAlertas();

    // Suscribir el observador en tiempo real
    this.observer.suscribir((nuevaAlerta) => {
      this.notificarAlertaTiempoReal(nuevaAlerta);
      this.cargarTablaAlertas(); // Recargar la lista automáticamente
    });
  }

  async cargarTablaAlertas() {
    const tbody = document.getElementById('tabla-alertas-body');
    const bannerCritico = document.getElementById('banner-alerta-critica');
    if (!tbody) return;

    try {
      const alertas = await this.adapter.obtenerAlertas();
      tbody.innerHTML = '';

      let tienePendientes = false;

      if (alertas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-slate-400">Sin alertas registradas.</td></tr>`;
        bannerCritico?.classList.add('hidden');
        return;
      }

      alertas.forEach(alerta => {
        const esPendiente = alerta.estado === 'pendiente';
        if (esPendiente) tienePendientes = true;

        const numSurtidor = alerta.surtidores?.numero || 'N/A';
        const fecha = new Date(alerta.fecha).toLocaleString();

        tbody.innerHTML += `
          <tr class="hover:bg-slate-50 transition-colors ${esPendiente ? 'bg-red-50/50' : ''}">
            <td class="p-4 font-bold text-slate-900">Surtidor #${numSurtidor}</td>
            <td class="p-4 font-semibold ${esPendiente ? 'text-red-600' : 'text-slate-700'}">${alerta.tipo}</td>
            <td class="p-4 text-xs text-slate-500 font-mono">${fecha}</td>
            <td class="p-4">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
                esPendiente ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
              }">
                ${alerta.estado.toUpperCase()}
              </span>
            </td>
            <td class="p-4 text-right">
              ${esPendiente ? `
                <button data-id="${alerta.id}" class="btn-atender bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm">
                  Marcar Atendida
                </button>
              ` : '<span class="text-xs text-slate-400 italic">Atendida</span>'}
            </td>
          </tr>
        `;
      });

      if (bannerCritico) {
        if (tienePendientes) bannerCritico.classList.remove('hidden');
        else bannerCritico.classList.add('hidden');
      }

      this.setupEventListeners();
    } catch (err) {
      console.error("Error al cargar tabla de alertas:", err);
    }
  }

  notificarAlertaTiempoReal(alerta) {
    // Feedback visual instantáneo sin recargar la página
    alert(`🚨 ALERTA CRÍTICA EN TIEMPO REAL RECIBIDA:\nTipo: ${alerta.tipo}`);
  }

  setupEventListeners() {
    document.querySelectorAll('.btn-atender').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        try {
          await this.adapter.atenderAlerta(id);
          await this.cargarTablaAlertas();
        } catch (err) {
          alert("Error al actualizar la alerta: " + err.message);
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new AlertasController());