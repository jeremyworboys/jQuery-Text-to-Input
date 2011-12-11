jQuery.fn.textToInput = function(opt) {
	var all_objects = this,
	
	// Apply options over default options
		opts = jQuery.extend({
			text_tag: 'span',
			text_class: 'tti_text',
			no_value_text: 'Click here to add value...'
		}, opt);
		
	// Swap back to input when form is submitted
	jQuery(all_objects[0]).closest('form').submit(function(e) {
		jQuery(this).find('.'+opts.text_class).each(function(i,obj) {
			var inputObj = $('<input />')
				.attr(jQuery(obj).data('attrs'))
				.attr('value', jQuery(obj).text());
			jQuery(obj).replaceWith(inputObj);
		});
	});
	
	all_objects.each(function(i, obj) {
		var this_object = jQuery(this);
		
		// Change input to text
		function input2text(e, o) {
			if (typeof o == 'undefined') {
				o = this;
			}
			var textObj = jQuery('<'+opts.text_tag+'/>')
				.data('attrs', getAttributes(obj))
				.addClass(opts.text_class)
				.click(text2input)
				.text(jQuery(o).attr('value') ? jQuery(o).attr('value') : opts.no_value_text);
			if (! jQuery(o).attr('value')) {
				textObj.addClass("tti_noVal");
			}
			jQuery(o).replaceWith(textObj);
			return false;
		}
		
		// Change text to input
		function text2input(e, o) {
			if (typeof o == 'undefined') {
				o = this;
			}
			var inputObj = $('<input />');
			if (jQuery(o).hasClass("tti_noVal")) {
				inputObj.attr("placeholder", jQuery(o).text())
				        .removeClass("tti_noVal");
			} else {
				inputObj.attr('value', jQuery(o).text());
			}
			inputObj.attr(jQuery(o).data('attrs'));
			jQuery(o).replaceWith(inputObj);
			inputObj
				.focus() // Avoid bug with IE by focusing after replace
				.blur(input2text);
			return false;
		}
		
		// Returns object of all attributes of an object
		function getAttributes(o) {
			var attrs = {};
			jQuery.each(o.attributes, function(i, attr) {
				attrs[attr.name] = attr.value;
			});
			return attrs;
		}
		
		// Change to text
		input2text(null, obj);
	});
	
	// Stop click bubbling
	function stop_propagation(e) {
		e.stopPropagation();
		e.preventDefault();
		return false;
	}
	
	return all_objects;
}