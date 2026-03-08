/* ============================================
   OChefia — Protótipos: Dados Mock + Interações
   ============================================ */

// ============================================
// 1. Dados Mock
// ============================================

const MOCK = {
  restaurant: {
    name: 'Zé do Bar',
    slug: 'ze-bar',
    logo: null,
    address: 'Rua Augusta, 1234 — São Paulo, SP',
    serviceChargePercent: 10,
    distributionMode: 'automatico', // 'todos' | 'automatico'
    theme: 'classico'
  },

  categories: [
    { id: 1, name: 'Entradas', order: 1, productCount: 3 },
    { id: 2, name: 'Pratos Principais', order: 2, productCount: 4 },
    { id: 3, name: 'Hambúrgueres', order: 3, productCount: 2 },
    { id: 4, name: 'Bebidas', order: 4, productCount: 4 },
    { id: 5, name: 'Sobremesas', order: 5, productCount: 2 }
  ],

  tags: [
    { id: 1, name: 'Vegano', color: '#16A34A' },
    { id: 2, name: 'Sem Glúten', color: '#2563EB' },
    { id: 3, name: 'Picante', color: '#DC2626' },
    { id: 4, name: 'Sugestão do Chef', color: '#CA8A04' }
  ],

  products: [
    { id: 1, name: 'Bolinho de Bacalhau (6un)', desc: 'Bolinhos crocantes de bacalhau com azeitonas, acompanha molho tártaro', price: 32.00, categoryId: 1, destination: 'cozinha', tags: [], available: true },
    { id: 2, name: 'Torresmo Crocante', desc: 'Torresmo artesanal temperado com alho e limão, crocante por fora e macio por dentro', price: 28.00, categoryId: 1, destination: 'cozinha', tags: [], available: true },
    { id: 3, name: 'Bruschetta de Tomate', desc: 'Pão italiano tostado com tomates frescos, manjericão e azeite extra virgem', price: 24.00, categoryId: 1, destination: 'cozinha', tags: [1], available: true },
    { id: 4, name: 'Picanha na Brasa (400g)', desc: 'Picanha premium grelhada no ponto, acompanha arroz, farofa, vinagrete e mandioca frita', price: 89.90, categoryId: 2, destination: 'cozinha', tags: [4], available: true },
    { id: 5, name: 'Filé à Parmegiana', desc: 'Filé mignon empanado com molho de tomate caseiro e queijo gratinado, acompanha arroz e fritas', price: 62.00, categoryId: 2, destination: 'cozinha', tags: [], available: true },
    { id: 6, name: 'Salmão Grelhado', desc: 'Salmão fresco grelhado com ervas finas, acompanha purê de batata e legumes salteados', price: 78.00, categoryId: 2, destination: 'cozinha', tags: [2], available: true },
    { id: 7, name: 'Risoto de Cogumelos', desc: 'Risoto cremoso com mix de cogumelos frescos, parmesão e trufa', price: 56.00, categoryId: 2, destination: 'cozinha', tags: [1], available: true },
    { id: 8, name: 'Smash Burger Duplo', desc: 'Dois smash patties de 90g, queijo cheddar, cebola caramelizada, picles e molho especial', price: 42.00, categoryId: 3, destination: 'cozinha', tags: [], available: true },
    { id: 9, name: 'Burger Vegano', desc: 'Hambúrguer de grão-de-bico e beterraba com maionese vegana e salada fresca', price: 38.00, categoryId: 3, destination: 'cozinha', tags: [1], available: true },
    { id: 10, name: 'Chopp Pilsen 500ml', desc: 'Chopp artesanal Pilsen gelado, servido na temperatura ideal', price: 16.00, categoryId: 4, destination: 'bar', tags: [], available: true },
    { id: 11, name: 'Caipirinha de Limão', desc: 'Caipirinha tradicional com cachaça artesanal, limão tahiti e açúcar', price: 22.00, categoryId: 4, destination: 'bar', tags: [], available: true },
    { id: 12, name: 'Suco Natural de Laranja', desc: 'Suco de laranja espremido na hora, sem adição de açúcar', price: 12.00, categoryId: 4, destination: 'bar', tags: [1, 2], available: true },
    { id: 13, name: 'Água Mineral 500ml', desc: 'Água mineral sem gás', price: 6.00, categoryId: 4, destination: 'garcom', tags: [], available: true },
    { id: 14, name: 'Petit Gâteau', desc: 'Bolinho de chocolate quente com centro cremoso, acompanha sorvete de creme', price: 34.00, categoryId: 5, destination: 'cozinha', tags: [4], available: true },
    { id: 15, name: 'Pudim de Leite', desc: 'Pudim de leite condensado com calda de caramelo, receita da casa', price: 18.00, categoryId: 5, destination: 'cozinha', tags: [], available: true }
  ],

  people: [
    { id: 1, name: 'João' },
    { id: 2, name: 'Maria' },
    { id: 3, name: 'Pedro' }
  ],

  tables: [
    { id: 1, number: 1, status: 'ocupada', time: '45min', value: 156.00, people: 3, waiter: 'Carlos' },
    { id: 2, number: 2, status: 'livre', time: null, value: 0, people: 0, waiter: null },
    { id: 3, number: 3, status: 'ocupada', time: '1h12min', value: 284.50, people: 5, waiter: 'Carlos' },
    { id: 4, number: 4, status: 'conta', time: '1h45min', value: 198.00, people: 2, waiter: 'Carlos' },
    { id: 5, number: 5, status: 'ocupada', time: '23min', value: 78.00, people: 2, waiter: 'Carlos' },
    { id: 6, number: 6, status: 'livre', time: null, value: 0, people: 0, waiter: null },
    { id: 7, number: 7, status: 'ocupada', time: '35min', value: 124.00, people: 4, waiter: 'Carlos' },
    { id: 8, number: 8, status: 'atrasada', time: '2h15min', value: 342.00, people: 6, waiter: 'Carlos' },
    { id: 9, number: 9, status: 'livre', time: null, value: 0, people: 0, waiter: null },
    { id: 10, number: 10, status: 'ocupada', time: '58min', value: 210.00, people: 3, waiter: 'Carlos' },
    { id: 11, number: 11, status: 'livre', time: null, value: 0, people: 0, waiter: null },
    { id: 12, number: 12, status: 'ocupada', time: '15min', value: 44.00, people: 2, waiter: 'Carlos' },
    { id: 13, number: 13, status: 'livre', time: null, value: 0, people: 0, waiter: null },
    { id: 14, number: 14, status: 'livre', time: null, value: 0, people: 0, waiter: null },
    { id: 15, number: 15, status: 'ocupada', time: '1h30min', value: 276.00, people: 4, waiter: 'Carlos' }
  ],

  staff: [
    { id: 1, name: 'Dono', email: 'dono@ze-bar.com', role: 'OWNER', phone: '(11) 99999-0000', temporary: false, delivers: false, weekdays: [], pin: null },
    { id: 2, name: 'Carlos Silva', email: 'carlos@ze-bar.com', role: 'WAITER', phone: '(11) 98765-4321', temporary: false, delivers: false, weekdays: [], pin: '1234' },
    { id: 3, name: 'Ana Santos', email: 'ana@ze-bar.com', role: 'KITCHEN', phone: '(11) 98765-4322', temporary: false, delivers: false, weekdays: [], pin: null },
    { id: 4, name: 'Bruno Costa', email: 'bruno@ze-bar.com', role: 'BAR', phone: '(11) 98765-4323', temporary: false, delivers: true, weekdays: [], pin: null },
    { id: 5, name: 'Fernanda Lima', email: 'fernanda@ze-bar.com', role: 'WAITER', phone: '(11) 98765-4324', temporary: false, delivers: false, weekdays: [], pin: '5678' },
    { id: 6, name: 'Lucas Temp', email: 'lucas@ze-bar.com', role: 'WAITER', phone: '(11) 98765-4325', temporary: true, delivers: false, weekdays: ['seg', 'qua', 'sex'], pin: '0000' },
    { id: 7, name: 'Juliana Oliveira', email: 'juliana@ze-bar.com', role: 'MANAGER', phone: '(11) 98765-4326', temporary: false, delivers: false, weekdays: [], pin: null }
  ],

  orders: [
    {
      id: 1, number: '#42', tableNumber: 5, time: '19:32', status: 'preparando',
      items: [
        { id: 1, name: 'Picanha na Brasa (400g)', qty: 1, price: 89.90, status: 'preparando', destination: 'cozinha', people: ['João', 'Maria', 'Pedro'], obs: 'Ponto mal passado' },
        { id: 2, name: 'Chopp Pilsen 500ml', qty: 2, price: 16.00, status: 'pronto', destination: 'bar', people: ['João', 'Pedro'], obs: null }
      ]
    },
    {
      id: 2, number: '#43', tableNumber: 1, time: '19:45', status: 'na_fila',
      items: [
        { id: 3, name: 'Smash Burger Duplo', qty: 2, price: 42.00, status: 'na_fila', destination: 'cozinha', people: ['João', 'Maria'], obs: 'Sem cebola' },
        { id: 4, name: 'Caipirinha de Limão', qty: 1, price: 22.00, status: 'na_fila', destination: 'bar', people: ['Maria'], obs: null }
      ]
    },
    {
      id: 3, number: '#44', tableNumber: 3, time: '19:50', status: 'pronto',
      items: [
        { id: 5, name: 'Filé à Parmegiana', qty: 1, price: 62.00, status: 'pronto', destination: 'cozinha', people: ['Pedro'], obs: null },
        { id: 6, name: 'Suco Natural de Laranja', qty: 1, price: 12.00, status: 'entregue', destination: 'bar', people: ['Pedro'], obs: null }
      ]
    },
    {
      id: 4, number: '#45', tableNumber: 7, time: '20:05', status: 'entregue',
      items: [
        { id: 7, name: 'Bolinho de Bacalhau (6un)', qty: 1, price: 32.00, status: 'entregue', destination: 'cozinha', people: ['João', 'Maria'], obs: null },
        { id: 8, name: 'Pudim de Leite', qty: 2, price: 18.00, status: 'entregue', destination: 'cozinha', people: ['João', 'Maria', 'Pedro'], obs: null }
      ]
    }
  ],

  calls: [
    { id: 1, tableNumber: 5, reason: 'Chamar garçom', message: '', time: '5min', status: 'pending' },
    { id: 2, tableNumber: 8, reason: 'Pedir conta', message: 'Gostaríamos de fechar a conta, por favor.', time: '12min', status: 'pending' },
    { id: 3, tableNumber: 3, reason: 'Outro', message: 'Falta um talher na mesa.', time: '2min', status: 'acknowledged' }
  ],

  schedule: {
    today: '2026-03-08',
    days: [
      { date: '2026-03-08', label: 'Hoje — Sáb', staff: [2, 3, 4, 5, 6] },
      { date: '2026-03-09', label: 'Dom', staff: [2, 3, 4, 5] },
      { date: '2026-03-10', label: 'Seg', staff: [2, 3, 4, 6] },
      { date: '2026-03-11', label: 'Ter', staff: [2, 3, 4, 5] },
      { date: '2026-03-12', label: 'Qua', staff: [2, 3, 4, 5, 6] },
      { date: '2026-03-13', label: 'Qui', staff: [2, 3, 4, 5] },
      { date: '2026-03-14', label: 'Sex', staff: [2, 3, 4, 5, 6] }
    ]
  },

  kpiDashboard: {
    revenueToday: 4280.00,
    ordersToday: 47,
    avgTicket: 91.06,
    activeTables: 8,
    totalTables: 15
  },

  billing: {
    daily: {
      revenue: 4280.00,
      orders: 47,
      avgTicket: 91.06,
      previousRevenue: 3950.00
    },
    monthly: {
      revenue: 87450.00,
      orders: 982,
      avgTicket: 89.05,
      previousRevenue: 82100.00,
      days: [3200, 3500, 2800, 4100, 3900, 4200, 3600, 4500, 3800, 4000, 4280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    waiterFees: [
      { name: 'Carlos Silva', tables: 28, fee: 1240.00 },
      { name: 'Fernanda Lima', tables: 25, fee: 1105.00 },
      { name: 'Lucas Temp', tables: 12, fee: 520.00 }
    ]
  },

  themes: [
    { id: 'classico', name: 'Clássico', primary: '#EA580C', secondary: '#111827', bg: '#FFFFFF', desc: 'Clean, universal' },
    { id: 'escuro', name: 'Escuro', primary: '#F97316', secondary: '#F9FAFB', bg: '#111827', desc: 'Sofisticado, bar noturno' },
    { id: 'rustico', name: 'Rústico', primary: '#92400E', secondary: '#451A03', bg: '#FFFBEB', desc: 'Churrascaria, comida caseira' },
    { id: 'moderno', name: 'Moderno', primary: '#7C3AED', secondary: '#1E1B4B', bg: '#FFFFFF', desc: 'Gastrobar, contemporâneo' },
    { id: 'tropical', name: 'Tropical', primary: '#059669', secondary: '#064E3B', bg: '#FFFFFF', desc: 'Praia, açaí, sucos' },
    { id: 'personalizado', name: 'Personalizado', primary: '#EA580C', secondary: '#111827', bg: '#FFFFFF', desc: 'Livre' }
  ]
};

// ============================================
// 2. Estado do Carrinho
// ============================================

let cart = JSON.parse(localStorage.getItem('ochefia_cart') || '[]');
let nextPersonId = Math.max(4, ...MOCK.people.map(p => p.id + 1));

function saveCart() {
  localStorage.setItem('ochefia_cart', JSON.stringify(cart));
}

function addToCart(productId, qty, personIds) {
  const product = MOCK.products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.qty += qty;
    existing.personIds = [...new Set([...existing.personIds, ...personIds])];
  } else {
    cart.push({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: qty,
      personIds: personIds
    });
  }
  saveCart();
  updateCartUI();
  showToast(sanitizeText(product.name) + ' adicionado ao carrinho', 'success');
}

function removeFromCart(cartItemId) {
  cart = cart.filter(item => item.id !== cartItemId);
  saveCart();
  updateCartUI();
}

function updateCartQty(cartItemId, delta) {
  const item = cart.find(i => i.id === cartItemId);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getServiceCharge() {
  return getCartTotal() * (MOCK.restaurant.serviceChargePercent / 100);
}

function getCartGrandTotal() {
  return getCartTotal() + getServiceCharge();
}

function updateCartUI() {
  // Update floating cart
  const floatingCart = document.querySelector('.floating-cart');
  if (floatingCart) {
    const count = getCartCount();
    const total = getCartTotal();
    const countEl = floatingCart.querySelector('.cart-count');
    const totalEl = floatingCart.querySelector('.cart-total');
    if (count > 0) {
      floatingCart.style.display = 'flex';
      if (countEl) countEl.textContent = count;
      if (totalEl) totalEl.textContent = formatCurrency(total);
    } else {
      floatingCart.style.display = 'none';
    }
  }

  // Update cart page if on it
  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
}

// ============================================
// 3. Pessoas
// ============================================

function addPerson(name) {
  if (!name || !name.trim()) return;
  const sanitized = sanitizeText(name.trim());
  MOCK.people.push({ id: nextPersonId++, name: sanitized });
  if (typeof renderPeople === 'function') renderPeople();
  showToast(sanitized + ' adicionado(a) à mesa', 'success');
}

function removePerson(personId) {
  const person = MOCK.people.find(p => p.id === personId);
  MOCK.people = MOCK.people.filter(p => p.id !== personId);
  if (typeof renderPeople === 'function') renderPeople();
  if (person) showToast(sanitizeText(person.name) + ' removido(a) da mesa', 'warning');
}

function getPersonName(personId) {
  const person = MOCK.people.find(p => p.id === personId);
  return person ? person.name : 'Desconhecido';
}

// ============================================
// 4. Tabs genérico
// ============================================

function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const tabs = container.querySelectorAll('.tab');
  const contents = container.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const target = container.querySelector('#' + targetId);
      if (target) target.classList.add('active');
    });
  });
}

