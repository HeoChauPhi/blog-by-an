<?php
/**
 * Template Name: Front page
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

// Feature posts select
$feature_posts_args = array(
  'post_type' => 'any',
  'post__in' => get_field('post_slide_item'),
  'orderby' => 'post__in'
);

$post_slide = Timber::get_posts($feature_posts_args);
$context['post_slide'] = $post_slide;

$context['sidebar_left'] = Timber::get_widgets('sidebar-left');

if ($protected) {
  Timber::render( 'single-protected.twig', $context );
} else {
  Timber::render( 'template-front-page.twig', $context );
}
