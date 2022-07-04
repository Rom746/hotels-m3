export function Cart() {
    this.updateData();
    this.updateDiscount();
}


Cart.prototype.updateData = function () {
    this.data = JSON.parse(localStorage.getItem('cart')) || [];
    return this.data;
}

Cart.prototype.getData = function () {
    return this.data;
}

Cart.prototype.saveData = function () {
    localStorage.setItem('cart', JSON.stringify(this.data));
    return this.data;
}


Cart.prototype.clearData = function () {
    this.data = [];
    this.saveData();
    return this.data;
}

Cart.prototype.getById = function (id) {
    this.updateData();
    return this.data.filter(item => item.id == id)[0];
}

Cart.prototype.add = function (item) {
    const oldItem = this.getById(item.id);
    if (!oldItem) {
        this.data.push(item);
    } else {
        oldItem.count = oldItem.count + item.count;
    }
    this.saveData();
    return item;
}

Cart.prototype.remove = function (id) {
    this.updateData();
    this.data = this.data.filter(item => item.id != id);
    this.saveData();
    return this.data;
}

Cart.prototype.changeCount = function (id, d) {

    const oldItem = this.getById(item.id);

    if (oldItem) {
        oldItem.count = oldItem.count + d;
        if (oldItem.count < 1) {
            this.remove(id);
        }
        this.saveData();
    }
    return this.getById(item.id) || {};
}

Cart.prototype.getCount = function () {
    return this.data.length;
}

Cart.prototype.getCountAll = function () {
    return this.data.reduce((prev, cur) => prev + cur.count, 0);
}

Cart.prototype.getSum = function () {
    return this.data.reduce((prev, cur) => prev + cur.count * cur.price, 0);
}

Cart.prototype.updateDiscount = function () {
    this.discount = JSON.parse(localStorage.getItem('cart-discount')) || false;
}

Cart.prototype.saveDiscount = function (value) {
    this.discount = value;
    localStorage.setItem('cart-discount', JSON.stringify(this.discount));
    return this.discount;
}

Cart.prototype.getDiscount = function () {
    return this.discount;
}

Cart.prototype.setDiscount = function (percent = this.discount) {

    this.updateData();
    this.data = this.data.map(item => {
        if (percent == 0) {
            item.price = item.oldPrice || item.price;
            item.oldPrice = false;
            this.saveDiscount(false);
        } else {
            if (!item.oldPrice) {
                item.oldPrice = item.price;
            }
            item.price = item.oldPrice - Math.round(item.oldPrice * (percent / 100));
            this.saveDiscount(percent);
        }
        return item;
    });
    this.saveData();
    return this.data;
}

Cart.prototype.getDiscountSum = function () {
    return this.data.reduce((prev, cur) => {
        if (cur.oldPrice) {
            return prev + cur.count * (cur.oldPrice - cur.price)
        }
        return prev;
    }, 0);
}