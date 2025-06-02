<?php
function display_forgot(){
    echo <<<HTML
        <div class="container">
            
            <div class="left">

            </div>
            
            <div class="right">
                <div class="form-container displace-hide animate-in" id="form-container">
                    <form method="post" id="login" onsubmit="request_Recovery(event, 'requestCode')">
                        <h2>PASSWORD RECOVERY</h2>
                        <p>A 6 digit code will be sent to your email address. If it is not there check your spam folder.</p>
                        <label for="email_forgot">Email</label>
                        
                        <input type="email" name="email" placeholder="example@gmail.com" required id="email_forgot">
                        <div class="button-container">
                            <button>Send Code</button>
                        </div>
                        <div class="link-container">
                            <a onclick="flip(event)" class="align-link-middle">already got the code?</a>
                        </div>
                    </form>

                    <form method="post" class="hide" id="register" onsubmit="request_Recovery(event, 'verifyCode')">
                        <h2>PASSWORD RECOVERY</h2>
                        <p id="message">For a new code or change of email, click on the link below verify button.</p>
                        <label for="code">Input your code here</label>
                        <input type="text" name="name" placeholder="x.x.x.x.x.x" required id="code">
                        <div class="button-container">
                            <button>Verify</button>
                        </div>
                        <div class="link-container">
                            <a onclick="flip(event)" class="align-link-middle">Input email again</a>
                        </div>
                    </form>

                </div>
            </div>

        </div>
    HTML;
}
