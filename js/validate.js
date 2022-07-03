export const validate = {
    regexp: {
        'textnum': /[^0-9A-ZА-ЯЁ]+$/ig,
        'text': /[^A-ZА-ЯЁ]+$/ig,
        'num': /[^0-9]+$/ig,
    },

    emptyInput(input) {
        if (!input.value) {
            return `Поле ${input.placeholder} не заполнено!`;
        }
        return false;
    },

    checkRegexp(input, regexp) {
        if (regexp.test(input.value)) {
            return `В поле ${input.placeholder} недопустимые символы!`;
        }
        return false;
    },

    checkMax(input, max) {
        if (input.value.length !== max) {
            return `Поле ${input.placeholder} должно состоять из ${max} символов!`;
        }
        return false;
    },

    createError(classList, errorMess) {
        let mess = document.createElement('p');
        mess.classList.add(classList);
        mess.textContent = errorMess;
        return mess;
    },

    setEvent(inputs) {
        inputs.forEach(input => {

            input.addEventListener('click', () => {
                console.log(input);
                input.classList.remove('input--error');
                let errP = document.querySelector('.error-' + input.id);
                if (errP) { errP.remove(); }
            });

        });
    },

    test(inputs) {
        let error = [];

        document.querySelector('.form__error').textContent = '';

        inputs.forEach(input => {

            let errorMess = this.emptyInput(input[0]) || this.checkRegexp(input[0], this.regexp[input[1]]) || '';

            if (errorMess) {

                error.push(this.createError('error-' + input[0].id, errorMess));
                input[0].classList.add('input--error');

            }
        });
        return error;
    },
}