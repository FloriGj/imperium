// Hero section pc selection
function scale_and_move(element, delta_x, delta_y, scale){
    element.style.transform = `scale(${scale}) translate(${delta_x / scale}px, ${delta_y / scale}px)`;
}
function reset_element(element){
    element.style.transform = `translate(0,0)`;
}
function btn_pop_into_view(btn, index){
    btn.disabled = !btn.disabled;
    
    pop_into_view(index);
}
function pop_into_view(index){
    let pc_hero = document.getElementById('hero-right');
    let target = {x: pc_hero.getBoundingClientRect().x + (pc_hero.clientWidth/3), y: pc_hero.getBoundingClientRect().y + pc_hero.clientHeight/2.5};
    
    let pc_array = document.getElementsByClassName('carousel-item');
    //since the buttons are the parents of the above array elements, then we can traverse them using that array
    let btn_array = document.getElementsByClassName('pc_btn');
    for (let i = 0; i < pc_array.length; i++) {
        let start_position = {x: pc_array[i].getBoundingClientRect().x ,y: pc_array[i].getBoundingClientRect().y};
        let delta_x = target.x - start_position.x;
        let delta_y = target.y - start_position.y;

        if (index == i) {
            scale_and_move(pc_array[i], delta_x, delta_y, 7);
        }
        else{
            reset_element(pc_array[i]);
            //reset the buttons also
            if (btn_array[i] && btn_array[i].disabled) {
                btn_array[i].disabled = false;
            }
        }
    }
}


//carousel controller
class Carousel{
    car_wrapper;
    slides;
    index;

    button_wrapper;
    buttons;

    interval_id;
    constructor(carousel_id, buttons_id){
        this.car_wrapper = document.getElementById(carousel_id);
        this.slides = this.car_wrapper.children;
        this.index = 0;

        this.button_wrapper = document.getElementById(buttons_id);
        let lists = this.button_wrapper.children;
        this.buttons = [];
        for (let list of lists){
            this.buttons.push(list.lastChild);
        }
        this.reset_interval();
    }
    move(){
        let amount = this.slides[0].clientWidth;
        this.car_wrapper.style.transform = `translateX(-${amount * this.index}px)`;

        this.change_button_class();
        this.reset_interval();
    }
    move_to(index){
        this.index = index;
        this.move();
    }
    move_left(){
        this.index = (this.index + 1) % this.slides.length;
        this.move();
    }
    move_right(){
        if(this.index > 0) this.index = (this.index - 1) % this.slides.length;
        this.move();
    }

    change_button_class(){
        for(let i = 0; i < this.buttons.length; i++){
            if (i == this.index) {
                this.buttons[i].classList.add('expand-button');
            }
            else{
                this.buttons[i].classList.remove('expand-button');
            }
        }
    }
    reset_interval(){
        clearInterval(this.interval_id);
        this.interval_id = setInterval(()=>{
            this.move_left();
        }, 5000);
    }
}

let CAROUSEL_ONE;
//string and integer
function carousel_one(param, index){    
    if (CAROUSEL_ONE == null) {
        CAROUSEL_ONE = new Carousel('first-carousel', 'first-carousel-buttons');
    }

    if (param == 'move_to' && !isNaN(index)) {
        CAROUSEL_ONE.move_to(index);
    }
    else if(param == 'left'){
        CAROUSEL_ONE.move_left();
    }
    else if(param == 'right'){
        CAROUSEL_ONE.move_right();
    }
}

let CAROUSEL_TWO;
//string and integer
function carousel_two(param, index){
    if (CAROUSEL_TWO == null) {
        CAROUSEL_TWO = new Carousel('second-carousel', 'second-carousel-buttons');
    }

    if (param == 'move_to' && !isNaN(index)) {
        CAROUSEL_TWO.move_to(index);
    }
    else if(param == 'left'){
        CAROUSEL_TWO.move_left();
    }
    else if(param == 'right'){
        CAROUSEL_TWO.move_right();
    }
}

//checks to find the element with that id
//because of some issues with reference (i believe), the carousels are set to null
//if they are not found (anymore)
let INTERVAL_ID = setInterval(()=>{
    let el1 = document.getElementById('first-carousel');
    let el2 = document.getElementById('second-carousel');
    if(el1){
        carousel_one('nomatter', 0);
    }
    if (el2) {
        carousel_two('nomatter', 0);
    }
},1000);