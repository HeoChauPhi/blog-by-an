<?php
/**
 * Template Name: Main - Sidebar
 *
 * @package WordPress
 * @subpackage FFW
 * @since FFW 1.0
 */

$context = Timber::get_context();
$post = new TimberPost();
$protected = post_password_required($post->ID);
$context['protected_label'] = 'pwbox-'.( empty( $post->ID ) ? rand() : $post->ID );
$context['post'] = $post;
$context['title_option'] = framework_page('title');

$context['sidebar_left'] = Timber::get_widgets('sidebar-left');

if ($protected) {
  Timber::render( 'single-protected.twig', $context );
} else {
  Timber::render( 'template-main-sidebar.twig', $context );
}
