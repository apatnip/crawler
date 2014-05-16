$j=jQuery.noConflict();
    function loadXMLDoc() {
         var posting = $j.post( "login.php", { uname: document.getElementById("loginuname").value, pass: document.getElementById("passwords").value} );
            posting.done(function( response) {
            if(response == "<p style='color: #ff4023'>Invalid Username or Password</p>")
            {
                document.getElementById("err").innerHTML = response;
            }
            else if(response != "")
            {
                document.getElementById("message").innerHTML = "Got API Key :"+ response;
                $j('#regbar').hide();
            }
            });
}

    

