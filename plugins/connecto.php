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

class Connecto
{
    public function __construct()
    {
        add_action('admin_menu', array($this, 'addMenuLink'));
    }

    function connectoNotifications()
    {
        $dir = plugin_dir_path(__FILE__);
        include $dir . 'admin-menu/notifications.php';
    }

    function connectoSettings()
    {
        // Set class property
        $dir = plugin_dir_path(__FILE__);
        include $dir . 'admin-menu/settings.php';
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
