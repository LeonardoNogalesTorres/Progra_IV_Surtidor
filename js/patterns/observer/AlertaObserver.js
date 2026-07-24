// js/patterns/observer/AlertaObserver.js

import { supabase } from '../../config/supabase.js';

export class AlertaObserver {
  constructor() {
    this.observadores = [];
    this.canal = null;
  }

  // Registra un callback/observador que reaccionará a nuevas alertas
  suscribir(callback) {
    this.observadores.push(callback);

    if (!this.canal && supabase) {
      // Escuchar eventos INSERT en la tabla 'alertas' vía WebSocket Realtime
      this.canal = supabase
        .channel('alertas-realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'alertas' },
          (payload) => {
            this.notificar(payload.new);
          }
        )
        .subscribe();
    }
  }

  // Notifica a todas las pantallas/componentes suscritos
  notificar(nuevaAlerta) {
    this.observadores.forEach(fn => fn(nuevaAlerta));
  }

  desconectar() {
    if (this.canal) {
      supabase.removeChannel(this.canal);
    }
  }
}