$('.DOW-checkbox').each(function() {
	$(this).change(updateDOW)
	$(this).prop('checked', true)

});