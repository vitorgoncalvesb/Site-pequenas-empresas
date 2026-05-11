const state = {
  cart: JSON.parse(localStorage.getItem('plcCart') || '[]'),
  filters: {
    origin: 'all',
    roast: 'all',
    flavor: 'all'
  }
};

const products = [
  {
    id: 'coffee-brazil-honey',
    title: 'Torra Mel do Brasil',
    origin: 'Brasil',
    roast: 'Média',
    flavor: 'Chocolate',
    price: 28,
    note: 'Processo honey com doçura de caramelo e amêndoas tostadas.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=70&fm=webp'
  },
  {
    id: 'coffee-ethiopia-ethi',
    title: 'Xícara Floral Etíope',
    origin: 'Etiópia',
    roast: 'Clara',
    flavor: 'Floral',
    price: 32,
    note: 'Aromas brilhantes, semelhantes a chá, com jasmin e clareza cítrica.',
    image: 'https://images.unsplash.com/photo-1520499305606-273b7d16e69d?auto=format&fit=crop&w=900&q=70&fm=webp'
  },
  {
    id: 'coffee-colombia-bold',
    title: 'Veludo Colombiano',
    origin: 'Colômbia',
    roast: 'Escura',
    flavor: 'Chocolate',
    price: 30,
    note: 'Corpo luxuoso equilibrado por chocolate profundo e frutas de caroço.',
    image: 'https://images.unsplash.com/photo-1510626176961-4b96c20c1d78?auto=format&fit=crop&w=900&q=70&fm=webp'
  },
  {
    id: 'coffee-brazil-citrus',
    title: 'Blend Cítrico Brasileiro',
    origin: 'Brasil',
    roast: 'Clara',
    flavor: 'Cítrica',
    price: 26,
    note: 'Brilho delicado com toranja e final melado.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=70&fm=webp'
  }
];

const planRates = {
  Starter: { monthly: 34, quarterly: 95 },
  Explorer: { monthly: 48, quarterly: 135 },
  Premium: { monthly: 64, quarterly: 180 }
};

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('plcTheme', theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem('plcTheme');
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
}

function initMobileNav() {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!menuToggle || !mobileNav) return;
  menuToggle.addEventListener('click', () => mobileNav.classList.toggle('open'));
}

function updateCartStorage() {
  localStorage.setItem('plcCart', JSON.stringify(state.cart));
}

function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = state.cart.length
    ? state.cart.map(item => `
      <div class="cart-item">
        <div class="cart-product">
          <strong>${item.title}</strong>
          <span>${item.quantity} × R$${item.price.toFixed(2)}</span>
        </div>
        <button type="button" data-remove-cart="${item.id}" aria-label="Remover ${item.title}">×</button>
      </div>
    `).join('')
    : '<p>Seu carrinho está vazio. Adicione um café para começar.</p>';

  cartTotal.textContent = `R$${getCartTotal().toFixed(2)}`;
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    const quantity = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = quantity || '';
    cartCount.style.display = quantity ? 'inline-flex' : 'none';
    document.querySelector('.cart-float')?.classList.toggle('has-count', !!quantity);
    if (quantity) {
      cartCount.classList.remove('bump');
      void cartCount.offsetWidth;
      cartCount.classList.add('bump');
      setTimeout(() => cartCount.classList.remove('bump'), 200);
    }
  }
  document.querySelectorAll('[data-remove-cart]').forEach(button => {
    button.addEventListener('click', () => removeFromCart(button.dataset.removeCart));
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  const existing = state.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }
  updateCartStorage();
  renderCart();
  openCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(item => item.id !== productId);
  updateCartStorage();
  renderCart();
}

function openCart() {
  const cartPanel = document.getElementById('cartPanel');
  if (cartPanel) cartPanel.classList.add('open');
}

function closeCart() {
  const cartPanel = document.getElementById('cartPanel');
  if (cartPanel) cartPanel.classList.remove('open');
}

function initCartControls() {
  const openCartButton = document.querySelector('[data-open-cart]');
  const closeCartButton = document.querySelector('[data-close-cart]');
  if (openCartButton) openCartButton.addEventListener('click', openCart);
  if (closeCartButton) closeCartButton.addEventListener('click', closeCart);
}

