
<style>
	.cb-wrap.pull-right {
		width: 205px !important;
		z-index: 99999;
		left: initial !important;
		float: left !important;
		right: auto !important;
	}
	.cb-wrap.pull-left, .stage-wrap.pull-left {
		float: right;
	}
	.file-field .form-group.multiple-wrap {
		display: none;
	}
	.fld-label.form-control {
		padding: 6px 12px;
		border: 1px solid #c5c5c5;
		background-color: #fff;
		width: 95%;
	}
	.form-wrap .form-field {
		margin: 0;
		background: none;
		min-height: 38px;
	}

	.frmb {
		padding: 15px;
		background-color: white;
	}

	.frmb .field-label, .frmb .legend {
		font-size: 14px;
	}

	.button-field .btn {
		background: green;
		border: 0;
		color: white;
		border-radius: 0;
		margin-top:  10px;
	}
	.frmb .sortable-options .option-selected {
		width: 15px;
	}
	/* show fields in 2 columns preview - start */
	.form-wrap.vg-two-columns .form-field {
		width: 50%;
		float: left;
		display: block;
		clear: none;
	}

	.form-wrap.vg-two-columns .form-field.button-field {
		clear: both;
	}
	/* show fields in 2 columns preview - end */

	/* show fields in 2 columns selector - start */
	label.vg-two-columns-field {
		float: right;
	}

	.parent-formBuilder {
		clear: both;
		margin-top: 40px;
	}

	#contact-form-editor .contact-form-editor-panel fieldset legend {
		float: left;
	}
	/* show fields in 2 columns selector - end */
</style>
<h2><?php echo esc_html(__('Form builder', $this->textname)); ?></h2>
<fieldset>
	<legend><?php echo esc_html(__("Drag and drop the elements from the left column.", $this->textname)); ?></legend>
	<label class="vg-two-columns-field"><input type="checkbox" <?php checked('yes', $vg_two_columns); ?>  value="yes" name="vg_two_columns" <?php echo $is_two_columns_disabled; ?>> <?php echo esc_html(__("Show fields in two columns. ", $this->textname)) . $upgrade; ?></label>

	<?php
	$builder_settings = get_post_meta($form_id, 'vg_form_builder_fields', true);
	if (empty($builder_settings)) {
		$builder_settings = '';
	}
	?>
	<input name="vg_form_builder_fields" class="vg-form-builder-settings" type="hidden" value="<?php echo esc_attr($this->_sanitize($builder_settings)); ?>"/>
</fieldset>
<?php
