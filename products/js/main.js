import { Cart } from './cart.js';
import { validate } from './validate.js'



function App() {
    this.cart = new Cart();
    this.cartList = document.querySelector('.cart-items__list');

    this.checkLocalCart();
    this.updatePrecheck();

    validate.setEvent(document.querySelectorAll('.form__item-input'));
    document.querySelector('.form-product__add').addEventListener('click', this.addCartItem.bind(this));
    document.querySelector('.form-discount__add').addEventListener('click', this.setDiscount.bind(this));
    document.querySelector('.form-discount__remove').addEventListener('click', this.setDiscount.bind(this));
    document.querySelectorAll('.cart-item__remove').forEach(btn => btn.addEventListener('click', this.deleteCartItem.bind(this)));
}

App.prototype.checkLocalCart = function() {
    const data = this.cart.getData();
    const discount =this.cart.getDiscount();

    if (discount) {
        document.querySelector('.input-discount').value = discount;
    }

    if (data.length > 0) {
        data.forEach(item => this.createCartItem(item));
    } else {
        document.querySelector('.cart-block__message').classList.remove('disable');
    }
}

App.prototype.updatePrecheck = function() {
    const precheck = document.querySelector('.products__precheck');
    const count =this.cart.getCountAll();
    const price = this.cart.getSum();
    const discount = this.cart.getDiscountSum();
    const priceNotDiscount = price + discount;

    precheck.innerHTML = `
        <h1 class="precheck__title">Ваши товары</h1>
        <div class="precheck__row">
            <p class="precheck__amount">Товары (${count}) </p>
            <p class="precheck__price"> ${priceNotDiscount} ₽ </p>
        </div>
        <div class="precheck__row">
            <p class="">Скидка</p>
            <p class="precheck__discount"> - ${discount} ₽ </p>
        </div>
        <div class="precheck__summary">
            <h2 class="precheck__summary-title">Итого:</h2>
            <div class="precheck__row">
                <p class="">Сумма</p>
                <h2 class="precheck__summary-discount"> ${price} ₽</h2>
            </div>
        </div>
    `;
}

App.prototype.createCartItem = function(item) {

    let li = document.querySelector(`[data-item-id="${item.id}"]`);

    if (!li) {
        li = document.createElement('li');
        li.className = 'cart-item';
        li.dataset.itemId = item.id;
        this.cartList.append(li);
    }

    const oldPrice = item.oldPrice ? item.oldPrice + '₽' : '';

    li.innerHTML = `
        <div class="cart-item__left">
            <h3 class="cart-item__title">${item.title}</h3>
            <p class="cart-item__id">id: ${item.id}</p>
        </div>
        <div class="cart-item__right">
            <p class="cart-item__amount">
                 ${item.count} 
            </p>
            <p class="cart-item__price">
                <span class="cart-item__old-price"> ${oldPrice} </span>
                <span class="price"> ${item.price} ₽ </span>
            </p>
            <button class="cart-item__remove" data-btn-id="${item.id}">
                <svg class="itemSvg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
                </svg>
            </button>
        </div>
    `;
    li.querySelector('.cart-item__remove').addEventListener('click', this.deleteCartItem.bind(this));
}

App.prototype.addCartItem = function (event) {
    event.preventDefault();
    const id = document.querySelector('#input-id');
    const title = document.querySelector('#input-title');
    const price = document.querySelector('#input-price');

    let errors = validate.test([[id, 'num'], [title, 'textnum'], [price, 'num']]);

    if (errors.length != 0) {
        errors.forEach(error => document.querySelector('.error-product').append(error));
        return;
    }


    this.cart.add({
        "id": id.value,
        "title": title.value,
        "price": price.value,
        "count": 1
    });

    if (this.cart.getDiscount()) {
        this.cart.setDiscount();
    }
    console.log(this);

    this.createCartItem(this.cart.getById(id.value));
    this.updatePrecheck();

    [id, title, price].forEach(input => input.value = '');
    document.querySelector('.cart-block__message').classList.add('disable');
}

App.prototype.setDiscount = function (event){
    event.preventDefault();
    const discount = document.querySelector('#input-discount');
    if (event.target.classList.contains('form-discount__remove')) {
        this.cart.setDiscount(0);
        discount.value = '';
    } else {
        let errors = validate.test([[discount, 'num']]);

        if (errors.length != 0) {
            errors.forEach(error => document.querySelector('.error-discount').append(error));
            return;
        }

        this.cart.setDiscount(Number(discount.value));
    }
    this.updatePrecheck();
    this.checkLocalCart();
}


App.prototype.deleteCartItem =  function (event) {
    event.preventDefault();
    let id = event.target.dataset.btnId;
    document.querySelector(`[data-item-id="${id}"]`).remove();
    if (this.cart.remove(id).length == 0) {
        document.querySelector('.cart-block__message').classList.remove('disable');
        this.updatePrecheck();
    }
}

new App();




