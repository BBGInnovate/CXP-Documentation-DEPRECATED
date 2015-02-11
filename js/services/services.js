'use strict';

angular.module('JsonFormatter').factory('APIData', ['$http', '$q', function($http, $q){

	var API_KEY = 'WsOkyf6foFTGPZWsz1cpF62EXbmGa2oAvCVDPwuI';

	return {
		getEndpoint: function(filter) {

			return $http.get('https://cxp.bbg.gov/api/'+filter+'?api_key=' + API_KEY, {timeout: 5000}).then(function(response) {
				return response.data;
			}, function(err) {
				alert(filter + ' failed to load');
			});

		},
		getAllData: function () {
			return $q.all([
				// $q will keep the list of promises in a array
				$http.get('https://cxp.bbg.gov/api/countries?api_key=' + API_KEY + '&story=1'),
				$http.get('https://cxp.bbg.gov/api/languages?api_key=' + API_KEY),
				$http.get('https://cxp.bbg.gov/api/networks?api_key=' + API_KEY),
				$http.get('https://cxp.bbg.gov/api/organizations?api_key=' + API_KEY)
			]).then(function (results) {
				// once all the promises are completed .then() will be executed
				// and results will have the object that contains the data
				var aggregatedData = [];
				var list = ['countries', 'languages', 'organizations', 'networks'];
				var listCount = 0;
				angular.forEach(results, function (result) {

					for (var i = 0; i < result.data.length; i++) {
						var code = '';
						var filter = '';
						if (list[listCount] === 'countries') {
							code = 'code';
							filter = 'countries';
						} else if (list[listCount] === 'languages') {
							code = 'lang_code';
							filter = 'languages';
						} else if (list[listCount] === 'networks') {
							code = 'object_name';
							filter = 'networks';
						} else if (list[listCount] === 'organizations') {
							code = 'object_name';
							filter = 'organizations'
						}

						result.data[i].filter = filter;
						result.data[i].code = result.data[i][code];
						//result.data[i].htmlName = result.data[i].name + '<span class="badge filter-badge"><span>'+list[listCount]+'</span><span style="display: none">'+result.data[i][code]+'</span></span>';
					}
					aggregatedData = aggregatedData.concat(result.data);
					listCount++;
				});
				return aggregatedData;
			});
		},
		getDataByQueryString: function (controller, queryString, apiKeyProvided) {
			var apiKey = API_KEY;

			// If the apiKey passed in is provided, use that instead of the default one above
			if (apiKeyProvided) {
				if (apiKeyProvided.length > 0) {
					apiKey = apiKeyProvided;
				}
			}


			// cut off the /
			controller = controller.substring(1, controller.length - 1);

			// replace ? in beginning of query with ampersand
			queryString = queryString.replace('?', '&');

			// some of the queryString have the / character and stuff before it, cut them out
			if (queryString.indexOf('/') > -1) {
				queryString = queryString.split('/')[1];
			}

			return $q.all([
				// $q will keep the list of promises in a array
		//		$http.get('http://cxp.bbg.gov/bbg/search?api_key='+API_KEY + queryString)
				$http.get('http://cxp.bbg.gov/api/'+controller+'/?api_key='+ apiKey + queryString, {handleError:true})

			]).then(function (results) {
				return results;
			});


		}

	};
}]);
