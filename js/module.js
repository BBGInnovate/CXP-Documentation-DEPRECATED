angular.module('JsonFormatter', ['ngSanitize', 'jsonFormatter', 'ui.bootstrap']);

// module to handle 403 errors
angular.module('JsonFormatter').config(['$httpProvider', function ($httpProvider) {

		var interceptor = ['$location', '$rootScope', '$q', function($location, $rootScope, $q) {
			function success(response) {
				return response
			};

			// this function for unauthorized
			function error(response) {
				if(response.config.handleError && response.status === 403){
					//show error dialog
					$rootScope.badApiKey = true;
				}
			};

			return function(promise) {
				return promise.then(success, error);
			};
		}];
		$httpProvider.responseInterceptors.push(interceptor);

}]);

