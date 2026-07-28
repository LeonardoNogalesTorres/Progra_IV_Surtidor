// js/components/Sidebar.js

export function renderSidebar(activePage) {
  const container = document.getElementById('sidebar-container');
  if (!container) {
    console.error("❌ No se encontró el elemento <aside id='sidebar-container'> en el HTML.");
    return;
  }

  // 1. Obtener la sesión activa
  const sessionData = localStorage.getItem('gasadmin_user');
  if (!sessionData && activePage !== 'login.html') {
    window.location.href = 'login.html';
    return;
  }

  const user = sessionData ? JSON.parse(sessionData) : { nombre: 'Usuario', email: '', rol: 'cliente' };
  const isAdmin = user.rol === 'admin';

  // 2. Control de Permisos de Navegación
  const paginasAdmin = ['index.html', 'alertas.html', 'reportes.html'];
  if (!isAdmin && paginasAdmin.includes(activePage)) {
    window.location.href = 'ventas.html';
    return;
  }

  // 3. Generar enlaces según el Rol
  const links = [
    { name: 'Dashboard', icon: 'dashboard', url: 'index.html', adminOnly: true },
    { name: 'Surtidores', icon: 'ev_station', url: 'surtidores.html', adminOnly: false },
    { name: 'Comprar / Ventas', icon: 'receipt_long', url: 'ventas.html', adminOnly: false },
    { name: 'Panel Alertas', icon: 'warning', url: 'alertas.html', adminOnly: true },
    { name: 'Reportes & Bits', icon: 'analytics', url: 'reportes.html', adminOnly: true }
  ];

  const visibleLinks = links.filter(link => !link.adminOnly || isAdmin);

  // 4. Inyectar HTML en el DOM
  container.innerHTML = `
    <aside class="flex flex-col w-[260px] h-screen fixed left-0 top-0 bg-slate-900 text-white z-50 border-r border-slate-800">
      <div class="p-6 border-b border-slate-800">
        <span class="text-xl font-black text-sky-400">BomboClap</span>
        <p class="text-[10px] uppercase tracking-widest text-slate-400 mt-1">
          Rol: <span class="${isAdmin ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}">${user.rol.toUpperCase()}</span>
        </p>
      </div>

      <nav class="flex-1 space-y-1 px-3 mt-4">
        ${visibleLinks.map(link => `
          <a href="${link.url}" class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
            link.url === activePage ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }">
            <span class="material-symbols-outlined text-lg">${link.icon}</span>
            <span>${link.name}</span>
          </a>
        `).join('')}
      </nav>

      <div class="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
        <div class="overflow-hidden">
          <p class="text-xs font-bold text-white truncate">${user.nombre}</p>
          <p class="text-[9px] text-slate-400 truncate">${user.email}</p>
        </div>
        <button id="btn-sidebar-logout" title="Cerrar Sesión" class="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    </aside>
  `;

  // 5. Vincular Evento de Cerrar Sesión
  const logoutBtn = document.getElementById('btn-sidebar-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('gasadmin_user');
      sessionStorage.clear();
      window.location.href = 'login.html';
    });
  }
}