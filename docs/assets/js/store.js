// store.js
async function fetchProducts() {
  try {
    const response = await fetch('/assets/data/products.json');
    const data = await response.json();
    renderProducts(data.products);
  } catch (error) {
    console.error('Error loading products:', error);
    document.getElementById('store-container').innerHTML = `
      <p class="error-message">Échec du chargement des produits. Veuillez réessayer plus tard.</p>
    `;
  }
}

function handleCategoryNavigation() {
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = new URL(link.href).hash;
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function renderProducts(products) {
  const container = document.getElementById('store-container');
  const groupedProducts = groupByCategory(products);

  // Create category navigation
  const categories = Object.keys(groupedProducts);
  const categoryMenu = createCategoryMenu(categories);
  container.insertAdjacentHTML('afterbegin', categoryMenu);

  // Create product sections
  categories.forEach(category => {
    const sectionHTML = `
      <div class="category-section" id="${category.toLowerCase()}">
        <h2 class="product-category">${category}</h2>
        ${groupedProducts[category].map(product => createProductCard(product)).join('')}
      </div>
    `;
    container.insertAdjacentHTML('beforeend', sectionHTML);
  });
  handleCategoryNavigation();
}

function groupByCategory(products) {
  return products.reduce((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});
}

function createProductCard(product) {
  const colorsHTML = product.colors.map(color => `
    <div class="color-swatch" style="background: ${color}"></div>
  `).join('');

  return `
    <article class="product-card">
      <h3 class="product-title">${product.title}</h3>
      <div class="color-swatches">${colorsHTML}</div>
      <p class="product-description">${product.description}</p>
      <iframe class="store-iframe" 
              src="${product['url-store']}"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
              title="Boutique ${product.title}">
      </iframe>
    </article>
  `;
}

function createCategoryMenu(categories) {
  const menuItems = categories.map(category => `
    <a href="${window.location.pathname}#${category.toLowerCase()}" class="category-link">${category}</a>
  `).join('');

  return `
    <nav class="category-nav">
      <div class="category-menu">
        ${menuItems}
      </div>
    </nav>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});
