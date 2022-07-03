import { Cart } from './cart.js';
import { validate } from './validate.js'

const cart = new Cart();
const cartList = document.querySelector('.cart-items__list');

const createCartItem = (item) => {

    let li = document.querySelector(`[data-item-id="${item.id}"]`);

    if (!li) {
        li = document.createElement('li');
        li.className = 'cart-item';
        li.dataset.itemId = item.id;
        cartList.append(li);
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
            <button class="cart-item__remove">
                <svg class="itemSvg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
                </svg>
            </button>
        </div>
    `;
    
}

const updatePrecheck = () => {
    const precheck = document.querySelector('.products__precheck');
    const count = cart.getCountAll();
    const price = cart.getSum();
    const discount = cart.getDiscount();
    const priceNotDiscount = price + discount;

    console.log(price, discount);

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

const checkLocalCart = () => {
    const data = cart.getData();

    if (data.length > 0) {
        data.forEach(item => createCartItem(item));
    } else {
        document.querySelector('.cart-block__message').classList.toggle('disable');
    }
}



const addCartItem = (event) => {
    event.preventDefault();
    const id = document.querySelector('#input-id');
    const title = document.querySelector('#input-title');
    const price = document.querySelector('#input-price');

    let errors = validate.test([[id, 'num'], [title, 'textnum'], [price, 'num']]);

    if (errors.length != 0) {
        errors.forEach(error => document.querySelector('.error-product').append(error));
        return;
    }

    cart.add({
        "id": id.value,
        "title": title.value,
        "price": price.value,
        "count": 1
    });
    
    createCartItem(cart.getById(id.value));

    [id, title, price].forEach(input => input.value = '');
    document.querySelector('.cart-block__message').classList.remove('disable');
}


// cart.setDiscount(10)

checkLocalCart();
updatePrecheck();
validate.setEvent(document.querySelectorAll('.form__item-input'));
document.querySelector('.form-product__add').addEventListener('click', addCartItem)




