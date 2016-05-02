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
	updateTOD();
	updateTimeText(selectedTimes);
  updateDynamicFilter();
})


$("input[name='violent']").prop("checked", true);
$("input[name='violent']").change(function() {
	violent = $(this).is(":checked");
})
$("input[name='non-violent']").prop("checked", true);
$("input[name='non-violent']").change(function() {
	non_violent = $(this).is(":checked");
})