<?php

/*
  Plugin Name: Drag and Drop Form Builder for Contact Form 7
  Plugin URI: http://vegacorp.me
  Description: Create forms using a live, drag and drop Form builder.
  Version: 1.1.1
  Author: JoseVega
  Author Email: josevega@vegacorp.me
  License:
 Copyright 2011 JoseVega (josevega@vegacorp.me)
 This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as
  published by the Free Software Foundation.
 This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
require 'vendor/vg-plugin-sdk/index.php';
require 'inc/freemius.php';
/**
 * Load CSS
 */
if ( !class_exists( 'VG_CF7_Form_Builder' ) ) {
    class VG_CF7_Form_Builder
    {
        private static  $instance = false ;
        var  $textname = 'vg_cf7_form_builder' ;
        static  $dir = __DIR__ ;
        var  $version = '1.1.1' ;
        var  $buy_url = null ;
        private function __construct()
        {
        }
        
        function init()
        {
            $this->buy_url = wpvsfb_freemius()->get_upgrade_url();
            $this->args = array(
                'main_plugin_file'  => __FILE__,
                'show_welcome_page' => true,
                'welcome_page_file' => VG_CF7_Form_Builder::$dir . '/views/welcome-page-content.php',
                'logo'              => plugins_url( '/assets/imgs/logo.png', __FILE__ ),
                'plugin_name'       => 'CF7 Form Builder',
                'plugin_prefix'     => 'wpvsfb_',
                'plugin_version'    => $this->version,
                'plugin_options'    => get_option( $this->textname, false ),
            );
            $this->vg_plugin_sdk = new VG_Freemium_Plugin_SDK( $this->args );
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ), 10 );
            add_action( 'wpcf7_after_save', array( $this, 'after_cf7_save' ) );
            add_filter( 'wpcf7_editor_panels', array( $this, 'add_form_builder_panel' ) );
            add_action( 'admin_menu', array( $this, 'register_menu_page' ) );
        }
        
        function register_menu_page()
        {
            add_options_page(
                $this->args['plugin_name'],
                $this->args['plugin_name'],
                'manage_options',
                $this->args['plugin_prefix'] . 'welcome_page',
                array( $this->vg_plugin_sdk, 'render_welcome_page' )
            );
        }
        
        /**
         * Array map for a multimensional array
         * @param str $f
         * @param array $xs
         * @return array
         */
        function _array_map_recursive(
            $f,
            $xs,
            $keys = 'all',
            $args = array()
        )
        {
            $out = array();
            
            if ( is_array( $xs ) ) {
                foreach ( $xs as $k => $x ) {
                    if ( !empty($keys) && is_array( $keys ) ) {
                        
                        if ( !is_array( $x ) && !in_array( $k, $keys ) || is_int( $k ) && !is_array( $x ) ) {
                            $out[$k] = $x;
                            continue;
                        }
                    
                    }
                    
                    if ( is_array( $x ) ) {
                        $out[$k] = $this->_array_map_recursive( $f, $x, $keys );
                    } elseif ( is_string( $x ) ) {
                        $out[$k] = call_user_func_array( $f, array_merge( array( $x ), $args ) );
                    } else {
                        $out[$k] = $x;
                    }
                
                }
            } else {
                $out = $xs;
            }
            
            return $out;
        }
        
        function _sanitize( $var )
        {
            
            if ( is_array( $var ) ) {
                $var = $this->_array_map_recursive( 'wp_strip_all_tags', $var );
            } elseif ( is_string( $var ) ) {
                $var = wp_strip_all_tags( $var );
            }
            
            return $var;
        }
        
        function after_cf7_save( $form )
        {
            if ( !isset( $_REQUEST['vg_form_builder_fields'] ) ) {
                $_REQUEST['vg_form_builder_fields'] = '';
            }
            update_post_meta( $form->id, 'vg_form_builder_fields', $this->_sanitize( $_REQUEST['vg_form_builder_fields'] ) );
            $vg_two_columns = ( !isset( $_REQUEST['vg_two_columns'] ) || $_REQUEST['vg_two_columns'] !== 'yes' ? '' : 'yes' );
            update_post_meta( $form->id, 'vg_two_columns', $this->_sanitize( $vg_two_columns ) );
        }
        
        /**
         * Creates or returns an instance of this class.
         *
         * @return  Foo A single instance of this class.
         */
        static function get_instance()
        {
            
            if ( null == VG_CF7_Form_Builder::$instance ) {
                VG_CF7_Form_Builder::$instance = new VG_CF7_Form_Builder();
                VG_CF7_Form_Builder::$instance->init();
            }
            
            return VG_CF7_Form_Builder::$instance;
        }
        
        function __set( $name, $value )
        {
            $this->{$name} = $value;
        }
        
        function __get( $name )
        {
            return $this->{$name};
        }
        
        function enqueue_assets( $hook )
        {
            if ( !in_array( $hook, array( 'contact_page_wpcf7-new', 'toplevel_page_wpcf7' ) ) ) {
                return;
            }
            wp_enqueue_script(
                'wp-cf7-builder-formBuilder',
                plugins_url( '/assets/vendor/form-builder/form-builder.min.js', __FILE__ ),
                array( 'jquery', 'jquery-ui-core', 'jquery-ui-sortable' ),
                '1.0',
                true
            );
            wp_enqueue_script(
                'wp-cf7-builder-formRender',
                plugins_url( '/assets/vendor/form-builder/form-render.min.js', __FILE__ ),
                array( 'jquery' ),
                '1.0',
                true
            );
            wp_enqueue_script(
                'wp-cf7-builder-init',
                plugins_url( '/assets/js/init.js', __FILE__ ),
                array( 'jquery' ),
                '1.0',
                true
            );
            $form_id = ( isset( $_GET['post'] ) ? (int) $_GET['post'] : null );
            $is_new_form = empty($form_id);
            if ( $form_id ) {
                $form_fields = json_decode( get_post_meta( $form_id, 'vg_form_builder_fields', true ), true );
            }
            if ( empty($form_fields) ) {
                $form_fields = array(
                    array(
                    'label'       => "Name",
                    'placeholder' => "Your name",
                    'name'        => "first-name",
                    'type'        => "text",
                ),
                    array(
                    'label'       => "Email",
                    'placeholder' => "Your email",
                    'name'        => "email",
                    'type'        => "text",
                ),
                    array(
                    'label'       => "Message",
                    'placeholder' => "Your message",
                    'name'        => "message",
                    'type'        => "textarea",
                ),
                    array(
                    'label'   => "Button",
                    'type'    => "button",
                    'subtype' => "submit",
                    'name'    => "button",
                )
                );
            }
            $disabled_fields = array( 'autocomplete' );
            if ( wpvsfb_freemius()->is_not_paying() ) {
                $disabled_fields = array(
                    'autocomplete',
                    'hidden',
                    'date',
                    'file',
                    'paragraph',
                    'number',
                    'checkbox-group',
                    'header'
                );
            }
            $form_builder_settings = apply_filters( 'vgcf7b_form_builder_settings', array(
                'dontUseOldEditorWarning' => __( '<div class="error">Note. You shouldn´t use this tab when using the form builder because it will get overwritten. This tab is available for old forms that were created without the form builder.</div>', $this->textname ),
                'upgradeLink'             => '<a class="disable" href="' . $this->buy_url . '" target="_blank">Premium</a>',
                'isNewForm'               => $is_new_form,
                'defaultFields'           => $form_fields,
                'disabledActionButtons'   => array( 'data', 'save' ),
                'disabledAttrs'           => array(
                'access',
                'description',
                'maxlength',
                'subtype',
                'style',
                'inline',
                'toggle',
                'other'
            ),
                'disableFields'           => $this->_sanitize( $disabled_fields ),
            ) );
            wp_localize_script( 'wp-cf7-builder-init', 'vgcf7b_form_builder_settings', $form_builder_settings );
        }
        
        function render_form_builder_panel( $form )
        {
            $form_id = $form->id;
            $vg_two_columns = get_post_meta( $form_id, 'vg_two_columns', true );
            $is_two_columns_disabled = ' disabled ';
            $upgrade = '<a class="disable" href="' . $this->buy_url . '" target="_blank">Premium</a>';
            include __DIR__ . '/views/metabox.php';
        }
        
        function add_form_builder_panel( $panels )
        {
            $new_panels = array();
            $new_panels['vg-form-builder-panel'] = array(
                'title'    => __( 'Form builder', $this->textname ),
                'callback' => array( $this, 'render_form_builder_panel' ),
            );
            return array_merge( $new_panels, $panels );
        }
        
        function get_plugin_install_url( $plugin_slug )
        {
            $install_plugin_base_url = ( is_multisite() ? network_admin_url() : admin_url() );
            $install_plugin_url = add_query_arg( array(
                's'    => $plugin_slug,
                'tab'  => 'search',
                'type' => 'term',
            ), $install_plugin_base_url . 'plugin-install.php' );
            return $install_plugin_url;
        }
    
    }
}
if ( !function_exists( 'VG_CF7_Form_Builder_Obj' ) ) {
    function VG_CF7_Form_Builder_Obj()
    {
        return VG_CF7_Form_Builder::get_instance();
    }

}
VG_CF7_Form_Builder_Obj();