export class BitwiseDecoder {
  // Constantes de bitmask
  static OPERATIVO = 1;       // Bit 0 (0001)
  static NIVEL_BAJO = 2;      // Bit 1 (0010)
  static MANTENIMIENTO = 4;  // Bit 2 (0100)
  static FUGA = 8;           // Bit 3 (1000)

  static decodificarEstado(mask) {
    const estados = [];
    
    if (mask & this.OPERATIVO) estados.push('Operativo');
    if (mask & this.NIVEL_BAJO) estados.push('Alerta Nivel Bajo');
    if (mask & this.MANTENIMIENTO) estados.push('En Mantenimiento');
    if (mask & this.FUGA) estados.push('Fuga Detectada');

    return {
      maskOriginal: mask,
      binaryString: mask.toString(2).padStart(4, '0'),
      estados: estados.length > 0 ? estados : ['Inactivo']
    };
  }
}