<!DOCTYPE html>
<html>

<head>

    <meta charset="UTF-8">

    <title>Connecto Login</title>

    <style>
        * {
            margin: 0;
            padding: 0;
        }

        #regbar {
            height: 67px;
            background: #34495e;
        }

        #navthing {
            margin-left: 50px;
        }

        h2 {
            padding: 20px;
            color: #ecf0f1;
        }

        fieldset {
            border: none;
        }

        .login {
            position: relative;
            width: 350px;
            display: none;
        }

        .register {
            position: relative;
            width: 350px;
            display: none;
        }

        .arrow-up {
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-bottom: 15px solid #ffffff;
            left: 7%;
            position: absolute;
            top: -10px;
        }

        .regarrow-up {
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-bottom: 15px solid #ffffff;
            left: 28%;
            position: absolute;
            top: -10px;
        }

        .formholder {
            background: none repeat scroll 0 0 #ffffff;
            border-radius: 25px;
            padding-top: 15px;
            width: 450px;
        }

        .formholder input[type="email"], .formholder input[type="password"], .formholder input[type="text"] {
            padding: 7px 5px;
            margin: 10px 0;
            width: 100%;
            display: block;
            font-size: 18px;
            border-radius: 5px;
            border: none;
            -webkit-transition: 0.3s linear;
            -moz-transition: 0.3s linear;
            -o-transition: 0.3s linear;
            transition: 0.3s linear;
        }

        .formholder input[type="email"]:focus, .formholder input[type="password"]:focus, .formholder input[type="text"]:focus {
            outline: none;
            box-shadow: 0 0 1px 1px #1abc9c;
        }

        .formholder input[type="submit"] {
            background: #1abc9c;
            padding: 10px;
            font-size: 20px;
            display: block;
            width: 100%;
            border: none;
            color: #fff;
            border-radius: 5px;
        }

        .formholder input[type="submit"]:hover {
            background: #a2a2a2;
        }

        .randompad {
            padding: 10px;
        }

        a {
            color: #ecf0f1;
            outline: none;
            text-decoration: none;
        }

        a:focus {
            color: #000000;
            outline: none;
        }

        a:hover {
            color: #a5a5a5;
            outline: none;
        }


    </style>

    <script>
        function loadXMLDoc() {
            var xmlhttp;
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {// code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                var response = xmlhttp.responseText;
                if(response == "<p style='color: #ff4023'>Invalid Username or Password</p>")
                {
                    document.getElementById("err").innerHTML = response;
                }
                else if(response != "")
                {
                    document.getElementById("message").innerHTML = "Got API Key :"+ response;
                    $('#regbar').hide();
                }
            }
            xmlhttp.open("POST", "login.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send("uname=" + document.getElementById("loginuname").value + "&pass=" + document.getElementById("passwords").value);
        }
    </script>

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


<script src='http://codepen.io/assets/libs/fullpage/jquery.js'></script>

<script>
    $('input[type="submit"]').mousedown(function () {
        $(this).css('background', '#a5a5a5');
    });
    $('input[type="submit"]').mouseup(function () {
        $(this).css('background', '#a5a5a5');
    });
    $('#registration').click(function () {
        $('.register').fadeToggle('slow');
    });
    $('#loginform').click(function () {
        $('.login').fadeToggle('slow');
    });
    $(document).mouseup(function (e) {
        var container = $(".login");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
            //  $('#loginform').removeClass('green');
        }
        container = $(".register");
        if (!container.is(e.target) // if the target of the click isn't the container...
            && container.has(e.target).length === 0) // ... nor a descendant of the container
        {
            container.hide();
            // $('#loginform').removeClass('green');
        }
    });
</script>

</body>

</html>
