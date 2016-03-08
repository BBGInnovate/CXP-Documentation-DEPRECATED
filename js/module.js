angular.module('JsonFormatter', ['ngSanitize', 'jsonFormatter', 'ui.bootstrap', 'ngRoute', 'ngLoadScript']);

// route state
angular.module('JsonFormatter').config(['$routeProvider', function($routeProvider) {

	$routeProvider.
		when('/api', {
			templateUrl: 'templates/api.html',
			controller: 'ApiCtrl'
		}).
		when('/docs', {
			templateUrl: 'templates/docs.html',
			controller: 'DocsCtrl'
		}).
		when('/signup', {
			templateUrl: 'templates/signup.html',
			controller: 'SignUpCtrl'
		}).
		when('/about', {
			templateUrl: 'templates/about.html'
		}).
		when('/privacy-policy', {
			templateUrl: 'templates/privacy-policy.html'
		}).
		when('/data-policy', {
			templateUrl: 'templates/data-policy.html'
		}).
		otherwise({
			redirectTo: '/docs'
		});
}]);


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

