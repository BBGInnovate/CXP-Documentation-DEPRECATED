angular.module('JsonFormatter').controller('MainCtrl', ['$scope', 'APIData', '$rootScope',
	function ($scope, APIData, $rootScope) {

	$scope.initialFilters = [
		{"name": "countries"},
		{"name": "languages"},
		{"name": "networks"},
		{"name": "organizations"},
		{"name": "socialmedia_accounts"},
		{"name": "contents"},
		{"name": "search"}
	];


	$scope.searchQueryString = '/';
	$scope.customQueryFields = [];

	// create scope placeholders for the filters
	for (var i = 0; i < $scope.initialFilters.length; i++) {
		$scope[$scope.initialFilters[i].name] = [];
	}


	// get all data on page load
	APIData.getAllData().then(function(response) {
		$scope.initialFilterData = response;
	});


	$scope.fields = [];
	$scope.filters = '';



	$scope.checkFilterBox = function (index) {
		var filterName = $scope.initialFilters[index].name;

		if ($scope.filters.indexOf(filterName) < 0) {
			$scope.filters += '&' + filterName + '=';
		} else {
			$scope.filters = $scope.filters.replace('&' + filterName + '=', '');
		}


	};



	$scope.uncheckField = function (index) {

		// If countries, organizations, networks, languages
		if ($scope[index.filter]) {
			for (var i = 0; i < $scope[index.filter].length; i++) {

				if ($scope[index.filter][i].name === index.name) {
					$scope[index.filter].splice(i, 1);

				}
			}
		// if custom field
		} else {
			for (var k = 0; k < $scope.customQueryFields.length; k++) {
				if ($scope.customQueryFields[k] === index.name) {
					$scope.customQueryFields.splice(k, 1);
				}
			}

		}

		for (var j = 0; j < $scope.fields.length; j++) {
			if ($scope.fields[j].name === index.name) {
				$scope.fields.splice(j, 1);
			}
		}

	};

	// the submit button is clicked, process data
	$scope.submit = function () {
		$scope.isLoading = true;
		$rootScope.badApiKey = false;
		var queryString = $('.query-string-holder').text().trim();
		var apiKey = $scope.apiKey;
		var controller = $scope.searchQueryString;

		queryString = queryString.substring(10, queryString.length).replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, '');

		APIData.getDataByQueryString(controller, queryString, apiKey).then(function(response) {
			setTimeout(function(){ $scope.textareaJson = response; $scope.isLoading = false; $scope.$apply() }, 1000 );
		});

	};



	$scope.$watch('selected', function(newValue, oldValue) {
		if (newValue) {
			console.log(newValue);
			/*
			var filter = $filter('getFilterName')(newValue.split('<')[2]);
			var queryStringCode = $filter('getQueryStringCode')(newValue.split('<')[4]);
			*/
			var filter = newValue.filter;
			var queryStringCode = newValue.code;

			//newValue = newValue.split('<')[0];

			$scope[filter].push({"name": newValue.name, queryStringCode: queryStringCode });
			$scope.fields.push({"name": newValue.name, "filter": filter, queryStringCode: queryStringCode });
			$scope.filters += newValue.name;
			$scope.selected = '';

		}
	});


	// this function sets the filter from the left panel
	$scope.selectFilter = function (filter) {

		$scope.resetFilters();

		$scope.searchFields = false;
		$scope.searchQueryString = '/' + filter + '/';

		// show the search fields if the search filter is selected
		if (filter === 'search') {
		//	$scope.searchQueryString += '?q=';
			$scope.searchFields = true;
		}

	};

	$scope.addField = function () {
		var field = $('#typeahead-filters').val();

		$scope.fields.push({ "name": field, "filter": 'custom' });
		$scope.customQueryFields.push(field);
		$scope.selected = '';
	};

	// this function sets the JSON array in the box whwen it's found
  	$scope.$watch('textarea', function (str){
    	var result = {};

    	try {
        	$scope.textareaJson = JSON.parse(str);
    	} catch (e) {}

  	});


	// Reset all of the filters
	$scope.resetFilters = function () {
	//	$scope.pageFilter = '';
	//	$scope.limitFilter = '';
		$scope.customQueryFields = [];
		$scope.countries = [];
		$scope.languages = [];
		$scope.organizations = [];
		$scope.networks = [];
		$scope.fields = [];

	};
}]);