// ============================================
// 5. KDS — Troca de status e timers
// ============================================

let kdsTimers = {};

function initKdsTimers() {
  document.querySelectorAll('.kds-card').forEach(card => {
    const timerId = card.dataset.orderId;
    const startMinutes = parseInt(card.dataset.startMinutes || '0');
    kdsTimers[timerId] = startMinutes;

    updateKdsTimer(card, startMinutes);
  });

  setInterval(() => {
    document.querySelectorAll('.kds-card:not(.status-done)').forEach(card => {
      const timerId = card.dataset.orderId;
      kdsTimers[timerId] = (kdsTimers[timerId] || 0) + 1;
      updateKdsTimer(card, kdsTimers[timerId]);
    });
  }, 60000); // Cada 60s incrementa 1 minuto
}

function updateKdsTimer(card, minutes) {
  const timerEl = card.querySelector('.kds-timer');
  if (!timerEl) return;

  timerEl.textContent = minutes + 'min';

  // Atualiza cores
  timerEl.classList.remove('warning', 'danger');
  card.classList.remove('status-warning', 'status-danger');

  if (minutes >= 15) {
    timerEl.classList.add('danger');
    card.classList.add('status-danger');
  } else if (minutes >= 10) {
    timerEl.classList.add('warning');
    card.classList.add('status-warning');
  }
}

