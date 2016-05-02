$('.DOW-checkbox').each(function() {
<<<<<<< HEAD
	$(this).change(updateDOW)
	$(this).prop('checked', true)
=======
	$(this).change(updateDOW);
	$(this).prop('checked', true);
});

$('.location-checkbox').each(function() {
  $(this).change(function() {
    if (this.name === 'Home') filter_home = !filter_home;
    if (this.name === 'Work') filter_work = !filter_work;
    updateDynamicFilter();
  });
>>>>>>> 4e1d3379d6ffc19774f5773eb3e917c76ee7611e
});