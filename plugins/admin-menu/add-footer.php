<?php
add_action('wp_footer', array($this,'insert_my_footer'));

function insert_my_footer() {
    echo '<script> alert("Connecto ".$_POST['APIKey'] ); </script>';
}

?>