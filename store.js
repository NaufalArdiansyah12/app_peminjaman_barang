/**
 * SIM Makmal — Shared State Management & Data Store
 * Menyediakan penyimpanan tersinkronisasi berbasis localStorage untuk:
 * - Master Data Inventori Alatan Makmal (CRUD oleh Admin)
 * - Akaun Petugas Makmal (CRUD oleh Admin)
 * - Master Data Murid
 * - Transaksi Peminjaman & Rekod Pemulangan (Operasi oleh Petugas)
 * - Semakan Kendiri Alatan & Status Pinjaman (Read-Only oleh Siswa)
 */

const STORAGE_KEYS = {
  INVENTORY: 'sim_makmal_inventory_v2',
  OFFICERS: 'sim_makmal_officers_v2',
  STUDENTS: 'sim_makmal_students_v2',
  LOANS: 'sim_makmal_loans_v2',
  ACTIVITIES: 'sim_makmal_activities_v2'
};

const DEFAULT_OFFICERS = [
  {
    id: 'ADM-001',
    username: 'admin',
    name: 'Dr. Naufal (Ketua Makmal)',
    email: 'naufal@makmal.edu.my',
    phone: '012-3344556',
    role: 'Admin',
    labAssigned: 'Keseluruhan Makmal Sains',
    status: 'Aktif',
    lastLogin: 'Hari ini, 08:30'
  },
  {
    id: 'PTG-001',
    username: 'syahrul',
    name: 'En. Syahrul Nizam',
    email: 'syahrul@makmal.edu.my',
    phone: '013-9988771',
    role: 'Petugas',
    labAssigned: 'Makmal Kimia 1 & 2',
    status: 'Aktif',
    lastLogin: 'Hari ini, 07:55'
  },
  {
    id: 'PTG-002',
    username: 'halimah',
    name: 'Pn. Halimah binti Saad',
    email: 'halimah@makmal.edu.my',
    phone: '017-5544221',
    role: 'Petugas',
    labAssigned: 'Makmal Biologi',
    status: 'Aktif',
    lastLogin: 'Semalam, 14:20'
  },
  {
    id: 'PTG-003',
    username: 'meiling',
    name: 'Cik Tan Mei Ling',
    email: 'meiling@makmal.edu.my',
    phone: '019-1122334',
    role: 'Petugas',
    labAssigned: 'Makmal Fizik',
    status: 'Cuti',
    lastLogin: '3 hari lalu'
  }
];

