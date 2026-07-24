// js/config/supabase.js

// ⚠️ Reemplaza con tus credenciales de tu panel de Supabase (Project Settings > API)
const SUPABASE_URL = 'https://wduyzrvqebusmbwfxhzz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_S7Dx98mjRrjSOOn6fpTCDw_M08jFrVd';

if (!window.supabase) {
  console.error("❌ El SDK de Supabase no está cargado. Revisa la etiqueta <script> en el HTML.");
}

export const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;