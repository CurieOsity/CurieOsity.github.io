// store.js - E-commerce product rendering and navigation logic

/* Constants */
const PRODUCTS_DATA_URL = '/assets/data/products.json';
const STORE_CONTAINER_ID = 'store-container';
const SCROLL_DELAY_MS = 100; // Allow time for DOM rendering after load

/* Core Functions */
async function loadAndRenderStore() {
  try {
    const products = await fetchProductsData();
    renderStoreInterface(products);
    handleInitialHashNavigation();
  } catch (error) {
    handleLoadingError(error);
  }
}

async function fetchProductsData() {
  const response = await fetch(PRODUCTS_DATA_URL);
  const data = await response.json();
  return data.products;
}

function renderStoreInterface(products) {
  const container = document.getElementById(STORE_CONTAINER_ID);
  const groupedProducts = groupProductsByCategory(products);
  
  container.innerHTML = ''; // Clear previous content
  container.insertAdjacentHTML('afterbegin', createCategoryNavigationMenu(groupedProducts));
  
  Object.entries(groupedProducts).forEach(([category, items]) => {
    container.insertAdjacentHTML('beforeend', createCategorySection(category, items));
  });
  
  setupCategoryNavigation();
}

/* Navigation & Scrolling */
function handleInitialHashNavigation() {
  if (window.location.pathname !== "/store") return;
  
  const targetElement = getHashTargetElement();
  if (targetElement) {
    setTimeout(() => smoothScrollTo(targetElement), SCROLL_DELAY_MS);
  }
}

function setupCategoryNavigation() {
  document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', handleCategoryClick);
  });
}

function handleCategoryClick(event) {
  event.preventDefault();
  const targetUrl = new URL(event.currentTarget.href);
  
  history.pushState(null, null, targetUrl.pathname + targetUrl.hash);
  const targetElement = getHashTargetElement(targetUrl.hash);
  
  if (targetElement) smoothScrollTo(targetElement);
}

/* DOM Helpers */
function createCategoryNavigationMenu(groupedProducts) {
  const categories = Object.keys(groupedProducts);
  const menuItems = categories.map(category => `
    <a href="/store#${category.toLowerCase()}" class="category-link">${category}</a>
  `).join('');
  
  return `
    <nav class="category-nav">
      <div class="category-menu">${menuItems}</div>
    </nav>
  `;
}

function createCategorySection(category, products) {
  return `
    <div class="category-section" id="${category.toLowerCase()}">
      <h2 class="product-category">${category}</h2>
      ${products.map(createProductCard).join('')}
    </div>
  `;
}

function createProductCard(product) {
  const colorSwatches = product.colors.map(color => `
    <div class="color-swatch" style="background: ${color}"></div>
  `).join('');

  return `
    <article class="product-card">
      <h3 class="product-title">${product.title}</h3>
      <div class="color-swatches">${colorSwatches}</div>
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

/* Utilities */
function groupProductsByCategory(products) {
  return products.reduce((acc, product) => {
    acc[product.category] = [...(acc[product.category] || []), product];
    return acc;
  }, {});
}

function getHashTargetElement(hash = window.location.hash) {
  return hash ? document.querySelector(hash) : null;
}

function smoothScrollTo(element) {
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleLoadingError(error) {
  console.error('Error loading products:', error);
  document.getElementById(STORE_CONTAINER_ID).innerHTML = `
    <p class="error-message">Échec du chargement des produits. Veuillez réessayer plus tard.</p>
  `;
}

/* Initialization */
document.addEventListener('DOMContentLoaded', loadAndRenderStore);
