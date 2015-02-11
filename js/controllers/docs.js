angular.module('JsonFormatter').controller('DocsCtrl', ['$scope', '$location', '$anchorScroll',
	function ($scope, $location, $anchorScroll) {


		$scope.initialFilters = [
			{"name": "contents"},
			{"name": "search"},
			{"name": "networks"},
			{"name": "organizations"},
			{"name": "languages"},
			{"name": "countries"}
		];

		$scope.scrollTo = function (div) {
			// set the location.hash to the id of
			// the element you wish to scroll to.
			$location.hash('api-'+div);

			// call $anchorScroll()
			$anchorScroll();
		};


}]);
