$('.DOW-checkbox').each(function() {
	$(this).change(updateDOW)
	$(this).prop('checked', true)
});

$('.location-checkbox').each(function() {
  $(this).change(function() {
    if (this.name === 'Home') filter_home = !filter_home;
    if (this.name === 'Work') filter_work = !filter_work;
    updateDynamicFilter();
  });
});

$("input[name='time']").change(function() {
	include = (this.value == "include");
	console.log(include);
	updateTOD();
})