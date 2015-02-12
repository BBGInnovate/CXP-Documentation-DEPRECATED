

angular.module('JsonFormatter').directive('numberMask', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$(element).numeric();
		}
	}
});

angular.module('JsonFormatter').directive('loadingAnimation', function() {
	var directive = {};

	directive.restrict = 'E'; /* restrict this directive to elements */
	directive.templateUrl = "templates/loading.html";

	return directive;
});

/*
angular.module('JsonFormatter').directive('blahdir', function() {

	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			console.log(scope.countries);
			scope.$watch(scope.countries, function() {
				console.log('test');
			});



		//	va
		//	$('.query-string').text(queryStringText);
		}
	}

});
*/
/*
// Directive for handling titles (whether it scrolls or static text)
angular.module('JsonFormatter').directive('blahdirective', function() {
	return {
		restrict: 'AE',
		replace: 'true',
		template: '<h3>Hello World!!</h3>'
	};
});

*/