function kdsBump(orderId) {
  const card = document.querySelector('.kds-card[data-order-id="' + orderId + '"]');
  if (!card) return;

  card.classList.add('status-done');
  card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  card.style.opacity = '0.4';

  const bumpBtn = card.querySelector('.kds-bump-btn');
  if (bumpBtn) {
    bumpBtn.textContent = '✓ Pronto';
    bumpBtn.disabled = true;
    bumpBtn.style.backgroundColor = '#374151';
  }

  showToast('Pedido marcado como pronto!', 'success');
}

// ============================================
// 6. Modal
// ============================================

function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Fechar modal ao clicar no overlay
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Fechar modal com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
      overlay.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// ============================================
// 7. Toast
// ============================================

function showToast(message, type) {
  type = type || 'info';
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  };

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.setAttribute('role', 'alert');

  const iconSpan = document.createElement('span');
  iconSpan.style.fontSize = '1.125rem';
  iconSpan.textContent = icons[type] || icons.info;

  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(msgSpan);
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ============================================
// 8. Theming
// ============================================

function setTheme(themeId) {
  const theme = MOCK.themes.find(t => t.id === themeId);
  if (!theme) return;

  if (themeId === 'classico') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', themeId);
  }

  // Para personalizado, setar variáveis direto
  if (themeId === 'personalizado') {
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-bg', theme.bg);
  }

  MOCK.restaurant.theme = themeId;
}