const DEFAULT_INVENTORY = [
  {
    id: 'INV-BIO-001',
    name: 'Mikroskop Binokular Olympus CX23',
    category: 'Biologi',
    location: 'Almari B-01',
    totalQty: 15,
    availableQty: 11,
    borrowedQty: 4,
    damagedQty: 0,
    unit: 'Unit',
    specs: 'Pembesaran 40x - 1000x, lampu LED bersepadu'
  },
  {
    id: 'INV-KIM-001',
    name: 'Bikar Kaca Pyrex 250ml',
    category: 'Kimia',
    location: 'Rak K-03',
    totalQty: 60,
    availableQty: 46,
    borrowedQty: 12,
    damagedQty: 2,
    unit: 'Unit',
    specs: 'Kaca borosilikat tahan haba'
  },
  {
    id: 'INV-KIM-002',
    name: 'Pembakar Bunsen Keluli Tahan Karat',
    category: 'Kimia',
    location: 'Almari K-02',
    totalQty: 30,
    availableQty: 25,
    borrowedQty: 5,
    damagedQty: 0,
    unit: 'Unit',
    specs: 'Injap gas boleh laras, tapak berat'
  },
  {
    id: 'INV-FIZ-001',
    name: 'Neraca Tiga Palang Ohaus 311g',
    category: 'Fizik',
    location: 'Almari F-01',
    totalQty: 20,
    availableQty: 17,
    borrowedQty: 3,
    damagedQty: 0,
    unit: 'Set',
    specs: 'Ketepatan 0.01g, magnet redaman'
  },
  {
    id: 'INV-FIZ-002',
    name: 'Ammeter & Voltmeter Digital DC',
    category: 'Fizik',
    location: 'Laci F-04',
    totalQty: 25,
    availableQty: 20,
    borrowedQty: 4,
    damagedQty: 1,
    unit: 'Unit',
    specs: 'Skrin LCD 3.5 digit, probe pelbagai'
  },
  {
    id: 'INV-KIM-003',
    name: 'Set Tabung Uji Borosilikat (10 unit/rak)',
    category: 'Kimia',
    location: 'Rak K-01',
    totalQty: 40,
    availableQty: 34,
    borrowedQty: 6,
    damagedQty: 0,
    unit: 'Rak',
    specs: 'Termasuk rak kayu dan berus pembersih'
  },
  {
    id: 'INV-BIO-002',
    name: 'Set Pembedahan Biologi (Dissecting Kit)',
    category: 'Biologi',
    location: 'Almari B-03',
    totalQty: 18,
    availableQty: 15,
    borrowedQty: 3,
    damagedQty: 0,
    unit: 'Set',
    specs: 'Skalpel, gunting bedah, forsep keluli'
  },
  {
    id: 'INV-AM-001',
    name: 'Jam Randik Digital Elektronik Casio',
    category: 'Umum',
    location: 'Laci U-01',
    totalQty: 25,
    availableQty: 22,
    borrowedQty: 3,
    damagedQty: 0,
    unit: 'Unit',
    specs: 'Ketepatan 1/100 saat, kalis percikan air'
  },
  {
    id: 'INV-FIZ-003',
    name: 'Set Prisma Kaca Optik & Kotak Sinar',
    category: 'Fizik',
    location: 'Almari F-02',
    totalQty: 15,
    availableQty: 14,
    borrowedQty: 1,
    damagedQty: 0,
    unit: 'Set',
    specs: 'Prisma sama sisi 60°, kanta dwicembung/cekung'
  },
  {
    id: 'INV-KIM-004',
    name: 'Buret Kaca Akrilik 50ml Kelulusan A',
    category: 'Kimia',
    location: 'Rak K-04',
    totalQty: 24,
    availableQty: 22,
    borrowedQty: 1,
    damagedQty: 1,
    unit: 'Unit',
    specs: 'Kunci PTFE stopcock tanpa gris'
  }
];

const DEFAULT_STUDENTS = [
  { nis: '2024001', name: 'Ahmad Faiz bin Zulkifli', class: '5 Sains 1', phone: '012-3456789' },
  { nis: '2024002', name: 'Nur Aisyah binti Razak', class: '5 Sains 2', phone: '013-8877665' },
  { nis: '2024003', name: 'Chong Wei Lun', class: '4 Sains 1', phone: '017-6655443' },
  { nis: '2024004', name: 'Siti Sarah binti Halim', class: '5 Sains 1', phone: '019-2233445' },
  { nis: '2024005', name: 'Kavitha a/p Ramesh', class: '4 Sains 2', phone: '011-5544332' },
  { nis: '2024006', name: 'Muhammad Danial bin Azman', class: '5 Sains 3', phone: '018-9900112' }
];

