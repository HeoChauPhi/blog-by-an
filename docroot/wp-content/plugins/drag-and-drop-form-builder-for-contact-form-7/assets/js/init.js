//funcion para sacar data de formBuilder y generar HTML del JSON
function dataFormBuilder(selectorId, formBuilder) {
	$ = jQuery;
	var dataEnviar = formBuilder.actions.getData('json', true);

	var escapeEl = document.createElement('textarea'),
			code = document.getElementById(selectorId), //usando textarea
			escapeHTML = function (html) {
				escapeEl.textContent = html;
				return escapeEl.innerHTML;
			},
			formData = dataEnviar, // Enviando data recibida
			addLineBreaks = function (html) {
				return html.replace(new RegExp('&gt; &lt;', 'g'), '&gt;\n&lt;').replace(new RegExp('&gt;&lt;', 'g'), '&gt;\n&lt;');
			};

	// Grab markup and escape it
	var $markup = $('<div/>');
	$markup.formRender({formData});

	// set < code > innerHTML with escaped markup
	code.innerHTML = addLineBreaks(escapeHTML($markup[0].innerHTML));
}

//Function que nos sirve para generar shortcode para input y textarea
function inputData(reemplazo, shortcode) {

	if (!reemplazo.length) {
		return true;
	}

	//Extrayendo data de label y eliminandolo tambien
	var contentLabel = reemplazo.prev();
	var textLabel = jQuery(contentLabel[0]).text();
	contentLabel.remove();
	var name = reemplazo[0].name;
	var placeholder = reemplazo[0].placeholder;

	if (placeholder != "") {
		placeholder = 'placeholder ' + '"' + placeholder + '"';
	}

	//Required
	var required = reemplazo[0].required;
	var astedisco = "";
	if (required == true) {
		astedisco = "*";
	}
	//Class name
	var clases = "";
	var $hijosClass = $(reemplazo[0].classList);
	$hijosClass.each(function (index, value) {
		clases = clases + "class:" + value + " ";
	});

	//Name value
	if (name === "name") {
		name = "text-" + name;
	}

	//value
	var value = reemplazo[0].value;

	if (value != "") {
		value = ' ' + '"' + value + '"';
	}

	var $label = "<p class='cf7-field-wrapper'><label>" + textLabel + " [" + shortcode + astedisco + " " + name + " " + clases + placeholder + value + "]</label></p>";

	reemplazo.after($label);
	reemplazo.remove();
}

//Funcion que nos sirve para imprimir el HTML de la variable donde lo tenemos guardado
function imprimiendoHTML(contentHTML) {
	//Imprimiendo el $form en el textarea
	var formHTML = "";
	var $hijosHTML = $(contentHTML.children());
	$hijosHTML.each(function (index, value) {
		var nuevo = value.outerHTML;
		formHTML = formHTML + nuevo + "\n";
	});
	return formHTML;
}


