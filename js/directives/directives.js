

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

