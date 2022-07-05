import { getRepositories } from './api.js';

function App() {
    this.input = document.querySelector('.input-search');
    this.input.addEventListener('input', (event) => {
        event.preventDefault();
        this.debounce(this.search.bind(this, 3))()
    });

    const btn = document.querySelector('.form-search__add');
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        this.debounce(this.search.bind(this, 10))()
    });

}

App.prototype.debounce = function (func) {
    
    let throttle = false,
        saved,
        _this;
    
    function wrapper() {

        if (throttle) {
            saved = arguments;
            _this = this;
            return;
        }

        func.apply(this, saved);

        throttle = true;

        setTimeout(function () {
            throttle = false;
            if (saved) {
                wrapper.apply(_this, saved);
                saved = _this = null;
            }
        }, 1000);
    }
    return wrapper;
}

App.prototype.search = function (amount) {
    
    if (this.input.value.length == 0) {
        this.view(false, amount);
        return;
    }
    
    getRepositories(this.input.value, amount).then(response => this.view(response, amount));
}


App.prototype.view = function (res, amount) {

    const tag = (amount < 5) ? '.search__result' : '.result'
    const result = document.querySelector(tag);
    const list = result.querySelector('.list');
    
    result.classList.remove('disable');
    list.innerHTML = '';

    if (!res) {
        result.classList.add('disable');
        return;
    }

    if (res.message) {
        result.querySelector(`.error__mesage`).textContent = res.message;
        return;
    }

    if (res.total_count == 0) {
        result.querySelector(`.error__mesage`).textContent = 'Ничего не найдено';
        return;
    }

    res.items.forEach(item => {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let language = document.createElement('p');
        if (amount < 5) {
            li.className = 'search__result-item';
            a.className = 'search__result-link';
            a.textContent = item.owner.login + ': ' + item.name.slice(0,30);
            a.href = item.html_url;

            language.className = 'search__result-language';
            language.textContent = item.language;

            li.addEventListener('click', (event) => {
                event.preventDefault();
                window.open(a.href, '_blank');
            });

            li.append(a);
            li.append(language);
            
        } else {
            li.className = 'result__item';
            a.className = 'result__link';
            a.textContent = item.full_name;
            a.href = item.html_url;

            let description = document.createElement('p');
            description.className = 'result__description';
            description.textContent = item.description;

            let topics = document.createElement('p');
            topics.className = 'result__topics';
            topics.textContent = item.topics.join(`  `);

            language.className = 'result__language';
            language.textContent = item.language;

            li.append(a);
            li.append(description);
            li.append(language);
            li.append(topics);

        }

        list.append(li);
    });

    if (amount > 5) {
        document.querySelector('.search__result').classList.add('disable');
        document.querySelector('.result__title').textContent = `Найдено ${res.total_count} репозиториев`;
        this.input.value = '';
    }


}
new App();