jQuery(document).ready(function ($) {

	jQuery('#form-panel').prepend(vgcf7b_form_builder_settings.dontUseOldEditorWarning);


	var $divActivo = $("#vg-form-builder-panel").find("input.vg-form-builder-settings"); //Selector donde ira el plugin

//Agregando Boton y caja donde ira el plugin
	var $divNuevo = $("<div></div>").addClass('parent-formBuilder');
	var $boxForm = $("<div><div>").addClass("box-form");

	$divNuevo.prepend($boxForm);


//Compronbando que inputHidden tenga JSON
	var formBuilder;
	$("#vg-form-builder-panel-tab #ui-id-1").trigger("click");


	//Inicializando plugin
	formBuilderData = $boxForm.formBuilder(vgcf7b_form_builder_settings);

	setTimeout(function () {
		//Reordenando elementos
		$(".icon-textarea").prependTo('.frmb-control');
		$(".icon-text").prependTo('.frmb-control');
		$(".icon-select").prependTo('.frmb-control');
		$(".icon-radio-group").prependTo('.frmb-control');
		$(".icon-button").prependTo('.frmb-control');

		//Nuevos estilos
		$(".frmb-control li:last-child").css({"border-radius": "0px"});

		//Agregando clases a elementos que vamos a desactivar
		var optionsDisable = [];
		for (var i = 1; i < vgcf7b_form_builder_settings.disableFields.length; i++) {
			optionsDisable[i] = vgcf7b_form_builder_settings.disableFields[i].charAt(0).toUpperCase() + vgcf7b_form_builder_settings.disableFields[i].substr(1);
		}
		var $containerDivs = $("<div class='container-disable'></div>");

		for (var itemField in optionsDisable) {

			var $divNewField = $("<div class='disable icon-" + vgcf7b_form_builder_settings.disableFields[itemField] + "'><div>");

			var nuevoCSS = {"background": '#f9f8f8', "padding": '10px', "border-radius": "0px", "border": "0.5px solid #c5c5c5", "margin": "0px 0 -1px", "text-align": "left"};
			$divNewField.css(nuevoCSS);
			var $action = $("<span class='item-disable'>" + optionsDisable [itemField] + "<span> " + vgcf7b_form_builder_settings.upgradeLink);
			$action.prependTo($divNewField);
			$containerDivs.append($divNewField);
		}
		$(".frmb-control").after($containerDivs);
		$(".container-disable div:last-child").css({"border-radius": "0 0 5px 5px"});
		$(".item-disable").css({"margin-left": "10px"});
	}, 2000);






	//Sacando string de input de plugin contactForm7 para ver comprobar si se a creado con formBuilder o no
	var inputPlugin = $('#wpcf7-form').val().toUpperCase();
	var buscandoInput = inputPlugin.search("<INPUT");
	var buscandoSelect = inputPlugin.search("<SELECT");
	var buscandoTextarea = inputPlugin.search("<TEXTAREA");
	var buscandoButton = inputPlugin.search("<BUTTON");
	console.log(inputPlugin);
	console.log(buscandoInput);

	//Comprobando si se ha creado con html el form
	if (buscandoInput >= 0 || buscandoSelect >= 0 || buscandoTextarea >= 0 || buscandoButton >= 0) {
		$("#form-panel-tab #ui-id-2").trigger("click");
	} else {
		$("#vg-form-builder-panel-tab #ui-id-1").trigger("click");
	}


	$divActivo.before($divNuevo);

	jQuery('input[name="vg_two_columns"]').change(function (e) {
		if (jQuery(this).is(':checked')) {
			jQuery('.form-wrap.form-builder').addClass('vg-two-columns');
		} else {
			jQuery('.form-wrap.form-builder').removeClass('vg-two-columns');
		}
	});
	setTimeout( function(){		
	jQuery('input[name="vg_two_columns"]').trigger('change');
	}, 400);

//Agrengando funcionalidad al boton de formBuilder 
	jQuery("#wpcf7-admin-form-element .button-primary").click(function (event) {
		event.preventDefault();

		//Llamando a funcion que nos genera HTML
		dataFormBuilder('wpcf7-form', formBuilderData);

		//LLamando a funcion que nos genera JSON
		var dataJson = formBuilderData.actions.getData('json');
		$("#vg-form-builder-panel .vg-form-builder-settings").val(dataJson);

//Agregando shorcodes de plugin

		var resultadoForm = jQuery("#wpcf7-form").val();
		var $form = jQuery(resultadoForm);


//Controladores:         
		var $campoInputText = $form.find('input[type="text"]');
		var $campoTextarea = $form.find('textarea');
		var $campoButton = $form.find('button');
		var $campoDate = $form.find('input[type="date"]');
		var $campoFile = $form.find('input[type="file"]');
		var $campoInputNumber = $form.find('input[type="number"]');
		var $campoSelect = $form.find("select");
		var $campoRadio = $form.find("div.radio-group");
		var $campoCheckbox = $form.find('div.checkbox-group');



//Codigo de campoCheccbox
		$campoCheckbox.each(function (index) {
			if ($campoCheckbox[index].tagName == 'DIV') {
				var reemplazo = $form.find('div.checkbox-group').first();
				var informacion = reemplazo.find('input[type="checkbox"]').first();
				var checkboxs = reemplazo.find('input[type="checkbox"]');
				var labelValor = reemplazo.prev();
				var textLabel = labelValor[0].innerText;

				//Extrayendo data de label y eliminandolo tambien
				var contentLabel;

				var name = informacion[0].name;
				var buscandoBrackets = name.indexOf("[]");
				var cortar = name.slice(-2);
				var nuevoName = name;

				//Required
				var required = informacion[0].required;
				var astedisco = "";
				if (required == true) {
					astedisco = "*";
				}

				if (cortar == "[]") {
					nuevoName = name.slice(0, buscandoBrackets);
				}

				//Bucle para sacar hijos de check  
				var resultado = '';
				checkboxs.each(function (index, value) {
					var checkHijo = $(value);
					resultado = resultado + '"' + checkHijo[0].value + '" ';
				});

				//Class name
				var clases = "";
				var $hijosClass = $(informacion[0].classList);
				$hijosClass.each(function (index, value) {
					clases = clases + "class:" + value + " ";
				});

				var $label = "<p class='cf7-field-wrapper'>" + textLabel + "[checkbox " + astedisco + nuevoName + " " + clases + resultado + "]</p>";

				//[checkbox checkbox-276 "opcion-1" "opcion-2" "opcion-3"] 

				reemplazo.after($label);
				reemplazo.remove();
				labelValor.remove();
			}
		});

//Codigo de campo radio        
		$campoRadio.each(function (index) {
			if ($campoRadio[index].tagName == 'DIV') {
				var reemplazo = $form.find('div.radio-group').first();

				//Extrayendo data de label y eliminandolo tambien
				var contentLabel = reemplazo.prev();
				var textLabel = contentLabel[0].textContent;
				contentLabel.remove();

				var objetosRadio = reemplazo.find('label');

				// var name = objetosRadio[0].name; sacar nombre de input type
				var name = reemplazo.find('input[type="radio"]')[0].name;

				var resultado = "";

				//Obteniendo los valores para el input.radio
				objetosRadio.each(function (index) {
					var valorRadio = objetosRadio[index].outerText.trim();
					resultado = resultado + '"' + valorRadio + '" ';
				});


				//Class name
				var clases = "";
				var $hijosClass = $(reemplazo.find('input[type="radio"]')[0].classList);
				$hijosClass.each(function (index, value) {
					clases = clases + "class:" + value + " ";
				});


				//Required
				var required = reemplazo[0].required;
				var astedisco = "";
				if (required == true) {
					astedisco = "*";
				}

				var $label = "<p class='cf7-field-wrapper'>" + textLabel + "[radio " + astedisco + name + " " + clases + "default:1 " + resultado + "]</p>";

				reemplazo.after($label);
				reemplazo.remove();
			}
		});



		//Codigo para input text
		$campoInputText.each(function (index) {
			if ($campoInputText[index].tagName == 'INPUT') {
				var reemplazo = $form.find('input[type="text"]').first();
				inputData(reemplazo, "text");
			}
		});

//Codigo para textarea        
		$campoTextarea.each(function (index) {
			if ($campoTextarea[index].tagName == 'TEXTAREA') {
				// var label = $("<label>[textarea]</label>");
				var reemplazo = $form.find("textarea").first();
				inputData(reemplazo, "textarea");
			}
		});

//Codigo para botones    
		$campoButton.each(function (index) {
			if ($campoButton[index].tagName == 'BUTTON') {
				var reemplazo = $form.find("button").first();

				var name = reemplazo[0].innerText;

				//Class name utilizar ClassList y generar loop para sacar clases
				var clases = "";
				var $hijosClass = $(reemplazo[0].classList);
				$hijosClass.each(function (index, value) {
					clases = clases + "class:" + value + " ";
				});

				var $label = "<p class='cf7-field-wrapper cf7-button-field'>[submit " + clases + '"' + name + '"]</p>';

				reemplazo.after($label);
				reemplazo.remove();
			}
		});

//Codigo para DATE
		$campoDate.each(function (index) {
			//[date* fecha class:fechas placeholder "04/08/95"]
			if ($campoDate[index].tagName == 'INPUT') {
				var reemplazo = $form.find('input[type="date"]').first();
				inputData(reemplazo, "date");
			}
		});


//Codigo para FILE
		$campoFile.each(function (index) {
			//[date* fecha class:fechas placeholder "04/08/95"]
			if ($campoFile[index].tagName == 'INPUT') {
				var reemplazo = $form.find('input[type="file"]').first();
				inputData(reemplazo, "file")
			}
		});

//Input number
		$campoInputNumber.each(function (index) {
			if ($campoInputNumber[index].tagName == 'INPUT') {
				var reemplazo = $form.find('input[type="number"]').first();

				//Extrayendo data de label y eliminandolo tambien
				var contentLabel = reemplazo.prev();
				var textLabel = contentLabel[0].textContent;
				contentLabel.remove();
				var name = reemplazo[0].name;
				var min = reemplazo[0].min;
				var max = reemplazo[0].max;
				var placeholder = reemplazo[0].placeholder;

				if (placeholder != "") {
					placeholder = 'placeholder ' + '"' + placeholder + '"';
				}
				//Required
				var required = reemplazo[0].required;
				var astedisco = "";
				if (required == true) {
					astedisco = "*";
				}
				//Class name
				var clases = "";
				var $hijosClass = $(reemplazo[0].classList);
				$hijosClass.each(function (index, value) {
					clases = clases + " class:" + value + " ";
				});

				//value
				var value = reemplazo[0].value;

				if (value != "") {
					value = ' ' + '"' + value + '"';
				}

				var $label = "<p class='cf7-field-wrapper'><label>" + textLabel + " " + "[number " + astedisco + " " + name + clases + " min:" + min + " max:" + max + " " + placeholder + " " + value + "]</label></p>";

				//campos[index] = div;
				reemplazo.after($label);
				reemplazo.remove();
			}
		});

//Loop para select 
		$campoSelect.each(function (index) {
			if ($campoSelect[index].tagName == 'SELECT') {
				var reemplazo = $form.find('select').first();


				var contentLabel = reemplazo.prev();
				var textLabel = contentLabel[0].textContent;
				contentLabel.remove();
				var name = reemplazo[0].name;
				var buscandoBrackets = name.indexOf("[]");
				var cortar = name.slice(-2);
				var nuevoName = name;

				if (cortar == "[]") {
					nuevoName = name.slice(0, buscandoBrackets);
				}

				//Sacando Option e imprimiendolos
				var option = '';
				var $selectHijos = $(reemplazo[0].children);
				$selectHijos.each(function (index, value) {
					var hijoSelect = $(value);
					option = option + '"' + hijoSelect[0].innerText + '" ';
				});

				//Class name: Sacando las clases de los elementos
				var clases = "";
				var $hijosClass = $(reemplazo[0].classList);
				$hijosClass.each(function (index, value) {
					clases = clases + "class:" + value + " ";
				});


				//Required
				var required = reemplazo[0].required;
				var astedisco = "";
				if (required == true) {
					astedisco = "*";
				}

				//Multiple
				var multiple = reemplazo[0].multiple;
				var valorMultiple = "";

				if (multiple == true) {
					valorMultiple = " multiple ";
				}
				var $label = "<p class='cf7-field-wrapper'><label>" + textLabel + " [select" + astedisco + " " + nuevoName + valorMultiple + " " + clases + option + "]</label></p>";

				reemplazo.after($label);
				reemplazo.remove();
			}
		});



		var formHTML = imprimiendoHTML($form).replace('<header', '<h3').replace('</header', '</h3');

		if (jQuery('input[name="vg_two_columns"]:checked').length) {
			formHTML += '<style>	.wpcf7 .cf7-field-wrapper { padding: 0 10px;		width: 50%;		float: left;		display: block;		clear: none;	}	.wpcf7 .cf7-field-wrapper.cf7-button-field {		clear: both;	}</style>';
		}

		jQuery("#wpcf7-form").val(formHTML);

		//Enviando formulario nos sirve para guardar los datos   
		$("#wpcf7-admin-form-element").submit();


	});//fin de click boton

});//Fin de Jquery

