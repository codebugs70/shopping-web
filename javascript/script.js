const productList = document.querySelector(".product-list");
const addBtn = document.querySelector(".buy-btn");
const cartToggle = document.querySelector(".header-toggle");
const modal = document.querySelector(".modal");
const closeBtn = document.querySelector(".modal-close");
const cartList = document.querySelector(".cart-product-list");
const totalPrice = document.querySelector(".total-price");
const checkoutBtn = document.querySelector(".check-out");
const cartCounter = document.querySelector(".cart-count");

let cartStore = [];

// HANDLE RENDER PROFUCTS (hiển thị danh sách các sản phẩm)
function renderProducts() {
  PRODUCTS.forEach((item, index) => {
    const template = `<li class="product-item">
        <div class="product-item-image">
          <img src="${item.img}" alt="" />
        </div>
        <h1 class="product-item-title">${item.name}</h1>
        <div class="product-item-action">
          <span class="product-item-price">${item.price}$</span>
          <span class="heart-icon">
            <i class="fa-solid fa-heart"></i>
          </span>
        </div>
        <button onClick="handleAddToCart(${index})" class="buy-btn">Add to cart</button>
      </li>`;
    productList.insertAdjacentHTML("beforeend", template);
  });
}
renderProducts();

// stored in localStorage (lưu vào localStorage)
if (localStorage.getItem("PRODUCTS")) {
  cartStore = JSON.parse(localStorage.getItem("PRODUCTS"));
  renderCartProduct();
}

// Function to initialize the cart count
function initializeCartCount() {
  const storedCart = localStorage.getItem("PRODUCTS");
  if (storedCart) {
    const cart = JSON.parse(storedCart);
    const productCount = cart.length;
    cartCounter.textContent = productCount;
  }
}
initializeCartCount();

// HANDLE ADD TO CART (thêm sản phẩm vào giỏ hàng)
function handleAddToCart(productIndex) {
  const productItem = PRODUCTS[productIndex];
  const isExistedProduct = cartStore.find((item) => item.id === productItem.id);
  if (isExistedProduct) {
    isExistedProduct.quantity += 1;
  } else {
    productItem.quantity = 1;
    cartStore.push(productItem);
  }

  const productCount = cartStore.length;
  cartCounter.textContent = productCount;

  localStorage.setItem("PRODUCTS", JSON.stringify(cartStore));
  renderCartProduct();
}

// HANDLE INCREASE PRODUCT (tăng thêm sản phẩm khi click)
function handleIncrement(productIndex) {
  const productItem = PRODUCTS[productIndex];
  cartStore = cartStore.map((item, index) =>
    index === productIndex ? { ...item, quantity: item.quantity + 1 } : item
  );
  localStorage.setItem("PRODUCTS", JSON.stringify(cartStore));

  renderCartProduct();
}

// HANDLE DECREASE PRODUCT (giảm sản phẩm khi click)
function handleDecrement(productIndex) {
  const productItem = cartStore[productIndex];
  if (!productItem) {
    return;
  }
  if (productItem.quantity === 1) {
    cartStore = cartStore.filter((item) => item.id !== productItem.id);
  } else {
    cartStore = cartStore.map((item, index) =>
      index === productIndex ? { ...item, quantity: item.quantity - 1 } : item
    );
  }
  localStorage.setItem("PRODUCTS", JSON.stringify(cartStore));
  renderCartProduct();
}

// CACULATE MONEY (tính tiền tổng đơn mua hàng)
function calculateTotalAmount() {
  let totalAmount = 0;
  cartStore.length > 0 &&
    cartStore.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });
  localStorage.setItem("PRODUCTS", JSON.stringify(cartStore));
  return totalAmount;
}

// CLEAR CART (clear giỏ hàng khi thanh toán)
checkoutBtn.addEventListener("click", function () {
  cartStore = [];
  renderCartProduct();
});

// HANDLE RENDER PRODUCT TO MODAL (hiển thị danh sách sản phẩm vào modal sau khi add)
function renderCartProduct() {
  const cartItems = document.querySelectorAll(".cart-product-item");
  cartItems.forEach((item) => item.remove()); //remove item tránh bị trùng khi hiển thị
  cartStore.length > 0 &&
    cartStore.forEach((item, index) => {
      const template = `<li class="cart-product-item">
    <div class="cart-product-info">
      <img src="${item.img}" alt="" />
      <div class="col">
        <h1 class="cart-product-title">${item.name}</h1>
        <span class="cart-product-price">${item.price}$</span>
      </div>
    </div>
    <div class="cart-product-action">
      <span onClick="handleIncrement(${index})" class="plus-icon">
        <i class="fa-solid fa-plus"></i>
      </span>
      <h1 class="cart-product-quantity">${item.quantity}</h1>
      <span onClick="handleDecrement(${index})" class="minus-icon">
        <i class="fa-solid fa-minus"></i>
      </span>
    </div>
  </li>`;
      cartList.insertAdjacentHTML("beforeend", template);
    });

  // tính tiền ship (shippingPrice) = 10$
  const shippingPrice = 10;
  const totalAmount = calculateTotalAmount();
  const totalWithShipping = totalAmount + shippingPrice;

  // check giỏ hàng nếu có sản phẩm thì hiển thị giá, không có thì set mặc định là 0$
  if (cartStore.length > 0) {
    totalPrice.textContent = `Total: ${totalWithShipping}$`;
  } else {
    totalPrice.textContent = `Total: 0$`;
  }
}

// SHOW MODAL (hiển thị modal khi click vào)
cartToggle.addEventListener("click", handleOpenModal);
function handleOpenModal() {
  modal.classList.add("show");
}

// CLOSE MODAL (đóng modal khi click vào nút X hoặc overlay)
document.addEventListener("click", handleCloseModal);
function handleCloseModal(e) {
  if (e.target.matches(".modal-overlay") || e.target.matches(".modal-close")) {
    modal.classList.remove("show");
  }
}
