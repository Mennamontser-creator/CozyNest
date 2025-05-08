document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search)
  const productSlug = urlParams.get('slug')

  if (!productSlug) {
    window.location.href = 'shop.html'
    return
  }

  fetchProductDetails(productSlug)
  setupStickyNavbar()
})

function fetchProductDetails(slug) {
  fetch('../assets/data/products.json')
    .then((response) => response.json())
    .then((products) => {
      const product = products.find((p) => p.slug === slug)

      if (!product) {
        window.location.href = '../shop.html'
        return
      }

      renderProductDetails(product)
    })
    .catch((error) => {
      console.error('Error loading product:', error)
      window.location.href = '../shop.html'
    })
}

function renderProductDetails(product) {
  document.title = `${product.name} | CozyNest`
  document.getElementById('product-breadcrumb').textContent = product.name

  const container = document.getElementById('product-detail-container')
  container.innerHTML = `
      <div class="col-md-6">
          <div class="product-gallery">
              <img src="${product.image}" class="img-fluid rounded" alt="${
    product.name
  }" id="main-product-image">
              <div class="d-flex gap-2 mt-3">
                  ${[1, 2, 3, 4]
                    .map(
                      (i) => `
                  <img src="${product.image.replace(
                    '_img',
                    '_img' + i
                  )}" width="80" class="img-thumbnail thumbnail" data-img="${product.image.replace(
                        '_img',
                        '_img' + i
                      )}">
                  `
                    )
                    .join('')}
              </div>
          </div>
      </div>
      <div class="col-md-6">
          <h1>${product.name}</h1>
          <div class="rating mb-3">
              ${createRatingStars(product.rating)} 
              <span class="text-muted">(${product.reviewsCount} reviews)</span>
          </div>
          <div class="price-container mb-4">
              <span class="h4 text-main">$${product.salePrice.toFixed(2)}</span>
              <del class="text-muted ms-2">$${product.price.toFixed(2)}</del>
              <span class="badge bg-success ms-2">${
                product.discountPercent
              }% OFF</span>
          </div>
          <p class="mb-4">${product.description}</p>
          <div class="d-flex gap-3 mb-4">
              <div class="input-group" style="width: 120px;">
                  <button class="btn btn-outline-secondary minus-btn">-</button>
                  <input type="text" class="form-control text-center quantity-input" value="1">
                  <button class="btn btn-outline-secondary plus-btn">+</button>
              </div>
              <button class="btn btn-main flex-grow-1 add-to-cart">Add to Cart</button>
          </div>
          <div class="product-meta">
              <p class="mb-1"><strong>SKU:</strong> CN-${product.id
                .toString()
                .padStart(3, '0')}</p>
              <p class="mb-1"><strong>Category:</strong> ${getCategory(
                product.name
              )}</p>
              <p class="mb-1"><strong>Availability:</strong> In Stock</p>
          </div>
      </div>
      
      <!-- Tabs -->
      <div class="col-12 mt-5">
          <ul class="nav nav-tabs" id="productTabs">
              <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#description">Description</a></li>
              <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#reviews">Reviews (${
                product.reviewsCount
              })</a></li>
          </ul>
          <div class="tab-content p-3 border border-top-0">
              <div id="description" class="tab-pane fade show active">
                  <p>${product.description}</p>
                  <h5>Features</h5>
                  <ul>
                      <li>Premium ${
                        product.name.includes('Sofa')
                          ? 'upholstery'
                          : 'materials'
                      }</li>
                      <li>Easy to assemble</li>
                      <li>1-year warranty</li>
                  </ul>
              </div>
              <div id="reviews" class="tab-pane fade">
                  <div class="review">
                      <div class="rating mb-2">★★★★★</div>
                      <h5>Perfect addition to our home</h5>
                      <p class="text-muted">By John D. on ${new Date().toLocaleDateString()}</p>
                      <p>${product.description.substring(0, 150)}...</p>
                  </div>
              </div>
          </div>
      </div>
      
      <!-- Related Products -->
      <div class="col-12 mt-5">
          <h4>Related Products</h4>
          <div class="row" id="related-products"></div>
      </div>
  `

  // Setup thumbnail click events
  document.querySelectorAll('.thumbnail').forEach((thumb) => {
    thumb.addEventListener('click', function () {
      document.getElementById('main-product-image').src = this.dataset.img
    })
  })

  // Setup quantity buttons
  document.querySelector('.minus-btn')?.addEventListener('click', function () {
    const input = document.querySelector('.quantity-input')
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1
  })

  document.querySelector('.plus-btn')?.addEventListener('click', function () {
    const input = document.querySelector('.quantity-input')
    input.value = parseInt(input.value) + 1
  })

  // Load related products
  fetchRelatedProducts(getCategory(product.name))
}

function getCategory(productName) {
  if (productName.toLowerCase().includes('sofa')) return 'Sofas'
  if (productName.toLowerCase().includes('chair')) return 'Chairs'
  if (productName.toLowerCase().includes('table')) return 'Tables'
  return 'Furniture'
}

function createRatingStars(rating) {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5 ? 1 : 0
  const emptyStars = 5 - fullStars - halfStar

  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars)
}

function fetchRelatedProducts(category) {
  fetch('../assets/data/products.json')
    .then((response) => response.json())
    .then((products) => {
      const related = products
        .filter((p) => getCategory(p.name) === category)
        .slice(0, 4)

      const container = document.getElementById('related-products')
      if (container) {
        container.innerHTML = related
          .map(
            (product) => `
                  <div class="col-md-3">
                      <div class="card">
                          <img src="${
                            product.image
                          }" class="card-img-top" alt="${product.name}">
                          <div class="card-body">
                              <h6>${product.name}</h6>
                              <p class="text-danger">
                                  $${product.salePrice.toFixed(2)}
                                  <del class="text-muted">$${product.price.toFixed(
                                    2
                                  )}</del>
                              </p>
                              <a href="product.html?slug=${
                                product.slug
                              }" class="btn btn-sm btn-main">View</a>
                          </div>
                      </div>
                  </div>
              `
          )
          .join('')
      }
    })
}

function setupStickyNavbar() {
  const navbar = document.querySelector('.navbar')
  if (navbar) {
    window.addEventListener('scroll', function () {
      const triggerPoint = window.innerHeight * 0.1
      navbar.classList.toggle('sticky-on-scroll', window.scrollY > triggerPoint)
    })
  }
}