function getActiveTheme() {
  return MOCK.restaurant.theme || 'classico';
}

// ============================================
// 9. Sidebar Toggle (Admin mobile)
// ============================================

function toggleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (!sidebar) return;

  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active');

  if (sidebar.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Close sidebar on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('sidebar-overlay') && e.target.classList.contains('active')) {
    toggleSidebar();
  }
});

// ============================================
// 10. Busca e Filtro
// ============================================

function filterProducts(categoryId, tagIds, searchQuery) {
  tagIds = tagIds || [];
  searchQuery = searchQuery || '';
  let filtered = MOCK.products.filter(p => p.available);

  if (categoryId) {
    filtered = filtered.filter(p => p.categoryId === categoryId);
  }

  if (tagIds.length > 0) {
    filtered = filtered.filter(p => tagIds.some(tagId => p.tags.includes(tagId)));
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)
    );
  }

  return filtered;
}

// ============================================
// 11. Chamado "O Chefia"
// ============================================

function sendCall(reason, message) {
  showToast('Chamado enviado: ' + sanitizeText(reason), 'success');
  closeModal('modal-chefia');
}

// ============================================
// 12. Utilitários
// ============================================

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.textContent;
}

function getStatusLabel(status) {
  const labels = {
    'na_fila': 'Na fila',
    'preparando': 'Preparando',
    'pronto': 'Pronto',
    'entregue': 'Entregue'
  };
  return labels[status] || status;
}

