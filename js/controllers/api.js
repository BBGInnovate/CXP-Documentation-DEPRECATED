angular.module('JsonFormatter').controller('ApiCtrl', ['$scope', 'APIData', '$rootScope',
	function ($scope, APIData, $rootScope) {

	// load jQuery functions
	$scope.$on('$viewContentLoaded', jQueryFunctions);



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
	$scope.pageFilter = '';
	$scope.limitFilter = '';


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

		/* REMOVE USING QUERY STRING
		if ($scope.queryStringNew.indexOf(index.queryStringCode)) {

			// remove an individual item from query string
			if ($scope.queryStringNew.indexOf(index.queryStringCode + ',') > -1) {
				$scope.queryStringNew = $scope.queryStringNew.replace(index.queryStringCode +',', '');
			} else {
				$scope.queryStringNew = $scope.queryStringNew.replace(index.queryStringCode, '');
			}

			// if the particular query string filter is empty, remove the filter from the query string
			if ($scope[index.filter].length === 0) {
				if ($scope.queryStringNew.indexOf('&' + index.filter + '=') > -1) {
					$scope.queryStringNew = $scope.queryStringNew.replace('&' + index.filter +'=', '');
				} else {
					$scope.queryStringNew = $scope.queryStringNew.replace(index.filter +'=', '');
				}

			}



		}
		 */

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

	$scope.queryStringNew = '';

	$scope.$watch('selected', function(newValue, oldValue) {
		if (newValue) {
	//		console.log(newValue);
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

			/*
			ADD USING QUERY STRING

			if ($scope.queryStringNew.indexOf(filter) === -1) {
				$scope.queryStringNew += '&' + filter + '=' + $scope.fields[$scope.fields.length - 1].queryStringCode;

			} else {

				$scope.queryStringNew = $scope.queryStringNew.splice( $scope.queryStringNew.indexOf(filter) + filter.length + 1, 0, $scope.fields[$scope.fields.length - 1].queryStringCode +',');


			}




			$scope.queryStringNew = '?' + $scope.queryStringNew.substring(1 , $scope.queryStringNew.length);
			*/

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

	//	$scope.queryStringNew = '';

	};




	/*
		ADD PAGE FILTER USING QUERY STRING
	 $scope.$watch('pageFilter', function (newVal, oldVal){

		 if(newVal && newVal.length > 0) {
			 if ($scope.queryStringNew.indexOf('page') === -1) {
				$scope.queryStringNew += '&page=' + $scope.pageFilter;
			 } else {
				$scope.queryStringNew = $scope.queryStringNew.replace('&page=' + oldVal, '&page=' + $scope.pageFilter);
			 }

		 }


		 if ($scope.pageFilter.length === 0) {
			$scope.queryStringNew = $scope.queryStringNew.replace('&page=' + oldVal, '');
		 }


	 });
	 */


/*
	String.prototype.splice = function( idx, rem, s ) {
		return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
	};
	*/
}]);
