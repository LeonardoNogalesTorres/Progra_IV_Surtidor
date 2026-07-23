import { supabase } from '../../config/supabase.js';

export class AlertaObserver {
  constructor() {
    this.subscripciones = [];
  }

  suscribir(callback) {
    this.subscripciones.push(callback);
    
    // Escucha en tiempo real inserciones en la tabla 'alertas'
    supabase
      .channel('alertas-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alertas' }, (payload) => {
        this.notificar(payload.new);
      })
      .subscribe();
  }

  notificar(nuevaAlerta) {
    this.subscripciones.forEach((fn) => fn(nuevaAlerta));
  }
}