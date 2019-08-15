<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /mytheme/template/pages/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /mytheme/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post = new TimberPost();
$protected = post_password_required($post->ID);
$context['protected_label'] = 'pwbox-'.( empty( $post->ID ) ? rand() : $post->ID );
$context['post'] = $post;
$context['title_option'] = framework_page('title');
$context['page_full'] = framework_page('page_full');

//print_r($post);

// Facebook Post
/*$url = 'https://graph.facebook.com/oauth/access_token?client_id=3016072685200107&client_secret=ce5b68e4d8147dd1334b61ba33a7fbc0&grant_type=client_credentials';

$data_app = file_get_contents($url);
$data_app = json_decode($data_app);

print_r($data_app);*/

// Instalgram Post
/*$access_token = "13818332153.dc74748.4be2f691a18141a18276b7dfdbf5678e";
$photo_count = 1;
$json_link = "https://api.instagram.com/v1/users/self/media/recent/?access_token={$access_token}&count={$photo_count}";
$json = file_get_contents($json_link);
$json = json_decode($json);
print_r($json);*/

if ($protected) {
  Timber::render( 'single-protected.twig', $context );
} else {
  Timber::render( array( 'page-' . $post->post_name . '.twig', 'page.twig'), $context );
}
