<?php
/**
 * @package Connecto
 * @version 1.0 Beta
 */
/*
Plugin Name: Connecto
Plugin URI: http://wordpress.org/plugins/connecto/
Description: This Plugin gives Connecto users easy interaction from
Author: Amar Sharma
Version: 1.0 Beta
Author URI: http://sarcasticprogrammer.wordpress.com
*/
define( 'CONNECTO__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
class Connecto
{
    public function __construct()
    {
        add_action('admin_menu', array($this, 'addMenuLink'));
        add_action('admin_init',array($this,'settings_res'));
        add_action( 'wp_ajax_nopriv_myajax-submit', array($this,'myajax_submit') );
        add_action( 'wp_ajax_myajax-submit', array($this,'myajax_submit') );
        add_action('wp_footer', array($this,'insert_my_footer'));    
    }

    function myajax_submit() {
        if(($key =$_POST['api'])!="remove")
        add_option( 'APkey', $key);
        else
        delete_option('APkey');
        echo "Done";
        exit;
    }

    function insert_my_footer(){
        if($x = get_option('APkey'))
        echo "<script type='text/javascript'>
    alert('Embeded script');
</script>";
    }
    function settings_res(){
        wp_register_style('settings_style',plugins_url('media/css/settings.css',__FILE__),false,'1.0.0');
        wp_register_script('settings_script', plugins_url('media/js/settings.js', __FILE__), array('jquery'), '1.0.0' );
        wp_register_script('settings_script_body', plugins_url('media/js/settings_body.js', __FILE__), array('jquery'), '1.0.0',true);
    
    }

    function connectoNotifications()
    {
        include CONNECTO__PLUGIN_DIR . 'admin-menu/notifications.php';
    }

    function connectoSettings()
    {
        include CONNECTO__PLUGIN_DIR . 'admin-menu/settings.php';
    }

    function addMenuLink()
    {

        add_menu_page(
            '',
            'Connecto',
            'manage_options',
            'settings',
            array($this, 'connectoSettings'),
            plugins_url(basename(__DIR__) . '/media/img/icon.png')
        );
        add_submenu_page(
            'settings',
            'Settings',
            'Settings',
            'manage_options',
            'settings',
            array($this, 'connectoSettings')
        );

        add_submenu_page(
            'settings',
            'Notifications',
            'Notifications',
            'manage_options',
            'notifications',
            array($this, 'connectoNotifications')
        );
    }

}
$connecto = new Connecto();
?>