function getStatusClass(status) {
  const classes = {
    'na_fila': 'badge-info',
    'preparando': 'badge-warning',
    'pronto': 'badge-success',
    'entregue': 'badge-gray'
  };
  return classes[status] || 'badge-gray';
}

function getTableStatusLabel(status) {
  const labels = {
    'livre': 'Livre',
    'ocupada': 'Ocupada',
    'conta': 'Pedindo conta',
    'atrasada': 'Atrasada'
  };
  return labels[status] || status;
}

function getRoleLabel(role) {
  const labels = {
    'OWNER': 'Proprietário',
    'MANAGER': 'Gerente',
    'WAITER': 'Garçom',
    'KITCHEN': 'Cozinha',
    'BAR': 'Bar'
  };
  return labels[role] || role;
}

function getDestinationLabel(dest) {
  const labels = {
    'cozinha': 'Cozinha',
    'bar': 'Bar',
    'garcom': 'Garçom'
  };
  return labels[dest] || dest;
}

function getDestinationBadgeClass(dest) {
  const classes = {
    'cozinha': 'badge-warning',
    'bar': 'badge-info',
    'garcom': 'badge-success'
  };
  return classes[dest] || 'badge-gray';
}

function getWeekdayLabel(day) {
  const labels = { 'seg': 'Seg', 'ter': 'Ter', 'qua': 'Qua', 'qui': 'Qui', 'sex': 'Sex', 'sab': 'Sáb', 'dom': 'Dom' };
  return labels[day] || day;
}

// ============================================
// 13. SVG Icons (inline para protótipos)
// ============================================

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
  people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20,6 9,17 4,12"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  utensils: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>'
};

function icon(name, size) {
  size = size || 20;
  const svg = ICONS[name] || '';
  const span = document.createElement('span');
  span.style.display = 'inline-flex';
  span.style.width = size + 'px';
  span.style.height = size + 'px';
  // For prototypes, return HTML string (used in static markup)
  return '<span style="display:inline-flex;width:' + size + 'px;height:' + size + 'px">' + svg + '</span>';
}

// ============================================
// 14. Inicialização genérica
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Restore cart UI from localStorage
  updateCartUI();

  // Init tabs if any exist
  document.querySelectorAll('[data-tabs]').forEach(container => {
    initTabs('[data-tabs="' + container.dataset.tabs + '"]');
  });

  // Init KDS timers if on KDS page
  if (document.querySelector('.kds-layout')) {
    initKdsTimers();
  }

  // Init toggle buttons
  document.querySelectorAll('.toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
    });
  });
});
