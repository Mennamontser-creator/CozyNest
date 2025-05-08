document.addEventListener('DOMContentLoaded', function () {
  fetchProducts()
  setupViewToggle()
  setupStickyNavbar()
})

function fetchProducts() {
  fetch('assets/data/products.json')
    .then((response) => response.json())
    .then((products) => {
      renderProducts(products, 'grid')
    })
    .catch((error) => console.error('Error loading products:', error))
}

function renderProducts(products, viewType) {
  const container = document.getElementById('products-container')
  container.innerHTML = ''

  products.forEach((product) => {
    const productHTML =
      viewType === 'grid'
        ? createGridProductCard(product)
        : createListProductCard(product)
    container.insertAdjacentHTML('beforeend', productHTML)
  })
}

function createGridProductCard(product) {
  return `
  <div class="col-md-4 mb-4">
      <div class="card h-100">
          <img src="${product.image}" class="card-img-top product-img" alt="${
    product.name
  }">
          <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <div class="rating mb-2">
                  ${createRatingStars(product.rating)} (${product.reviewsCount})
              </div>
              <p class="card-text">
                  $${product.salePrice.toFixed(2)} 
                  <del class="text-muted">$${product.price.toFixed(2)}</del>
                  <span class="text-success small ms-2">${
                    product.discountPercent
                  }% OFF</span>
              </p>
              <a href="product.html?slug=${
                product.slug
              }" class="btn btn-main">View Product</a>
          </div>
      </div>
  </div>`
}

function createListProductCard(product) {
  return `
  <div class="col-12 mb-4">
      <div class="product-card list-view">
          <img src="${product.image}" class="product-img rounded" alt="${
    product.name
  }">
          <div class="product-details">
              <h5>${product.name}</h5>
              <div class="rating mb-2">
                  ${createRatingStars(product.rating)} (${product.reviewsCount})
              </div>
              <p>
                  $${product.salePrice.toFixed(2)} 
                  <del class="text-muted">$${product.price.toFixed(2)}</del>
                  <span class="text-success small ms-2">${
                    product.discountPercent
                  }% OFF</span>
              </p>
              <p class="small">${product.description.substring(0, 100)}...</p>
              <a href="product.html?slug=${
                product.slug
              }" class="btn btn-main">View Product</a>
          </div>
      </div>
  </div>`
}

function createRatingStars(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5 ? 1 : 0
  const emptyStars = 5 - fullStars - halfStar

  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars)
}

// Sticky Navbar After 10dvh Scroll
const navbar = document.querySelector('.navbar')
window.addEventListener('scroll', function () {
  const triggerPoint = window.innerHeight * 0.1 // 10dvh
  if (window.scrollY > triggerPoint) {
    navbar.classList.add('sticky-on-scroll')
  } else {
    navbar.classList.remove('sticky-on-scroll')
  }
})
