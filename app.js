// SELECT ELEMENTS
const productsEl = document.querySelector(".products");
const cartItemsEl = document.querySelector(".cart-items");
const subtotalEl = document.querySelector(".subtotal");
const totalItemsInCartEl = document.querySelector(".total-items-in-cart");

// RENDER PRODUCTS
function renderProdcuts() {
  products.forEach((product) => {
    productsEl.innerHTML += `
        <div class="item">
        <div class=" filter ${product.filter}">
            <div class="portfolio-box">
                <div class="card">
                    <img src="${product.imgSrc}" alt="${product.name}" style="width:100%">
                    <h2>${product.name}</h2>
                    <p class="price text-center"><small>$</small>${product.price}</p>
                    <p><button class="btn btn-outline-primary add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button></p>
                </div>
            </div>
        </div>
        `;
  });
}
renderProdcuts();

// cart array
let cart = JSON.parse(localStorage.getItem("CART")) || [];
updateCart();

// ADD TO CART
function addToCart(id) {
  // check if prodcut already exist in cart
  if (cart.some((item) => item.id === id)) {
    changeNumberOfUnits("plus", id);
  } else {
    const item = products.find((product) => product.id === id);

    cart.push({
      ...item,
      numberOfUnits: 1,
    });
  }

  updateCart();
}

// update cart
function updateCart() {
  renderCartItems();
  renderSubtotal();

  // save cart to local storage
  localStorage.setItem("CART", JSON.stringify(cart));
}

// calculate and render subtotal
function renderSubtotal() {
  let totalPrice = 0,
    totalItems = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.numberOfUnits;
    totalItems += item.numberOfUnits;
  });

  subtotalEl.innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(2)}`;
  totalItemsInCartEl.innerHTML = totalItems;
}

// render cart items
function renderCartItems() {
  cartItemsEl.innerHTML = ""; // clear cart element
  cart.forEach((item) => {
    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <tr>
            <div class="cart-items-img"><td scope="col" class="text-center item-info" onclick="removeItemFromCart(${item.id})"> <img src="${item.imgSrc}" alt="${item.name}" style="width: 25%;">${item.name}</td></div>
            <div class="cart-items-price"><td scope="col" colspan="2" class="text-center"><small>$</small>${item.price}</td></div>
            <div class="cart-items-qty"><td scope="col" class="text-center">
            <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})">+</div>
            <div class="number">${item.numberOfUnits}</div>
            <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})">-</div>
            </td></div>
        </tr>
      </div>
        `;
  });
}

// remove item from cart
function removeItemFromCart(id) {
  cart = cart.filter((item) => item.id !== id);

  updateCart();
}

// change number of units for an item
function changeNumberOfUnits(action, id) {
  cart = cart.map((item) => {
    let numberOfUnits = item.numberOfUnits;

    if (item.id === id) {
      if (action === "minus" && numberOfUnits > 1) {
        numberOfUnits--;
      } else if (action === "plus" && numberOfUnits < item.instock) {
        numberOfUnits++;
      }
    }

    return {
      ...item,
      numberOfUnits,
    };
  });

  updateCart();
}