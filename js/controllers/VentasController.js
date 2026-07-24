import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { renderSidebar } from '../components/Sidebar.js';

class VentasController {
  constructor() {
    this.adapter = new SupabaseAdapter();
    this.surtidores = [];
    this.surtidorSeleccionado = null;
    this.init();
  }

  async init() {
    renderSidebar('ventas.html');
    await this.cargarSurtidores();
    this.setupListeners();
  }

  async cargarSurtidores() {
    const select = document.getElementById('select-surtidor');
    if (!select) return;

    this.surtidores = await this.adapter.obtenerSurtidores();
    select.innerHTML = '';

    if (this.surtidores.length === 0) {
      select.innerHTML = `<option>No hay surtidores disponibles</option>`;
      return;
    }

    this.surtidores.forEach(s => {
      const nombreComb = s.tipos_combustible?.nombre || 'Combustible';
      select.innerHTML += `<option value="${s.id}">Surtidor #${s.numero} - ${nombreComb} (${s.nivel}L disponible)</option>`;
    });

    this.seleccionarSurtidor(this.surtidores[0].id);
  }

  seleccionarSurtidor(id) {
    this.surtidorSeleccionado = this.surtidores.find(s => s.id === id);
    if (!this.surtidorSeleccionado) return;

    const tipo = this.surtidorSeleccionado.tipos_combustible;
    document.getElementById('input-combustible').value = tipo?.nombre || 'General';
    document.getElementById('input-precio-unitario').value = `$${tipo?.precio_por_litro || 0}`;

    this.calcularTotales();
  }

  calcularTotales() {
    if (!this.surtidorSeleccionado) return;

    const litros = parseFloat(document.getElementById('input-litros').value) || 0;
    const precio = this.surtidorSeleccionado.tipos_combustible?.precio_por_litro || 0;
    const total = litros * precio;

    document.getElementById('ticket-surtidor').textContent = `#${this.surtidorSeleccionado.numero}`;
    document.getElementById('ticket-combustible').textContent = this.surtidorSeleccionado.tipos_combustible?.nombre || '';
    document.getElementById('ticket-litros').textContent = `${litros.toFixed(2)} L`;
    document.getElementById('ticket-precio').textContent = `$${precio.toFixed(2)}`;
    document.getElementById('ticket-total').textContent = `$${total.toFixed(2)}`;
  }

  setupListeners() {
    document.getElementById('select-surtidor')?.addEventListener('change', (e) => {
      this.seleccionarSurtidor(e.target.value);
    });

    document.getElementById('input-litros')?.addEventListener('input', () => {
      this.calcularTotales();
    });

    document.getElementById('form-venta')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.procesarVenta();
    });
  }

  async procesarVenta() {
    const userSession = JSON.parse(localStorage.getItem('gasadmin_user') || '{}');
    const litros = parseFloat(document.getElementById('input-litros').value);
    const precio = this.surtidorSeleccionado.tipos_combustible?.precio_por_litro || 0;

    if (litros > this.surtidorSeleccionado.nivel) {
      alert("❌ Error: Cantidad solicitada supera el stock disponible en este surtidor.");
      return;
    }

    const venta = {
      surtidor_id: this.surtidorSeleccionado.id,
      usuario_id: userSession.id,
      litros: litros,
      precio_unitario: precio,
      total: litros * precio
    };

    try {
      await this.adapter.registrarVenta(venta);
      alert("✅ Compra realizada con éxito. Stock descontado.");
      window.location.reload();
    } catch (err) {
      alert("Error al procesar compra: " + err.message);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new VentasController());