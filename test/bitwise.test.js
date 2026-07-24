import { BitwiseDecoder } from '../js/utils/BitwiseDecoder.js';

test('Decodifica correctamente la máscara de bits 3 (Operativo + Alerta)', () => {
  const resultado = BitwiseDecoder.decodificarEstado(3);
  expect(resultado.binaryString).toBe('0011');
  expect(resultado.estados).toContain('Operativo');
  expect(resultado.estados).toContain('Alerta Nivel Bajo (<15%)');
});