function renderProducts() {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;

  const filtered = products.filter(item => {
    if (state.filters.origin !== 'all' && item.origin !== state.filters.origin) return false;
    if (state.filters.roast !== 'all' && item.roast !== state.filters.roast) return false;
    if (state.filters.flavor !== 'all' && item.flavor !== state.filters.flavor) return false;
    return true;
  });

  setTimeout(() => {
    productGrid.innerHTML = filtered.length
      ? filtered.map(item => `
        <article class="product-card" aria-label="${item.title} — R$${item.price.toFixed(2)}" data-origin="${item.origin}" data-roast="${item.roast}" data-flavor="${item.flavor}">
          <div class="product-media" style="background-image:url('${item.image}')"></div>
          <div class="product-content">
            <span class="eyebrow">${item.origin}</span>
            <h3>${item.title}</h3>
            <p>${item.note}</p>
            <div class="product-meta">
              <span>${item.roast}</span>
              <span>${item.flavor}</span>
            </div>
            <div class="card-foot">
              <strong>R$${item.price.toFixed(2)}</strong>
              <button class="button button-small" type="button" data-add-cart="${item.id}">Adicionar</button>
            </div>
          </div>
        </article>
      `).join('')
      : '<div class="empty-state"><p>Nenhum café correspondeu aos filtros atuais.</p><button class="button button-outline" type="button" data-clear-filters>Limpar filtros</button></div>';

    productGrid.classList.remove('loading');

    document.querySelectorAll('[data-add-cart]').forEach(button => {
      button.addEventListener('click', () => addToCart(button.dataset.addCart));
    });

    if (!filtered.length) {
      const clearBtn = productGrid.querySelector('[data-clear-filters]');
      if (clearBtn) clearBtn.addEventListener('click', clearFilters);
    }
  }, 600);
}

function initFilters() {
  const groups = document.querySelectorAll('.filter-group');
  if (!groups.length) return;

  groups.forEach(group => {
    group.addEventListener('click', event => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      const filterType = group.dataset.filterGroup;
      state.filters[filterType] = button.dataset.filter;
      group.querySelectorAll('button').forEach(item => item.classList.toggle('active', item === button));
      renderProducts();
    });
  });
}

function initPlanToggle() {
  const planToggle = document.getElementById('planToggle');
  if (!planToggle) return;

  const isPortuguese = document.documentElement.lang === 'pt-BR';

  const updatePlans = () => {
    const style = planToggle.checked ? 'quarterly' : 'monthly';
    document.querySelectorAll('.plan-card').forEach(card => {
      const plan = card.dataset.plan;
      const rate = planRates[plan][style];
      const priceValue = card.querySelector('.price-value');
      const suffix = card.querySelector('small');
      if (priceValue) priceValue.textContent = `R$${rate}`;
      if (suffix) suffix.textContent = isPortuguese ? (style === 'monthly' ? '/mês' : '/trim') : (style === 'monthly' ? '/mo' : '/quarter');
    });
  };

  planToggle.addEventListener('change', updatePlans);
  updatePlans();
}

function initPlanSelection() {
  document.querySelectorAll('.plan-card button').forEach(button => {
    const originalText = button.textContent;
    button.addEventListener('click', () => {
      button.textContent = '✓ Selecionado';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    });
  });
}

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const successMsg = document.querySelector('.form-success');
    if (successMsg) {
      successMsg.style.display = 'block';
      form.style.display = 'none';
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        successMsg.style.display = 'none';
      }, 3000);
    }
  });
}

function initThemeToggle() {
  const themeButton = document.querySelector('[data-theme-toggle]');
  if (!themeButton) return;
  const updateAria = () => {
    const srOnly = themeButton.querySelector('.sr-only');
    if (srOnly) srOnly.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? 'Tema escuro ativado' : 'Tema claro ativado';
  };
  themeButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    updateAria();
  });
  updateAria();
}

function clearFilters() {
  state.filters = { origin: 'all', roast: 'all', flavor: 'all' };
  document.querySelectorAll('.filter-pill').forEach(button => {
    button.classList.toggle('active', button.dataset.filter === 'all');
  });
  renderProducts();
}

function initAddOnDetailPage() {
  if (!document.querySelector('.product-detail-hero')) return;
  const detailButton = document.querySelector('[data-add-cart]');
  if (!detailButton) return;
  detailButton.addEventListener('click', () => addToCart(detailButton.dataset.addCart));
}

function init() {
  initTheme();
  initThemeToggle();
  initMobileNav();
  initCartControls();
  initFilters();
  initPlanToggle();
  initPlanSelection();
  initContactForm();
  initAddOnDetailPage();
  renderCart();
  renderProducts();
}

window.addEventListener('DOMContentLoaded', init);
