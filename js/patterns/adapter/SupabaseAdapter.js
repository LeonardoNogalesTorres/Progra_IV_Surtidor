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

    async obtenerVentasHoy() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('ventas')
            .select('*')
            .gte('fecha', hoy.toISOString());

        if (error) throw error;
        return data;
    }

    async obtenerAlertas() {
        const { data, error } = await supabase
            .from('alertas')
            .select('*')
            .order('fecha', { ascending: false });
        if (error) throw error;
        return data;
    }

    async atenderAlerta(id) {
        const { data, error } = await supabase
            .from('alertas')
            .update({ estado: 'atendida' })
            .eq('id', id);
        if (error) throw error;
        return data;
    }
}