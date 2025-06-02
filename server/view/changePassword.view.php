<?php

function display_change_password(){
    echo <<<HTML
        <div class="container">
            
            <div class="left">

            </div>
            
            <div class="right">
                <div class="form-container displace-hide animate-in" id="form-container">
                    <!-- send a request on submit -->
                    <form method="post" id="login" onsubmit="request_Recovery(event, 'changePassword')">
                        <h2>CHANGE PASSWORD</h2>
                        <label for="password_change">New Password</label>
                        <input type="password" name="password" required id="password_change">
                        <label for="password_again_change">Retype Password</label>
                        <input type="password" name="repeat-password" required id="password_again_change">
                        <div class="button-container">
                            <button>Change Password</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    HTML;
}