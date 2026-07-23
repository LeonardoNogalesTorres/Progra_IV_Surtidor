// js/config/supabase.js

// ⚠️ Reemplaza con tus credenciales de tu panel de Supabase (Project Settings > API)
const SUPABASE_URL = 'https://wduyzrvqebusmbwfxhzz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_S7Dx98mjRrjSOOn6fpTCDw_M08jFrVd';

// Inicialización del cliente global usando la librería importada en los HTML
export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);