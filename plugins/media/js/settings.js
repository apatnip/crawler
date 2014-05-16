$j=jQuery.noConflict();
    function loadXMLDoc() {
         var posting = $j.post( "login.php", { uname: document.getElementById("loginuname").value, pass: document.getElementById("passwords").value} );
            posting.done(function( response) {
            if(response == "<p style='color: #ff4023'>Invalid Username or Password</p>")
            {
                document.getElementById("err").innerHTML = response;
                jQuery.post(
                    // see tip #1 for how we declare global javascript variables
                    MyAjax.ajaxurl,
                    {
                        // here we declare the parameters to send along with the request
                        // this means the following action hooks will be fired:
                        // wp_ajax_nopriv_myajax-submit and wp_ajax_myajax-submit
                        action : 'myajax-submit',                 
                        // other parameters can be added along with "action"
                        api : 'remove'
                    },
                    function( response ) {
                        alert( response );
                    }
                );
            }
            else if(response != "")
            {
                document.getElementById("message").innerHTML = "Got API Key :"+ response;
                jQuery.post(
                    // see tip #1 for how we declare global javascript variables
                    MyAjax.ajaxurl,
                    {
                        // here we declare the parameters to send along with the request
                        // this means the following action hooks will be fired:
                        // wp_ajax_nopriv_myajax-submit and wp_ajax_myajax-submit
                        action : 'myajax-submit',                 
                        // other parameters can be added along with "action"
                        api : response
                    },
                    function( response ) {
                        alert( response );
                    }
                );
                $j('#regbar').hide();
            }
            });
}

    