function getDateOffset(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const DEFAULT_LOANS = [
  {
    id: 'TRX-202409-001',
    nis: '2024001',
    studentName: 'Ahmad Faiz bin Zulkifli',
    studentClass: '5 Sains 1',
    studentPhone: '012-3456789',
    purpose: 'Amali Kimia — Titrasi Asid Hidroklorik & Natrium Hidroksida',
    borrowDate: getDateOffset(-4),
    targetReturnDate: getDateOffset(-1), // Overdue!
    actualReturnDate: null,
    status: 'overdue',
    items: [
      { itemId: 'INV-KIM-001', name: 'Bikar Kaca Pyrex 250ml', qty: 4 },
      { itemId: 'INV-KIM-004', name: 'Buret Kaca Akrilik 50ml Kelulusan A', qty: 1 }
    ],
    officer: 'En. Syahrul Nizam',
    notes: 'Perlu pulangkan segera sebelum waktu rehat.'
  },
  {
    id: 'TRX-202409-002',
    nis: '2024002',
    studentName: 'Nur Aisyah binti Razak',
    studentClass: '5 Sains 2',
    studentPhone: '013-8877665',
    purpose: 'Pemerhatian Sel Bawang & Sel Pipi (Biologi KSSM)',
    borrowDate: getDateOffset(-1),
    targetReturnDate: getDateOffset(2),
    actualReturnDate: null,
    status: 'active',
    items: [
      { itemId: 'INV-BIO-001', name: 'Mikroskop Binokular Olympus CX23', qty: 2 },
      { itemId: 'INV-BIO-002', name: 'Set Pembedahan Biologi (Dissecting Kit)', qty: 1 }
    ],
    officer: 'Pn. Halimah binti Saad',
    notes: 'Untuk sesi amali petang.'
  },
  {
    id: 'TRX-202409-003',
    nis: '2024003',
    studentName: 'Chong Wei Lun',
    studentClass: '4 Sains 1',
    studentPhone: '017-6655443',
    purpose: 'Eksperimen Hukum Ohm & Rintangan Dawai',
    borrowDate: getDateOffset(-2),
    targetReturnDate: getDateOffset(1),
    actualReturnDate: null,
    status: 'active',
    items: [
      { itemId: 'INV-FIZ-002', name: 'Ammeter & Voltmeter Digital DC', qty: 2 },
      { itemId: 'INV-AM-001', name: 'Jam Randik Digital Elektronik Casio', qty: 1 }
    ],
    officer: 'En. Syahrul Nizam',
    notes: 'Guna di Makmal Fizik 1.'
  },
  {
    id: 'TRX-202409-004',
    nis: '2024004',
    studentName: 'Siti Sarah binti Halim',
    studentClass: '5 Sains 1',
    studentPhone: '019-2233445',
    purpose: 'Ujian Kualitatif Garam & Pembakaran Gas',
    borrowDate: getDateOffset(-6),
    targetReturnDate: getDateOffset(-4),
    actualReturnDate: getDateOffset(-4),
    status: 'returned',
    items: [
      { itemId: 'INV-KIM-002', name: 'Pembakar Bunsen Keluli Tahan Karat', qty: 2 },
      { itemId: 'INV-KIM-003', name: 'Set Tabung Uji Borosilikat (10 unit/rak)', qty: 1 }
    ],
    officer: 'En. Syahrul Nizam',
    returnCondition: 'Baik',
    returnOfficer: 'En. Syahrul Nizam',
    notes: 'Dipulangkan dalam keadaan bersih & sempurna.'
  }
];

const DEFAULT_ACTIVITIES = [
  {
    id: 'ACT-1',
    type: 'loan',
    title: 'Peminjaman Baru Direkodkan',
    desc: 'Chong Wei Lun (4 Sains 1) meminjam 2 unit Ammeter & 1 Jam Randik',
    time: '2 hari lalu',
    trxId: 'TRX-202409-003'
  },
  {
    id: 'ACT-2',
    type: 'return',
    title: 'Pemulangan Disahkan',
    desc: 'Siti Sarah binti Halim memulangkan 2 unit Pembakar Bunsen (Kondisi: Baik)',
    time: '4 hari lalu',
    trxId: 'TRX-202409-004'
  },
  {
    id: 'ACT-3',
    type: 'alert',
    title: 'Peringatan Pinjaman Lewat',
    desc: 'Ahmad Faiz bin Zulkifli melepasi tarikh sasaran pemulangan (Buret & Bikar)',
    time: '1 hari lalu',
    trxId: 'TRX-202409-001'
  }
];

const MakmalStore = {
  // ==========================================
  // INVENTORY (MASTER DATA)
  // ==========================================
  getInventory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return data ? JSON.parse(data) : this.initInventory();
    } catch {
      return DEFAULT_INVENTORY;
    }
  },

  initInventory() {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(DEFAULT_INVENTORY));
    return DEFAULT_INVENTORY;
  },

  saveInventory(items) {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
    window.dispatchEvent(new Event('sim_makmal_sync'));
  },

  getItemById(id) {
    return this.getInventory().find(item => item.id === id);
  },

  addInventoryItem(newItem) {
    const items = this.getInventory();
    if (items.some(i => i.id.toLowerCase() === newItem.id.toLowerCase())) {
      throw new Error(`Kod alatan ${newItem.id} telahpun wujud!`);
    }
    const itemToAdd = {
      ...newItem,
      totalQty: parseInt(newItem.totalQty, 10) || 0,
      availableQty: parseInt(newItem.totalQty, 10) || 0,
      borrowedQty: 0,
      damagedQty: 0
    };
    items.unshift(itemToAdd);
    this.saveInventory(items);
    this.addActivity({
      type: 'item',
      title: 'Master Data Alatan Ditambah',
      desc: `Admin menambah alatan baharu: ${newItem.name} (${newItem.id})`
    });
    return itemToAdd;
  },

  updateInventoryItem(id, updatedFields) {
    const items = this.getInventory();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Alatan ${id} tidak dijumpai.`);

    const oldItem = items[idx];
    const newTotal = updatedFields.totalQty !== undefined ? parseInt(updatedFields.totalQty, 10) : oldItem.totalQty;
    const diff = newTotal - oldItem.totalQty;
    const newAvailable = Math.max(0, oldItem.availableQty + diff);

    items[idx] = {
      ...oldItem,
      ...updatedFields,
      totalQty: newTotal,
      availableQty: newAvailable
    };

    this.saveInventory(items);
    this.addActivity({
      type: 'item',
      title: 'Master Data Dikemaskini',
      desc: `Admin mengemas kini maklumat alatan: ${items[idx].name}`
    });
    return items[idx];
  },

  deleteInventoryItem(id) {
    const items = this.getInventory();
    const item = items.find(i => i.id === id);
    if (!item) throw new Error(`Alatan ${id} tidak dijumpai.`);
    if (item.borrowedQty > 0) {
      throw new Error(`Alatan tidak boleh dipadam kerana sedang dipinjam (${item.borrowedQty} unit dalam sirkulasi).`);
    }
    const filtered = items.filter(i => i.id !== id);
    this.saveInventory(filtered);
    this.addActivity({
      type: 'item',
      title: 'Alatan Dikeluarkan',
      desc: `Admin memadam alatan ${item.name} daripada inventori makmal.`
    });
  },

  // ==========================================
  // OFFICERS (PENGURUSAN AKAUN PETUGAS)
  // ==========================================
  getOfficers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFICERS);
      return data ? JSON.parse(data) : this.initOfficers();
    } catch {
      return DEFAULT_OFFICERS;
    }
  },

  initOfficers() {
    localStorage.setItem(STORAGE_KEYS.OFFICERS, JSON.stringify(DEFAULT_OFFICERS));
    return DEFAULT_OFFICERS;
  },

  saveOfficers(officers) {
    localStorage.setItem(STORAGE_KEYS.OFFICERS, JSON.stringify(officers));
    window.dispatchEvent(new Event('sim_makmal_sync'));
  },

  addOfficer(newOfficer) {
    const officers = this.getOfficers();
    if (officers.some(o => o.username.toLowerCase() === newOfficer.username.toLowerCase())) {
      throw new Error(`Nama pengguna "${newOfficer.username}" telahpun digunakan.`);
    }
    const nextNum = officers.length + 1;
    const id = newOfficer.role === 'Admin' ? `ADM-${String(nextNum).padStart(3, '0')}` : `PTG-${String(nextNum).padStart(3, '0')}`;
    const officerToAdd = {
      id,
      ...newOfficer,
      status: newOfficer.status || 'Aktif',
      lastLogin: 'Belum log masuk'
    };
    officers.push(officerToAdd);
    this.saveOfficers(officers);
    this.addActivity({
      type: 'officer',
      title: 'Akaun Petugas Ditambah',
      desc: `Admin mendaftarkan akaun baharu: ${newOfficer.name} (${newOfficer.role})`
    });
    return officerToAdd;
  },

  updateOfficer(id, updatedFields) {
    const officers = this.getOfficers();
    const idx = officers.findIndex(o => o.id === id);
    if (idx === -1) throw new Error(`Petugas ${id} tidak dijumpai.`);

    officers[idx] = { ...officers[idx], ...updatedFields };
    this.saveOfficers(officers);
    return officers[idx];
  },

  toggleOfficerStatus(id) {
    const officers = this.getOfficers();
    const officer = officers.find(o => o.id === id);
    if (!officer) return;
    officer.status = officer.status === 'Aktif' ? 'Tidak Aktif' : 'Aktif';
    this.saveOfficers(officers);
    return officer;
  },

  deleteOfficer(id) {
    const officers = this.getOfficers();
    const officer = officers.find(o => o.id === id);
    if (!officer) throw new Error('Petugas tidak dijumpai.');
    if (officer.username === 'admin') {
      throw new Error('Akaun Admin utama tidak boleh dipadam.');
    }
    const filtered = officers.filter(o => o.id !== id);
    this.saveOfficers(filtered);
  },

  // ==========================================
  // STUDENTS (MASTER DATA MURID)
  // ==========================================
  getStudents() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : this.initStudents();
    } catch {
      return DEFAULT_STUDENTS;
    }
  },

  initStudents() {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  },

  getStudentByNis(nis) {
    if (!nis) return null;
    const cleanNis = String(nis).trim().toLowerCase();
    return this.getStudents().find(s => s.nis.toLowerCase() === cleanNis);
  },

  // ==========================================
  // LOANS & TRANSACTIONS
  // ==========================================
  getLoans() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOANS);
      const loans = data ? JSON.parse(data) : this.initLoans();
      const today = new Date().toISOString().split('T')[0];
      return loans.map(loan => {
        if (loan.status === 'active' && loan.targetReturnDate < today) {
          return { ...loan, status: 'overdue' };
        }
        return loan;
      });
    } catch {
      return DEFAULT_LOANS;
    }
  },

  initLoans() {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(DEFAULT_LOANS));
    return DEFAULT_LOANS;
  },

  saveLoans(loans) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
    window.dispatchEvent(new Event('sim_makmal_sync'));
  },

  getLoanById(trxId) {
    return this.getLoans().find(l => l.id === trxId);
  },

  createLoan({ nis, studentName, studentClass, studentPhone, purpose, targetReturnDate, items, officer = 'Petugas Makmal', notes }) {
    const loans = this.getLoans();
    const inventory = this.getInventory();

    // Validasi stok
    for (const reqItem of items) {
      const invItem = inventory.find(i => i.id === reqItem.itemId);
      if (!invItem) {
        throw new Error(`Alatan dengan ID ${reqItem.itemId} tidak dijumpai.`);
      }
      if (invItem.availableQty < reqItem.qty) {
        throw new Error(`Stok alatan "${invItem.name}" tidak mencukupi. Tersedia: ${invItem.availableQty}, Dipinta: ${reqItem.qty}`);
      }
    }

    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const nextNum = loans.length + 1;
    const newTrxId = `TRX-${yearMonth}-${String(nextNum).padStart(3, '0')}`;

    // Kemaskini stok alatan
    const updatedInventory = inventory.map(invItem => {
      const matched = items.find(i => i.itemId === invItem.id);
      if (matched) {
        return {
          ...invItem,
          availableQty: invItem.availableQty - matched.qty,
          borrowedQty: (invItem.borrowedQty || 0) + matched.qty
        };
      }
      return invItem;
    });

    const newLoan = {
      id: newTrxId,
      nis: String(nis).trim(),
      studentName,
      studentClass,
      studentPhone: studentPhone || '-',
      purpose: purpose || 'Praktikum Makmal',
      borrowDate: now.toISOString().split('T')[0],
      targetReturnDate,
      actualReturnDate: null,
      status: 'active',
      items: items.map(i => ({
        itemId: i.itemId,
        name: i.name || this.getItemById(i.itemId)?.name || i.itemId,
        qty: parseInt(i.qty, 10)
      })),
      officer: officer || 'Petugas Makmal',
      notes: notes || '-'
    };

    loans.unshift(newLoan);
    this.saveInventory(updatedInventory);
    this.saveLoans(loans);

    this.addActivity({
      type: 'loan',
      title: 'Peminjaman Baru Didaftarkan',
      desc: `${studentName} (${studentClass}) meminjam ${items.reduce((s, i) => s + i.qty, 0)} alatan makmal`,
      trxId: newTrxId
    });

    return newLoan;
  },

  returnLoan(trxId, { returnItemsCondition, notes, officerName = 'Petugas Makmal' }) {
    const loans = this.getLoans();
    const inventory = this.getInventory();
    const targetLoan = loans.find(l => l.id === trxId);

    if (!targetLoan) {
      throw new Error(`Transaksi peminjaman ${trxId} tidak dijumpai.`);
    }

    if (targetLoan.status === 'returned') {
      throw new Error(`Transaksi peminjaman ${trxId} telahpun dipulangkan.`);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let hasDamaged = false;
    let damagedSummary = [];

    const updatedInventory = inventory.map(invItem => {
      const cond = returnItemsCondition.find(c => c.itemId === invItem.id);
      if (cond) {
        const goodQty = parseInt(cond.goodQty || 0, 10);
        const badQty = parseInt(cond.damagedQty || 0, 10);
        const totalReturning = goodQty + badQty;

        if (badQty > 0) {
          hasDamaged = true;
          damagedSummary.push(`${invItem.name}: ${badQty} rosak (${cond.damageNote || 'Tiada catatan'})`);
        }

        return {
          ...invItem,
          availableQty: invItem.availableQty + goodQty,
          borrowedQty: Math.max(0, (invItem.borrowedQty || 0) - totalReturning),
          damagedQty: (invItem.damagedQty || 0) + badQty
        };
      }
      return invItem;
    });

    const updatedLoans = loans.map(l => {
      if (l.id === trxId) {
        return {
          ...l,
          actualReturnDate: todayStr,
          status: 'returned',
          returnCondition: hasDamaged ? 'Rosak' : 'Baik',
          returnOfficer: officerName,
          returnNotes: notes || (hasDamaged ? damagedSummary.join('; ') : 'Semua alatan dipulangkan dalam kondisi baik.'),
          returnedItemsDetail: returnItemsCondition
        };
      }
      return l;
    });

    this.saveInventory(updatedInventory);
    this.saveLoans(updatedLoans);

    this.addActivity({
      type: 'return',
      title: 'Pemulangan Alatan Disahkan',
      desc: `${targetLoan.studentName} memulangkan alatan (${hasDamaged ? 'Ada Kerosakan' : 'Kondisi Baik'})`,
      trxId: trxId
    });

    return updatedLoans.find(l => l.id === trxId);
  },

  // ==========================================
  // METRICS & STATS
  // ==========================================
  getMetrics() {
    const inventory = this.getInventory();
    const loans = this.getLoans();
    const officers = this.getOfficers();

    const totalInventoryUnits = inventory.reduce((acc, item) => acc + (item.totalQty || 0), 0);
    const totalBorrowedUnits = inventory.reduce((acc, item) => acc + (item.borrowedQty || 0), 0);
    const totalDamagedUnits = inventory.reduce((acc, item) => acc + (item.damagedQty || 0), 0);
    const activeLoansCount = loans.filter(l => l.status === 'active').length;
    const overdueLoansCount = loans.filter(l => l.status === 'overdue').length;
    const returnedLoansCount = loans.filter(l => l.status === 'returned').length;
    const activeOfficersCount = officers.filter(o => o.status === 'Aktif').length;

    return {
      totalInventoryUnits,
      totalBorrowedUnits,
      totalDamagedUnits,
      activeLoansCount,
      overdueLoansCount,
      returnedLoansCount,
      totalUniqueItems: inventory.length,
      totalOfficers: officers.length,
      activeOfficersCount
    };
  },

  // ==========================================
  // ACTIVITIES AUDIT LOG
  // ==========================================
  getActivities() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : this.initActivities();
    } catch {
      return DEFAULT_ACTIVITIES;
    }
  },

  initActivities() {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
    return DEFAULT_ACTIVITIES;
  },

  addActivity({ type, title, desc, trxId }) {
    const activities = this.getActivities();
    activities.unshift({
      id: 'ACT-' + Date.now(),
      type,
      title,
      desc,
      time: 'Baru sahaja',
      trxId: trxId || null
    });
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 30)));
  },

  // ==========================================
  // RESET DEMO
  // ==========================================
  resetDemo() {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(DEFAULT_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.OFFICERS, JSON.stringify(DEFAULT_OFFICERS));
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(DEFAULT_LOANS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
    window.dispatchEvent(new Event('sim_makmal_sync'));
  },

  // ==========================================
  // UTILITIES
  // ==========================================
  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 transform transition-all duration-300 translate-y-3 opacity-0 ${
      type === 'error'
        ? 'bg-rose-50 border-rose-200 text-rose-800'
        : type === 'warning'
        ? 'bg-amber-50 border-amber-200 text-amber-800'
        : 'bg-[#103227] border-emerald-800 text-white'
    }`;

    const icon = type === 'error' ? 'alert-circle' : type === 'warning' ? 'alert-triangle' : 'check-circle-2';

    toast.innerHTML = `
      <i data-lucide="${icon}" class="w-5 h-5 shrink-0 ${type === 'error' ? 'text-rose-600' : type === 'warning' ? 'text-amber-600' : 'text-[#4EAE85]'}"></i>
      <div class="text-xs font-semibold leading-snug">${message}</div>
    `;

    container.appendChild(toast);
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-3', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  saveStudents(students) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    window.dispatchEvent(new Event('sim_makmal_sync'));
  },

  addStudent(newStudent) {
    const students = this.getStudents();
    if (students.some(s => s.nis.toLowerCase() === newStudent.nis.toLowerCase())) {
      throw new Error(`Nombor Induk Siswa (NIS) "${newStudent.nis}" telahpun berdaftar.`);
    }
    const studentToAdd = {
      ...newStudent,
      registeredAt: new Date().toISOString()
    };
    students.push(studentToAdd);
    this.saveStudents(students);
    this.addActivity({
      type: 'officer',
      title: 'Murid Baharu Berdaftar',
      desc: `${newStudent.name} (${newStudent.class}) telah mendaftar akaun portal murid.`
    });
    return studentToAdd;
  },

  // ==========================================
  // AUTHENTICATION & SESSION
  // ==========================================
  getCurrentUser() {
    try {
      const data = localStorage.getItem('sim_makmal_current_user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('sim_makmal_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sim_makmal_current_user');
    }
    window.dispatchEvent(new Event('sim_makmal_sync'));
  },

  logout(redirectUrl = '../index.html') {
    this.setCurrentUser(null);
    sessionStorage.removeItem('sim_makmal_redirect');
    sessionStorage.setItem('sim_makmal_auth_msg', 'Anda telah berjaya log keluar dari sistem.');
    window.location.replace(redirectUrl);
  },

  requireAuth(allowedRoles) {
    const user = this.getCurrentUser();
    if (!user) {
      sessionStorage.setItem('sim_makmal_auth_msg', 'Sila log masuk terlebih dahulu untuk mengakses sistem makmal.');
      sessionStorage.setItem('sim_makmal_redirect', window.location.href);
      window.location.replace('../index.html');
      return false;
    }
    if (allowedRoles) {
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      if (!roles.includes(user.role) && user.role !== 'Admin') {
        sessionStorage.setItem('sim_makmal_auth_msg', `Akses disekat. Halaman ini memerlukan peranan ${roles.join(' / ')}. Anda log masuk sebagai ${user.role}.`);
        window.location.replace('../index.html');
        return false;
      }
    }
    return true;
  },

  renderCurrentUserUI() {
    const user = this.getCurrentUser();
    if (!user) return;

    document.querySelectorAll('.user-display-name').forEach(el => {
      el.textContent = user.name || user.username || 'Pengguna';
    });

    document.querySelectorAll('.user-display-role').forEach(el => {
      if (user.role === 'Admin') el.textContent = 'Ketua Pentadbir Makmal';
      else if (user.role === 'Petugas') el.textContent = 'Petugas Operasi Makmal';
      else if (user.role === 'Siswa') el.textContent = `Murid (${user.class || 'Sains'})`;
    });

    document.querySelectorAll('.user-avatar-initials').forEach(el => {
      if (user.role === 'Admin') el.textContent = 'ADM';
      else if (user.role === 'Petugas') el.textContent = 'PTG';
      else el.textContent = (user.name ? user.name.slice(0, 2).toUpperCase() : 'SIS');
    });
  },

  loginAuto(identifier, password) {
    const cleanId = String(identifier).trim().toLowerCase();

    // 1. Cek Admin / Petugas (berdasarkan username atau email)
    const officers = this.getOfficers();
    const officer = officers.find(o => 
      o.username.toLowerCase() === cleanId || o.email.toLowerCase() === cleanId
    );

    if (officer) {
      if (officer.status !== 'Aktif') {
        throw new Error(`Akaun anda berstatus "${officer.status}". Sila hubungi pentadbir makmal.`);
      }
      const sessionUser = {
        id: officer.id,
        name: officer.name,
        username: officer.username,
        role: officer.role,
        email: officer.email,
        labAssigned: officer.labAssigned
      };
      this.setCurrentUser(sessionUser);
      return sessionUser;
    }

    // 2. Cek Siswa (berdasarkan NIS atau Nama)
    const students = this.getStudents();
    const student = students.find(s => 
      s.nis.toLowerCase() === cleanId || s.name.toLowerCase() === cleanId
    );

    if (student) {
      const sessionUser = {
        id: student.nis,
        nis: student.nis,
        name: student.name,
        class: student.class,
        role: 'Siswa',
        email: student.email || `${student.nis}@siswa.edu.my`
      };
      this.setCurrentUser(sessionUser);
      return sessionUser;
    }

    throw new Error(`Pengguna dengan identiti "${identifier}" tidak dijumpai dalam sistem.`);
  },

  login(identifier, password, selectedRole) {
    const cleanId = String(identifier).trim().toLowerCase();
    
    // 1. Cek Admin atau Petugas
    if (selectedRole === 'Admin' || selectedRole === 'Petugas') {
      const officers = this.getOfficers();
      const officer = officers.find(o => 
        (o.username.toLowerCase() === cleanId || o.email.toLowerCase() === cleanId) &&
        o.role.toLowerCase() === selectedRole.toLowerCase()
      );

      if (!officer) {
        throw new Error(`Akaun ${selectedRole} dengan nama pengguna "${identifier}" tidak dijumpai.`);
      }

      if (officer.status !== 'Aktif') {
        throw new Error(`Akaun anda berstatus "${officer.status}". Sila hubungi pentadbir makmal.`);
      }

      const sessionUser = {
        id: officer.id,
        name: officer.name,
        username: officer.username,
        role: officer.role,
        email: officer.email,
        labAssigned: officer.labAssigned
      };
      this.setCurrentUser(sessionUser);
      return sessionUser;
    }

    // 2. Cek Siswa (berdasarkan NIS atau Nama)
    if (selectedRole === 'Siswa') {
      const students = this.getStudents();
      const student = students.find(s => 
        s.nis.toLowerCase() === cleanId || 
        s.name.toLowerCase().includes(cleanId)
      );

      if (!student) {
        throw new Error(`Murid dengan NIS/Nama "${identifier}" tidak dijumpai dalam rekod makmal.`);
      }

      const sessionUser = {
        id: student.nis,
        nis: student.nis,
        name: student.name,
        class: student.class,
        phone: student.phone,
        role: 'Siswa'
      };
      this.setCurrentUser(sessionUser);
      return sessionUser;
    }

    throw new Error('Peranan tidak sah.');
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }
};

window.MakmalStore = MakmalStore;

