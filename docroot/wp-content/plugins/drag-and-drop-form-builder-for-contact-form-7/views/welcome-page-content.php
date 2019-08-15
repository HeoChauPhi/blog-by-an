<p><?php _e('Thank you for installing our plugin.', VG_CF7_Form_Builder_Obj()->textname); ?></p>

<?php
$steps = array();

if (!defined('WPCF7_VERSION')) {
	$install_plugin_url = VG_CF7_Form_Builder_Obj()->get_plugin_install_url('contact-form-7');

	$steps['required_plugin_cf7'] = '<p>' . sprintf(__('Please install the free plugin <b>"Contact Form 7"</b>. It´s required for forms management. <a href="%s" target="_blank" class="button install-plugin-trigger">Click here</a>', VG_CF7_Form_Builder_Obj()->textname), esc_url($install_plugin_url)) . '</p>';
}

$steps['create_form'] = '<p>' . sprintf(__('When you create a new form, you will see the new Drag and Drop Builder. <a href="%s" target="_blank" class="button">Create form</a>', VG_CF7_Form_Builder_Obj()->textname), esc_url(admin_url('admin.php?page=wpcf7-new'))) . '</p>';


$steps = apply_filters('vg_cf7_form_builder/welcome_steps', $steps);

if (!empty($steps)) {
	echo '<ol class="steps">';
	foreach ($steps as $key => $step_content) {
		?>
		<li><?php echo $step_content; ?></li>		
		<?php
	}

	echo '</ol>';
}
?>
<script>

	jQuery('.install-plugin-trigger').click(function (e) {
		return !window.open(this.href, 'Install plugin', 'width=500,height=500');
	});
</script>