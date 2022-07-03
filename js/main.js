const createSlider = () => {
    let count = 0;
    for (const slider of document.querySelectorAll('.slider')) {

        if (!slider) { return; }

        const wrapper = document.createElement('div');
        const ul = document.createElement('ul');
        const ol = document.createElement('ol');


        wrapper.className = 'slider__wrapper';
        ul.className = 'slider__items';
        ol.className = 'slider__indicators';
        ul.dataset.id = count;
        ol.dataset.id = count++;




        let ind = 1;

        while (slider.children.length) {
            const item = document.createElement('li');
            const li = document.createElement('li');

            item.className = 'slider__item';
            li.className = 'slider__indicator';

            if (ind == 1) {
                item.classList.add('slider__item--active');
                li.classList.add('slider__indicator--active')
            }

            item.dataset.ind = li.dataset.toInd = ind++;

            item.append(slider.children[0]);
            ul.append(item);
            ol.append(li);

            li.addEventListener('click', moveTo);
        }

        if (slider.classList.contains('slider--b')) {
            const btnWrapper = document.createElement('div');
            const btnPrev = document.createElement('button');
            const btnNext = document.createElement('button');
            btnWrapper.className = 'slider__buttons';
            btnPrev.className = 'slider__btn-prev slider__btn';
            btnNext.className = 'slider__btn-next slider__btn';
            [btnPrev, btnNext].forEach(btn => {
                btn.addEventListener('click', move);
                btnWrapper.append(btn);
            });

            slider.append(btnWrapper);
        }

        wrapper.append(ul);
        slider.append(wrapper);
        slider.append(ol);
        console.log(slider);
    }
}

const move = (e) => {
    e.preventDefault();
    const slider = e.target.parentElement.parentElement;
    const items = slider.querySelector('.slider__items');
    const direction = e.target.classList.contains('slider__btn-next') ? 1 : -1;
    const currentSlide = slider.querySelector('.slider__item--active');
    const index = parseInt(currentSlide.dataset.ind, 10);

    if (index + direction == 0 || index + direction > items.children.length) { return ;}

    const currentIndicator = slider.querySelector(`[data-to-ind="${index}"]`);
    const nextIndicator = slider.querySelector(`[data-to-ind="${index + direction}"]`);

    const nextSlide = slider.querySelector(`[data-ind="${index + direction}"]`);

    nextSlide.classList.add('slider__item--active');
    nextIndicator.classList.add('slider__indicator--active');

    currentSlide.classList.remove('slider__item--active');
    currentIndicator.classList.remove('slider__indicator--active');
    
    const h = (direction) * (-100);
    const currentX = parseInt(items.dataset.translate, 10) || 0;

    items.style.transform = `translateX(${h + currentX}%)`;
    items.dataset.translate = h + currentX;
   
}

const moveTo = (e) => {
    e.preventDefault();
    const id = e.target.parentElement.dataset.id;
    const index = parseInt(e.target.dataset.toInd, 10);
    const slider = document.querySelector(`[data-id="${id}"]`);
    
    const currentSlide = slider.querySelector('.slider__item--active');
    const currentIndex = currentSlide.dataset.ind;

    if (index == currentIndex) { return; }

    const nextIndicator = e.target;
    const currentIndicator = nextIndicator.parentElement.querySelector(`[data-to-ind="${currentIndex}"]`);
    
    const nextSlide = slider.querySelector(`[data-ind="${index}"]`);

    nextSlide.classList.add('slider__item--active');
    nextIndicator.classList.add('slider__indicator--active');

    currentSlide.classList.remove('slider__item--active');
    currentIndicator.classList.remove('slider__indicator--active');

    const h = (index - currentIndex) * (-100);
    const currentX = parseInt(slider.dataset.translate, 10) || 0;

    slider.style.transform = `translateX(${h + currentX}%)`;
    slider.dataset.translate = h + currentX;

}

const setTabs = () => {
    const tabs = document.querySelectorAll('.tabs__item');
    tabs.forEach(tab =>
        tab.addEventListener('click', (event) => {
            const blockTab = document.querySelector(event.target.dataset.link);
            document.querySelector('.tabs__block--active').classList.toggle('tabs__block--active');
            document.querySelector('.tabs__item--active').classList.toggle('tabs__item--active');
            blockTab.classList.toggle('tabs__block--active');
            tab.classList.toggle('tabs__item--active');
        })
    );
}


createSlider();
setTabs();