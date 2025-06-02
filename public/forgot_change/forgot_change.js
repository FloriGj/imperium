let forgot_password_errors = {
    email: null,
    displayed_email: false,
}

let new_password_errors = {
    new_password : null,
    repeat_password : null,

    displayed_new_password: false,
    displayed_repeat_password: false,
}

let code_errors = {
    code: null,

    displayed_code: false,
}

function change_forgot_errors(errors){
    clear_forgot_password_errors('email');
    if ( 'recovery_email' in errors){
        forgot_password_errors.email = errors.recovery_email;
    }
    display_errors();
}

function change_new_pass_errors(errors){
    clear_forgot_password_errors('password');
    if ('password' in errors){
        new_password_errors.new_password = errors.password;
    }
    if ('password_again' in errors){
        new_password_errors.repeat_password = errors.password_again;
    }
    display_errors();
}

function change_code_errors(errors){
    clear_forgot_password_errors('code');
    if('code' in errors){
        code_errors.code = errors.code;
    }
    display_errors();   
}

function clear_forgot_password_errors(type){
    let email_forgot = document.getElementById('email_forgot');
    let code = document.getElementById('code');
    let new_password = document.getElementById('password_change');
    let repeat_password = document.getElementById('password_again_change');

    if (type == 'email') {
        if (forgot_password_errors.displayed_email) {
            email_forgot.nextElementSibling.remove();
            forgot_password_errors.displayed_email = false;
        }    
    }
    else if (type == 'code'){
        if (code_errors.displayed_code) {
            code.nextElementSibling.remove();
            code_errors.displayed_code = false;
        }
    }
    else if(type == 'password'){
        if (new_password_errors.displayed_new_password) {
            let sibling = new_password.nextElementSibling;
            if (sibling.classList.contains('error')) sibling.remove();

            new_password_errors.displayed_new_password = false;
        }
        if (new_password_errors.displayed_repeat_password) {
            let sibling = repeat_password.nextElementSibling;
            if (sibling.classList.contains('error')) sibling.remove();

            new_password_errors.displayed_repeat_password = false;
        }
    }
}

let TIMER_INTERVAL_ID;
function start_timer(minutes){
    clearInterval(TIMER_INTERVAL_ID);

    let parent = document.getElementById('code');
    let timer = document.getElementById('password_timer');

    if (!timer && parent) {
        timer = document.createElement('span');
        timer.id = 'password_timer';
        parent.after(timer);
    }

    timer.innerHTML = minutes + ":00";

    TIMER_INTERVAL_ID = setInterval( ()=>{
        let array = timer.innerHTML.split(':');
        let minutes = parseInt(array[0]);
        let seconds = parseInt(array[1]);
        seconds --;
        if (seconds < 0) {
            if (minutes > 0) {
                minutes --;
            }
            else{
                clearInterval(TIMER_INTERVAL_ID);
            }
            seconds = 59;
        }
        timer.innerHTML = minutes + ':'+seconds;
    }, 1000);
}

function start_loading(){
    let sibling = document.getElementById('email_forgot');
    if(sibling){
        let div = document.createElement('div');
        div.className = 'loader';
        sibling.after(div);
    }
}
function stop_loading(){
    let loader = document.getElementById('loader');
    if (loader) {
        loader.remove();
    }
}

async function request_Recovery(event, type) {
    event.preventDefault();

    if (type == 'requestCode') {
        let forgottenEmail = document.getElementById('email_forgot').value.trim();
        await code_request(forgottenEmail);
    } else if (type == "verifyCode") {
        let code = document.getElementById('code').value.trim();
        await code_verify(code);
    } else if (type == "changePassword") {
        let newPass = document.getElementById('password_change').value.trim();
        let confirmPass = document.getElementById('password_again_change').value.trim();
        await change_password(newPass, confirmPass);
    }
}

async function code_request(email){
    let data = {
        'email': email
    }

    //TODO : MAKE A LOADING THING
    start_loading()
    const json = await send_request(data, 'requestCode', '../server/control/requestCode.control.php');
    stop_loading()

    if (!json) {
        alert("Database did not return a valid response");
        return;
    }

    if ('success' in(json)) {
        flip();
        start_timer(5);
        forgot_password_errors.email = null;
    } else{
        change_forgot_errors(json);
    }
}

async function code_verify(code){
    let data = {
        'code': code
    }

    const json = await send_request(data, 'verifyCode', '../server/control/verifyCode.control.php');
    if (!json) {
        alert("Database did not return a valid response");
        return;
    }

    if ('success' in(json)) {
        code_errors.code = null;
        goTo('change-password');
    } else{
        change_code_errors(json);
    }
}

async function change_password(newPass, confirmPass){
    let data = {
        'newPass': newPass,
        'confirmPass': confirmPass
    }

    const json = await send_request(data, 'changePassword', '../server/control/changePassword.control.php');

    if ('success' in(json)) {
        new_password_errors.new_password = null;
        new_password_errors.repeat_password = null;
        create_notification(json['success']);
        goTo('/imperium/public/profile');
    } else {
        change_new_pass_errors(json);
    }
}