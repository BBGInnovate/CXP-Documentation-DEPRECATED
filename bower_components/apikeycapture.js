$(document).on('mousedown',".btn-primary", function() {
	var errors = $('.parsley-required').length;

	if (errors === 0) {
		sessionStorage.setItem('firstName', $('#user_first_name').val());
		sessionStorage.setItem('lastName', $('#user_last_name').val());
		sessionStorage.setItem('email', $('#user_email').val());
		sessionStorage.setItem('reason', $('#user_use_description').val());
	}
});


$(document).on('click',".btn-primary", function() {
	setTimeout(function(){
		var errors = $('.parsley-required').length;



		if (errors === 0) {
			/*
			sessionStorage.setItem('firstName', $('#user_first_name').val());
			sessionStorage.setItem('lastName', $('#user_last_name').val());
			sessionStorage.setItem('email', $('#user_email').val());
			sessionStorage.setItem('reason', $('#user_use_description').val());
			*/

			// process here
			var timer;
			var counter = 0;
			(function process() {

				//console.log('waiting…');
				var deferred = $.Deferred();

				timer = setInterval(function() {
					deferred.notify();
				}, 1000);

				setTimeout(function() {
					clearInterval(timer);
					deferred.resolve();
				}, 5000);

				return deferred.promise();
			})().then(function() {
				//	console.log('done.');
				//	console.log('final answer: '  + $('.signup-key').text());
					var apiKey = $('.signup-key').text();
					postData(apiKey);
				},
				null,
				function() {
					var data = $('.signup-key').text();
					if (data && counter === 0) {
					//	console.log(data);
						counter++;
						return data;

					}

				});
		}
	}, 200);


	function postData(apiKey) {
		var firstName = sessionStorage.getItem('firstName');
		var lastName = sessionStorage.getItem('lastName');
		var email = sessionStorage.getItem('email');
		var reason = sessionStorage.getItem('reason');

		$.ajax({
			type: "POST",
			url: "http://apps.innovation-series.com/sns/cxp_signup.php",
			data: { apikey: apiKey, firstname: firstName, lastname: lastName, email: email, reason: reason },
			success: function (result) {
			//	console.log(result);
			}
		});
	}

});
