// js/utils/BitwiseDecoder.js

export class BitwiseDecoder {
  // Constantes de Bitmask (Máscara de Bits)
  static OPERATIVO = 1;       // Bit 0 (2^0 = 1) -> 0001
  static NIVEL_BAJO = 2;      // Bit 1 (2^1 = 2) -> 0010 (Generado por Trigger)
  static MANTENIMIENTO = 4;  // Bit 2 (2^2 = 4) -> 0100
  static FUGA = 8;           // Bit 3 (2^3 = 8) -> 1000

  /**
   * Decodifica un entero mediante operaciones bitwise
   * @param {number} mask - El entero estado_mask de Supabase
   * @returns {Object} Representación binaria y lista de estados activos
   */
  static decodificarEstado(mask = 0) {
    const estados = [];

    // Evaluaciones Bitwise mediante el operador AND (&)
    if (mask & this.OPERATIVO) {
      estados.push('Operativo');
    }
    if (mask & this.NIVEL_BAJO) {
      estados.push('Alerta Nivel Bajo (<15%)');
    }
    if (mask & this.MANTENIMIENTO) {
      estados.push('En Mantenimiento');
    }
    if (mask & this.FUGA) {
      estados.push('Fuga Detectada');
    }

    if (estados.length === 0) {
      estados.push('Inactivo');
    }

    return {
      maskOriginal: mask,
      // Representación en cadena binaria de 4 bits (ej. 3 -> "0011")
      binaryString: (mask & 0b1111).toString(2).padStart(4, '0'),
      estados: estados
    };
  }
}