// js/components/Sidebar.js
export function renderSidebar(activePage) {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  const links = [
    { name: 'Dashboard', icon: 'dashboard', url: 'index.html' },
    { name: 'Surtidores', icon: 'ev_station', url: 'surtidores.html' },
    { name: 'Ventas', icon: 'receipt_long', url: 'ventas.html' },
    { name: 'Alertas', icon: 'warning', url: 'alertas.html' },
    { name: 'Reportes', icon: 'analytics', url: 'reportes.html' }
  ];

  container.innerHTML = `
    <aside class="flex flex-col w-[260px] h-screen fixed left-0 top-0 bg-[#2c3135] text-white z-50">
      <div class="p-6">
        <span class="text-xl font-black text-sky-300">GasAdmin Pro</span>
        <p class="text-xs text-slate-400">Sistema de Control</p>
      </div>
      <nav class="flex-1 space-y-1 px-3">
        ${links.map(link => {
          const isActive = link.url === activePage;
          return `
            <a href="${link.url}" class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700'
            }">
              <span class="material-symbols-outlined">${link.icon}</span>
              <span>${link.name}</span>
            </a>
          `;
        }).join('')}
      </nav>
    </aside>
  `;
}