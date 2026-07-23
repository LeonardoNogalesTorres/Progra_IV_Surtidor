import { supabase } from '../../config/supabase.js';

export class SupabaseAdapter {
  async obtenerSurtidores() {
    const { data, error } = await supabase.from('surtidores').select('*').order('numero');
    if (error) throw error;
    return data;
  }

  async registrarVenta(venta) {
    const { data, error } = await supabase.from('ventas').insert([venta]);
    if (error) throw error;
    return data;
  }

  async obtenerAlertas() {
    const { data, error } = await supabase.from('alertas').select('*').order('fecha', { ascending: false });
    if (error) throw error;
    return data;
  }
}