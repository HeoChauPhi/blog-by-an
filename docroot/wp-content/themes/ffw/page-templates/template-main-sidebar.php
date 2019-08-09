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
$context['posts'] = $post;

$context['sidebar_left'] = Timber::get_widgets('sidebar-left');

Timber::render( 'template-main-sidebar.twig', $context );
