<?php

// Create a helper function for easy SDK access.
if ( !function_exists( 'wpvsfb_freemius' ) ) {
    function wpvsfb_freemius()
    {
        global  $wpvsfb_freemius ;
        
        if ( !isset( $wpvsfb_freemius ) ) {
            // Include Freemius SDK.
            require_once dirname( dirname( __FILE__ ) ) . '/vendor/freemius/start.php';
            $wpvsfb_freemius = fs_dynamic_init( array(
                'id'             => '2356',
                'slug'           => 'drag-and-drop-form-builder-for-contact-form-7',
                'type'           => 'plugin',
                'public_key'     => 'pk_355d1b5e35c33d2dc9972bb4c74f5',
                'is_premium'     => false,
                'premium_suffix' => 'Pro',
                'has_addons'     => false,
                'has_paid_plans' => true,
                'menu'           => array(
                'slug'       => 'wpvsfb_welcome_page',
                'first-path' => 'admin.php?page=wpvsfb_welcome_page',
                'support'    => false,
                'parent'     => array(
                'slug' => 'options-general.php',
            ),
            ),
                'is_live'        => true,
            ) );
        }
        
        return $wpvsfb_freemius;
    }

}
// Init Freemius.
wpvsfb_freemius();
// Signal that SDK was initiated.
do_action( 'wpvsfb_freemius_loaded' );