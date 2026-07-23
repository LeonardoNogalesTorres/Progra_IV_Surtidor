import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';
import { SurtidorFactory } from '../patterns/factory/SurtidorFactory.js';
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
    await this.cargarSurtidoresSelect();
    this.setupListeners();
  }

  async cargarSurtidoresSelect() {
    const select = document.getElementById('select-surtidor');
    if (!select) return;

    this.surtidores = await this.adapter.obtenerSurtidores();
    select.innerHTML = '';

    this.surtidores.forEach(s => {
      select.innerHTML += `<option value="${s.id}">Surtidor #${s.numero} - ${s.combustible}</option>`;
    });

    if (this.surtidores.length > 0) {
      this.seleccionarSurtidor(this.surtidores[0].id);
    }
  }

  seleccionarSurtidor(id) {
    const datos = this.surtidores.find(s => s.id === id);
    if (!datos) return;

    // Uso de Factory Pattern
    this.surtidorSeleccionado = SurtidorFactory.crearSurtidor(datos);
    
    document.getElementById('input-combustible').value = this.surtidorSeleccionado.combustible;
    this.calcularTotales();
  }

  calcularTotales() {
    if (!this.surtidorSeleccionado) return;

    const litros = parseFloat(document.getElementById('input-litros').value) || 0;
    const precio = this.surtidorSeleccionado.precioLitro;
    const total = litros * precio;

    // Actualizar Ticket Preview
    document.getElementById('ticket-surtidor').textContent = `#${this.surtidorSeleccionado.numero}`;
    document.getElementById('ticket-litros').textContent = `${litros.toFixed(2)} L`;
    document.getElementById('ticket-precio').textContent = `$${precio.toFixed(2)}`;
    document.getElementById('ticket-total').textContent = `$${total.toFixed(2)}`;
  }

  setupListeners() {
    // Listener de cambio de surtidor
    document.getElementById('select-surtidor')?.addEventListener('change', (e) => {
      this.seleccionarSurtidor(e.target.value);
    });

    // Listener de cambio de litros
    document.getElementById('input-litros')?.addEventListener('input', () => {
      this.calcularTotales();
    });

    // Listener de Submit del formulario
    document.getElementById('form-venta')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.procesarVenta();
    });
  }

  async procesarVenta() {
    const litros = parseFloat(document.getElementById('input-litros').value);
    const precio = this.surtidorSeleccionado.precioLitro;
    const total = litros * precio;

    if (litros > this.surtidorSeleccionado.nivel) {
      alert(" Error: No hay suficiente inventario en este surtidor.");
      return;
    }

    const nuevaVenta = {
      surtidor_id: this.surtidorSeleccionado.id,
      combustible: this.surtidorSeleccionado.combustible,
      litros: litros,
      precio: precio,
      total: total
    };

    try {
      await this.adapter.registrarVenta(nuevaVenta);
      alert(" Venta registrada exitosamente. Inventario actualizado.");
      window.location.href = 'index.html'; // Redirigir al dashboard para ver el cambio
    } catch (err) {
      alert(`Error al registrar venta: ${err.message}`);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new VentasController());