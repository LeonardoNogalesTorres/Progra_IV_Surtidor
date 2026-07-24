import { supabase } from '../../config/supabase.js';

export class SupabaseAdapter {
  // 1. Obtener Surtidores con su Tipo de Combustible (JOIN)
  async obtenerSurtidores() {
    const { data, error } = await supabase
      .from('surtidores')
      .select(`
        id,
        numero,
        capacidad,
        nivel,
        estado_mask,
        tipos_combustible (
          id,
          nombre,
          precio_por_litro
        )
      `)
      .order('numero', { ascending: true });

    if (error) throw error;
    return data;
  }

  // 2. Obtener Ventas de Hoy
  async obtenerVentasHoy() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('ventas')
      .select('*')
      .gte('fecha', hoy.toISOString());

    if (error) throw error;
    return data || [];
  }

  // 3. Registrar una Nueva Venta (Compra)
  async registrarVenta(venta) {
    const { data, error } = await supabase
      .from('ventas')
      .insert([venta])
      .select();

    if (error) throw error;
    return data;
  }

  // 4. Reabastecer un Surtidor (Solo Admin)
  async reabastecerSurtidor(surtidorId, adminId, litros) {
    const { data, error } = await supabase
      .from('reabastecimientos')
      .insert([{
        surtidor_id: surtidorId,
        admin_id: adminId,
        litros_ingresados: litros
      }]);

    if (error) throw error;
    return data;
  }

  // 5. Obtener Alertas Pendientes
  async obtenerAlertas() {
    const { data, error } = await supabase
      .from('alertas')
      .select(`
        id,
        tipo,
        fecha,
        estado,
        surtidores (
          numero
        )
      `)
      .order('fecha', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // 6. Marcar Alerta como Atendida
  async atenderAlerta(alertaId) {
    const { data, error } = await supabase
      .from('alertas')
      .update({ estado: 'atendida' })
      .eq('id', alertaId);

    if (error) throw error;
    return data;
  }

  // 7. Autenticar Usuario
  async autenticarUsuario(email, password) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}