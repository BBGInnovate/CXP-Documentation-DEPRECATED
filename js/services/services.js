'use strict';

angular.module('JsonFormatter').factory('APIData', ['$http', '$q', function($http, $q){

	var API_KEY = 'WsOkyf6foFTGPZWsz1cpF62EXbmGa2oAvCVDPwuI';
/*
	var data = {

		get: function(filter) {

			return $http.get('http://cxp.bbg.gov/bbg/'+filter+'?api_key=' + API_KEY + '&story=1', {timeout: 5000}).then(function(response) {
				return response.data;
			}, function(err) {
				alert(filter + ' failed to load');
			});

		},

		getAll: function() {

			return $http.get('http://cxp.bbg.gov/bbg/countries?api_key=' + API_KEY + '&story=1', {timeout: 5000}).then(function(response) {
				return response.data;
			}, function(err) {
				alert('Countries failed to load');
			});

		}
	};

	return data;
	*/
	return {
		getEndpoint: function(filter) {

			return $http.get('http://cxp.bbg.gov/bbg/'+filter+'?api_key=' + API_KEY, {timeout: 5000}).then(function(response) {
				return response.data;
			}, function(err) {
				alert(filter + ' failed to load');
			});

		},
		getAllData: function () {
			return $q.all([
				// $q will keep the list of promises in a array
				$http.get('http://cxp.bbg.gov/bbg/countries?api_key=' + API_KEY + '&story=1'),
				$http.get('http://cxp.bbg.gov/bbg/languages?api_key=' + API_KEY),
				$http.get('http://cxp.bbg.gov/bbg/networks?api_key=' + API_KEY),
				$http.get('http://cxp.bbg.gov/bbg/organizations?api_key=' + API_KEY)
			]).then(function (results) {
				// once all the promises are completed .then() will be executed
				// and results will have the object that contains the data
				var aggregatedData = [];
				var list = ['countries', 'languages', 'organizations', 'networks'];
				var listCount = 0;
				angular.forEach(results, function (result) {

					for (var i = 0; i < result.data.length; i++) {
						var code = '';
						if (list[listCount] === 'countries') {
							code = 'code';
						} else if (list[listCount] === 'languages') {
							code = 'lang_code';
						} else if (list[listCount] === 'networks') {
							code = 'object_name';
						} else if (list[listCount] === 'organizations') {
							code = 'object_name';
						}


						result.data[i].htmlName = result.data[i].name + '<span class="badge filter-badge"><span>'+list[listCount]+'</span><span style="display: none">'+result.data[i][code]+'</span></span>';
					}
					aggregatedData = aggregatedData.concat(result.data);
					listCount++;
				});
				return aggregatedData;
			});
		},
		getDataByQueryString: function (queryString) {
			// replace ? in beginning of query with ampersand
			queryString = queryString.replace('?', '&');

			return $q.all([
				// $q will keep the list of promises in a array
				$http.get('http://cxp.bbg.gov/bbg/search?api_key='+API_KEY + queryString)

			]).then(function (results) {
				return results;
			});


		}

	};
}]);
