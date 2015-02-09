

// get property name
angular.module('JsonFormatter').filter('getFilterName', function() {
	return function(val) {
		return val.substring(5, val.length);
	};
});

// get property name
angular.module('JsonFormatter').filter('getQueryStringCode', function() {
	return function(val) {
		return val.substring((val.indexOf('>') + 1), val.length).toUpperCase();
	};
});

angular.module('JsonFormatter').filter('toStringArray', function() {
	return function(arr) {
		if (arr) {
			var arrayString = '';
			for (var i = 0; i < arr.length; i++) {
				// for countries, languages, networks, organizations
				if (arr[i].queryStringCode) {
					arrayString += arr[i].queryStringCode + ',';
					// for custom query filters
				} else {
					arrayString += arr[i] + ',';
				}
			}
			return arrayString.substring(0, arrayString.length - 1);
		}
	};
});

