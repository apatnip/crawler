<?php
wp_enqueue_style('settings_style');
wp_enqueue_script('settings_script');
wp_enqueue_script('settings_script_body');
wp_localize_script( 'settings_script', 'MyAjax', array(
    // URL to wp-admin/admin-ajax.php to process the request
    'ajaxurl'          => admin_url( 'admin-ajax.php' ), 
    // generate a nonce with a unique ID "myajax-post-comment-nonce"
    // so that you can check it later when an AJAX request is sent
    'postCommentNonce' => wp_create_nonce('myajax-post-comment-nonce' ),
    )
);
?>

<!DOCTYPE html>
<html>

<head>

    <meta charset="UTF-8">

    <title>Connecto Login</title>

</head>

<body>

    <h1 id="message" style="color: #354a5f">
        Welcome to Connecto
    </h1>

    <div id="regbar">
        <div id="navthing">
            <h2><a href="#" id="loginform">Login</a> | <a href="#" id="registration">Register</a></h2>
            <div class="login">
                <div class="arrow-up"></div>
                <div class="formholder">
                    <fieldset class="randompad">
                        <label name="email">Username</label>
                        <input id="loginuname" name="username" type="text" value="username"/>
                        <label name="password">Password</label>
                        <input id="passwords" name="password" type="password" value="password"/>
                        <input type="submit" onclick="loadXMLDoc()" value="Login"/>
                        <label id="err"></label>
                    </fieldset>
                </div>
            </div>
            <div class="register">
                <div class="regarrow-up"></div>
                <div class="formholder">
                    <fieldset class="randompad">
                        <label name="email">E-mail</label>
                        <input name="email" type="email" value="abc@example.com"/>
                        <label name="email">Username</label>
                        <input name="username" type="text" value="username"/>
                        <label name="password">Password</label>
                        <input name="password" type="password" value="password"/>
                        <input type="submit" value="Register"/>
                    </fieldset>
                </div>
            </div>

        </div>
    </div>
   <?php
   if($key = get_option('APkey'))
       echo '<script> document.getElementById("message").innerHTML=" Your API Key : '.$key.'"; $j=jQuery.noConflict(); $j("#regbar").hide(); </script>';
        delete_option('APkey');
   ?> 
</body>

</html>
