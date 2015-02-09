angular.module('JsonFormatter').controller('MainCtrl', ['$scope', 'APIData', '$filter', function ($scope, APIData, $filter) {

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

	for (var i = 0; i < $scope.initialFilters.length; i++) {
		$scope[$scope.initialFilters[i].name] = [];
	}
	/*
	$scope.states = [];

	for (var i = 0; i < $scope.initialFilters.length; i++) {
		var filter = $scope.initialFilters[i].name;
		APIData.get(filter)
			.then(function(response) {
				//setTimeout(function(){ $scope.textareaJson = response; $scope.isLoading = false; $scope.$apply() }, 1000 );
				$scope[filter] = response;


				for (var j = 0; j < $scope[filter].length; j++) {
					$scope[filter][j].name += ' ~ ' + filter;
				}

				$scope.states = $scope.states.concat($scope[filter]);

			});
	}
	*/

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
		console.log(index);

		// If countries, organizations, networks, languages
		if ($scope[index.filter]) {
			for (var i = 0; i < $scope[index.filter].length; i++) {
				console.log($scope[index.filter][i].name + ' ' + index.name);
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
			console.log($scope.customQueryFields);
		}

		for (var j = 0; j < $scope.fields.length; j++) {
			if ($scope.fields[j].name === index.name) {
				$scope.fields.splice(j, 1);
			}
		}
		//console.log($scope.fields);
		/*
		setTimeout(function(){

			$scope.fields.splice(index, 1);
			$scope.$apply();

		}, 200 );
		*/
	};

	$scope.submit = function () {
		$scope.isLoading = true;
		var queryString = $('.query-string-holder').text().trim();
		console.log($scope.searchQueryString + $scope.filters);
		queryString = queryString.substring(10, queryString.length).replace(/(\r\n|\n|\r)/gm,"").replace(/\s+/g, '');
	//	console.log(queryString);

		APIData.getDataByQueryString(queryString).then(function(response) {
			setTimeout(function(){ $scope.textareaJson = response; $scope.isLoading = false; $scope.$apply() }, 1000 );
		});

	};

	$scope.$watch('selected', function(newValue, oldValue) {
		if (newValue) {

			var filter = $filter('getFilterName')(newValue.split('<')[2]);
			var queryStringCode = $filter('getQueryStringCode')(newValue.split('<')[4]);

			newValue = newValue.split('<')[0];

			$scope[filter].push({"name": newValue, queryStringCode: queryStringCode });
			$scope.fields.push({"name": newValue, "filter": filter, queryStringCode: queryStringCode });
			$scope.filters += newValue;
			$scope.selected = '';
			console.log($scope[filter]);
		}
	});


	$scope.selectFilter = function (filter) {
		$scope.resetFilters();
		$scope.searchFields = false;
		$scope.isLoading = true;
		$scope.searchQueryString = '/' + filter + '/';

		if (filter === 'search') {
		//	$scope.searchQueryString += '?q=';
			$scope.searchFields = true;
		}

		APIData.getEndpoint(filter)
			.then(function(response) {
				setTimeout(function(){ $scope.textareaJson = response; $scope.isLoading = false; $scope.$apply() }, 1000 );
			});
	};

	$scope.addField = function () {
		var field = $('#typeahead-filters').val();
		console.log(field.length);
		$scope.fields.push({ "name": field, "filter": 'custom' });
		$scope.customQueryFields.push(field);
		$scope.selected = '';
	};


  	$scope.$watch('textarea', function (str){
    	var result = {};

    	try {
        	$scope.textareaJson = JSON.parse(str);
    	} catch (e) {}

  	});


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
