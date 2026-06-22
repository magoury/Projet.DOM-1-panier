// Données des produits disponibles dans le site
var productsData = {
  baskets: {
    id: 'baskets',
    name: 'Baskets',
    description: 'Chaussures confortables pour tous les jours.',
    price: 100,
    image: 'assets/baskets.png'
  },
  socks: {
    id: 'socks',
    name: 'Socks',
    description: 'Chaussettes douces et résistantes.',
    price: 20,
    image: 'assets/socks.png'
  },
  bag: {
    id: 'bag',
    name: 'Bag',
    description: 'Sac pratique pour transporter vos affaires.',
    price: 50,
    image: 'assets/bag.png'
  }
};

// Sélection des éléments DOM
var cartCountElement = document.querySelector('.cart-count');
var addCartButtons = document.querySelectorAll('.btn-add-to-cart');
var favoriteButtons = document.querySelectorAll('.btn-favorite');
var cartItemsContainer = document.querySelector('.cart-items');
var emptyCartMessage = document.querySelector('.empty-cart');
var totalElement = document.querySelector('.total');




// Récupère le panier dans le localStorage
function getCart() {
  var cartData = localStorage.getItem('shoppingCart');
  if (cartData) {
    return JSON.parse(cartData);
  }
  return {};
}

// Enregistre le panier dans le localStorage
function saveCart(cart) {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Met à jour le compteur sur l'icône panier
function updateCartCount() {
  var cart = getCart();
  var count = 0;

  for (var id in cart) {
    if (cart.hasOwnProperty(id)) {
      count = count + cart[id];
    }
  }

  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// Ajoute un produit au panier depuis la page d'accueil
function ajouterAuPanier(event) {
  var target = event.target;
  var button = target;

  while (button && button.className.indexOf('btn-add-to-cart') === -1) {
    button = button.parentNode;
  }

  if (!button) {
    return;
  }

  var cardBody = button.parentNode.parentNode;
  var productId = cardBody.getAttribute('data-product-id');
  var cart = getCart();

  if (!cart[productId]) {
    cart[productId] = 0;
  }

  cart[productId] = cart[productId] + 1;
  saveCart(cart);
  updateCartCount();
}

// Bascule le cœur favoris
function basculerFavori(event) {
  var target = event.target;
  var button = target;

  while (button && button.className.indexOf('btn-favorite') === -1) {
    button = button.parentNode;
  }

  if (!button) {
    return;
  }

  button.classList.toggle('favori-actif');
}

// Crée un élément de ligne de panier pour la page cart.html
function creerLigneProduitCart(product, quantity) {
  var itemRow = document.createElement('div');
  itemRow.className = 'cart-item';
  itemRow.setAttribute('data-product-id', product.id);

  var imageElement = document.createElement('img');
  imageElement.className = 'cart-image';
  imageElement.src = product.image;
  imageElement.alt = product.name;

  var detailsElement = document.createElement('div');
  detailsElement.className = 'cart-details';

  var titleElement = document.createElement('h5');
  titleElement.textContent = product.name;

  var descriptionElement = document.createElement('p');
  descriptionElement.textContent = product.description;

  var priceElement = document.createElement('p');
  priceElement.className = 'item-price';
  priceElement.textContent = product.price + ' $';

  detailsElement.appendChild(titleElement);
  detailsElement.appendChild(descriptionElement);
  detailsElement.appendChild(priceElement);

  var controlsElement = document.createElement('div');
  controlsElement.className = 'cart-controls';

  var minusIcon = document.createElement('i');
  minusIcon.className = 'fas fa-minus-circle btn-minus';
  minusIcon.title = 'Réduire la quantité';

  var quantityElement = document.createElement('span');
  quantityElement.className = 'quantity-value';
  quantityElement.textContent = quantity;

  var plusIcon = document.createElement('i');
  plusIcon.className = 'fas fa-plus-circle btn-plus';
  plusIcon.title = 'Augmenter la quantité';

  controlsElement.appendChild(minusIcon);
  controlsElement.appendChild(quantityElement);
  controlsElement.appendChild(plusIcon);

  var actionsElement = document.createElement('div');
  actionsElement.className = 'cart-actions';

  var trashIcon = document.createElement('i');
  trashIcon.className = 'fas fa-trash-alt btn-remove';
  trashIcon.title = 'Supprimer le produit';

  actionsElement.appendChild(trashIcon);

  itemRow.appendChild(imageElement);
  itemRow.appendChild(detailsElement);
  itemRow.appendChild(controlsElement);
  itemRow.appendChild(actionsElement);

  plusIcon.addEventListener('click', function () {
    modifierQuantiteProduit(product.id, quantity + 1);
  });

  minusIcon.addEventListener('click', function () {
    modifierQuantiteProduit(product.id, quantity - 1);
  });

  trashIcon.addEventListener('click', function () {
    supprimerProduitDuPanier(product.id);
  });

  return itemRow;
}

// Modifie la quantité d'un produit sur la page panier
function modifierQuantiteProduit(productId, newQuantity) {
  var cart = getCart();

  if (newQuantity <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = newQuantity;
  }

  saveCart(cart);
  updateCartCount();
  afficherPanier();
}

// Supprime un produit du panier
function supprimerProduitDuPanier(productId) {
  var cart = getCart();
  delete cart[productId];
  saveCart(cart);
  updateCartCount();
  afficherPanier();
}

// Affiche le contenu du panier sur cart.html
function afficherPanier() {


  if (!cartItemsContainer) {
    return;
  }


  var cart = getCart();

  var total = 0;

  var itemsCount = 0;


  cartItemsContainer.innerHTML = "";


  for (var id in cart) {


    if(cart.hasOwnProperty(id) && productsData[id]){


      var quantity = cart[id];

      var product = productsData[id];


      var item = creerLigneProduitCart(product, quantity);


      cartItemsContainer.appendChild(item);



      total = total + (product.price * quantity);


      itemsCount++;

    }

  }



  if(emptyCartMessage){


    if(itemsCount === 0){

      emptyCartMessage.classList.add("active");

    }

    else{

      emptyCartMessage.classList.remove("active");

    }

  }



  if(totalElement){

    totalElement.textContent = total + " $";

  }


}

// Initialise la page en fonction du contenu
function initialiserPage() {
  updateCartCount();

  for (var i = 0; i < addCartButtons.length; i++) {
    addCartButtons[i].addEventListener('click', ajouterAuPanier);
  }

  for (var j = 0; j < favoriteButtons.length; j++) {
    favoriteButtons[j].addEventListener('click', basculerFavori);
  }

  afficherPanier();
}

document.addEventListener('DOMContentLoaded', function () {
  initialiserPage();
});
