if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  // function to remove item from cart
  var removeCartItemButtons = document.getElementsByClassName("btn-danger");
  // console.log(removeCartItemButtons);
  for (var i = 0; i < removeCartItemButtons.length; i++) {
    var button = removeCartItemButtons[i];
    button.addEventListener("click", removeCartItem);
  }

  // function to add quantity in cart
  var quantityInputs = document.getElementsByClassName("cart-quantity-input");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChange);
  }

  // function add item to cart
  var addToCartButtons = document.getElementsByClassName("shop-item-button");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }

  // purchase
  document.getElementsByClassName("btn-purchase")[0].addEventListener("click", purchaseClick);
}

function purchaseClick() {
  alert("Thank you for your purchase");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
}

function removeCartItem(event) {
  // console.log("clicked");
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove(); // target hapus seluruh isi ".cart-row"
  updateCartTotal();
}

function quantityChange(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateCartTotal();
}

function addToCartClicked(event) {
  var button = event.target;

  //   we need price, name, and image
  var shopItem = button.parentElement.parentElement; // target isi ".shop-item"
  var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText;
  var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText;
  var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src;
  //   console.log(title, price, imageSrc);

  addItemToCart(title, price, imageSrc);
  updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
  var cartRow = document.createElement("div"); // buat sebuah <div></div>
  cartRow.classList.add("cart-row"); // add class="cart-row" ke div di atas
  var cartItems = document.getElementsByClassName("cart-items")[0];

  // memastikan kita tidak add 2 item yg sama
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert("This item is already added to the cart");
      return;
    }
  }

  // bikin content untuk item yang mau di add ke cart
  var cartRowContents = `
    <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100" />
            <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1" />
        <button class="btn btn-danger" type="button">REMOVE</button>
    </div>
    `;

  cartRow.innerHTML = cartRowContents; // isi <div class="cart-row"> dengan content diatas
  cartItems.append(cartRow); // masukkan <div class="cart-row"> ke dalam <div class="cart-items">

  // remove and quantity button not working for new added item? Because when we add new item, ready() already execute as soon as page uploaded first
  cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem);
  cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChange);
}

function updateCartTotal() {
  var cartItemContainer = document.getElementsByClassName("cart-items")[0]; //classname, jadinya array padahal isi cuma 1
  var cartRows = cartItemContainer.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName("cart-price")[0]; //classname, isi cuma 1 karena for loop
    var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
    console.log(priceElement, quantityElement);
    var price = parseFloat(priceElement.innerHTML.replace("$", ""));
    var quantity = quantityElement.value;
    // console.log(price * quantity);
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("cart-total-price")[0].innerText = "$" + total;
}
