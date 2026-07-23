import { Surtidor } from '../../models/Surtidor.js';

export class SurtidorFactory {
  static crearSurtidor(datos) {
    // Configura precios o comportamientos según el combustible
    switch (datos.combustible.toLowerCase()) {
      case 'gasolina especial':
        datos.precioLitro = 3.74;
        break;
      case 'gasolina premium':
        datos.precioLitro = 4.79;
        break;
      case 'diesel':
        datos.precioLitro = 3.72;
        break;
      default:
        datos.precioLitro = 3.00;
    }
    return new Surtidor(datos);
  }
}