/**
 * Petugas Sidebar — inject & initialize
 * Halaman guna: <aside id="sidebar" data-active="dashboard|peminjaman|pengembalian"></aside>
 * Kemudian: <script src="../store.js"></script><script src="sidebar.js"></script>
 */
(function () {
  const aside = document.getElementById('sidebar');
  if (!aside) return;

  const active = aside.dataset.active || '';

  function navClass(key) {
    return active === key
      ? 'flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-brand-primary text-white font-semibold text-xs tracking-wide shadow-sm transition-all'
      : 'flex items-center gap-3 px-3.5 py-2.5 rounded-full text-gray-600 hover:text-gray-950 hover:bg-gray-50 text-xs font-semibold transition-all group';
  }

  function navClassBadge(key) {
    return active === key
      ? 'flex items-center justify-between px-3.5 py-2.5 rounded-full bg-brand-primary text-white font-semibold text-xs tracking-wide shadow-sm transition-all'
      : 'flex items-center justify-between px-3.5 py-2.5 rounded-full text-gray-600 hover:text-gray-950 hover:bg-gray-50 text-xs font-semibold transition-all group';
  }

  function iconClass(key) {
    return active === key ? 'w-4 h-4 text-brand-mint' : 'w-4 h-4 text-gray-400 group-hover:text-brand-primary';
  }

  aside.className = 'fixed inset-y-0 left-0 z-50 w-72 bg-white px-6 py-7 flex flex-col justify-between border-r border-gray-100 transform -translate-x-full transition-transform duration-300 ease-in-out lg:static lg:w-[265px] lg:translate-x-0 shrink-0';

  aside.innerHTML = `
    <div class="space-y-6">
      <!-- Logo -->
      <div class="flex items-center justify-between px-2">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-2xl bg-brand-primary flex items-center justify-center text-brand-mint shadow-md shadow-brand-primary/20">
            <i data-lucide="flask-conical" stroke-width="2.5" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-extrabold text-lg tracking-tight text-gray-900 leading-tight">SIM Makmal</span>
              <span class="text-[9px] font-bold bg-brand-mint text-brand-primary-dark px-1.5 py-0.5 rounded">PETUGAS</span>
            </div>
            <span class="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">Operasi Harian</span>
          </div>
        </div>
        <button id="mobile-close-btn" type="button" class="lg:hidden p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
          <i data-lucide="x" stroke-width="2.5" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Role Switcher -->
      <div class="px-2">
        <div class="p-1.5 bg-gray-100 rounded-xl flex items-center text-[10.5px] font-bold">
          <a href="../admin/dashboard.html" class="flex-1 py-1 text-center text-gray-500 hover:text-gray-900">Admin</a>
          <span class="flex-1 py-1 text-center bg-white text-brand-primary rounded-lg shadow-xs">Petugas</span>
          <a href="../siswa/dashboard.html" class="flex-1 py-1 text-center text-gray-500 hover:text-gray-900">Siswa</a>
        </div>
      </div>

      <!-- Tugas Operasi -->
      <div>
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3">Tugas Operasi</span>
        <nav class="mt-2 space-y-1.5">
          <a href="dashboard.html" class="${navClass('dashboard')}">
            <i data-lucide="layout-grid" stroke-width="2.5" class="${iconClass('dashboard')}"></i>
            <span>Papan Pemuka</span>
          </a>
          <a href="peminjaman.html" class="${navClassBadge('peminjaman')}">
            <div class="flex items-center gap-3">
              <i data-lucide="arrow-up-right-from-circle" stroke-width="2.5" class="${iconClass('peminjaman')}"></i>
              <span>Peminjaman Baharu</span>
            </div>
            <span class="${active === 'peminjaman' ? 'bg-brand-mint text-brand-primary-dark' : 'bg-emerald-50 text-brand-primary border border-emerald-100'} text-[10px] font-bold px-2 py-0.5 rounded-full" id="badge-active-loans">0</span>
          </a>
          <a href="pengembalian.html" class="${navClassBadge('pengembalian')}">
            <div class="flex items-center gap-3">
              <i data-lucide="arrow-down-left-from-circle" stroke-width="2.5" class="${iconClass('pengembalian')}"></i>
              <span>Pengesahan Pulang</span>
            </div>
            <span class="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-100 hidden" id="badge-overdue-loans">0</span>
          </a>
        </nav>
      </div>

      <!-- Info Operasi -->
      <div class="p-3.5 bg-brand-mint-subtle rounded-2xl border border-brand-mint/20 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-brand-primary">Makmal Sains Aktif</span>
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p class="text-[11px] text-gray-600 leading-relaxed">Sesi amali praktikal dibuka. Pastikan rekod kondisi fizikal disemak teliti.</p>
      </div>
    </div>

    <!-- Bottom: Profile -->
    <div class="pt-4 border-t border-gray-100 flex items-center gap-3 px-2">
      <div class="w-9 h-9 rounded-full bg-brand-primary text-brand-mint font-bold text-xs flex items-center justify-center ring-2 ring-brand-mint/30 user-avatar-initials">PTG</div>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-bold text-gray-900 truncate user-display-name">-</div>
        <div class="text-[10px] text-gray-400 font-medium user-display-role">Petugas Makmal</div>
      </div>
      <button type="button" onclick="if(typeof MakmalStore!=='undefined') MakmalStore.logout(); else window.location.replace('../index.html');" class="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Log Keluar">
        <i data-lucide="log-out" stroke-width="2.5" class="w-4 h-4"></i>
      </button>
    </div>
  `;

  // Lucide icons
  if (window.lucide) window.lucide.createIcons();

  // Mobile toggle
  const closeBtn = document.getElementById('mobile-close-btn');
  const menuBtn = document.getElementById('mobile-menu-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => aside.classList.add('-translate-x-full'));
  if (menuBtn) menuBtn.addEventListener('click', () => aside.classList.remove('-translate-x-full'));

  // Badge + user UI updater
  function updateSidebarData() {
    if (typeof MakmalStore === 'undefined') return;
    const metrics = MakmalStore.getMetrics();

    const badgeActive = document.getElementById('badge-active-loans');
    const badgeOverdue = document.getElementById('badge-overdue-loans');

    if (badgeActive) badgeActive.textContent = metrics.activeLoansCount + metrics.overdueLoansCount;
    if (badgeOverdue) {
      badgeOverdue.textContent = metrics.overdueLoansCount;
      badgeOverdue.classList.toggle('hidden', metrics.overdueLoansCount === 0);
    }

    MakmalStore.renderCurrentUserUI();
  }

  document.addEventListener('DOMContentLoaded', updateSidebarData);
  window.addEventListener('sim_makmal_sync', updateSidebarData);
})();
