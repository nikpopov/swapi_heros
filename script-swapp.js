var app = angular.module('swApp', []);

angular.module('swApp').controller('mainController', MainController)
MainController.inject = ['$scope', '$http', '$window'];

//var arr = [];

function MainController($scope, $http, $window) {
	$scope.listActive = false;
	$scope.something = {};
	$scope.types = [];
	if($window.localStorage.getItem('swapi')) {
		$scope.set = JSON.parse($window.localStorage.getItem('swapi'))
	} else {
		$scope.set = [];
	}
//	console.log($scope.set);

	$scope.set.forEach(function(value, index, array) {
		if(!$scope.types.includes(value.type)) {
			$scope.types = $scope.types.concat(value.type)
		}
	})
//	console.log($scope.types);

	$http({
		method: 'GET',
		url: 'http://swapi.co/api/'
	}).then(function(response) {
//		console.log(response.data);
		$scope.categories = [];
		Object.keys(response.data).forEach(function(value, index, arr) {
			$scope.categories = $scope.categories.concat(value.toUpperCase());
		});

	});

	$scope.searchByCat = function(value) {
		$scope.something.name = '';
		var val = value.toLowerCase();
		$http({
			method: 'GET',
			url: 'http://swapi.co/api/' + val +'/'
		}).then(function(response) {
			console.log(response.data);
			$scope.items = response.data.results
		})
	};

	$scope.listActivate = function() {
		$scope.listActive = true;
	};

	$scope.listDeactivate = function() {
		$scope.listActive = false;
	};

	$scope.selectPoint = function(obj, type) {
//		console.log(type);
//		console.log(obj.name);

		if(obj.name) {
			$scope.something.name = obj.name
		} else if(obj.title) {
			$scope.something.name = obj.title
		}
		var ob = {
			type: type,
			item: $scope.something.name
		};
		if(!$scope.types.includes(type)) {
			$scope.types = $scope.types.concat(type)
		};
//		console.log($scope.types);

		if(!$scope.set.some(function(value, index, array) {
			return value.item === ob.item
		})) {
			$scope.set = $scope.set.concat(ob);
			$window.localStorage.removeItem('swapi');
			$window.localStorage.setItem('swapi', JSON.stringify($scope.set))
		};
		
//		console.log($scope.set);
		$scope.listActive = false;
	};

	$scope.deleteItem = function(index, item) {
		$scope.set.splice(index, 1);
		$window.localStorage.removeItem('swapi');
		$window.localStorage.setItem('swapi', JSON.stringify($scope.set))
		$scope.types.forEach(function(val, ind, arr) {
			if(!$scope.set.some(function(value, index, array) {
				return val === value.type
			})) {
				$scope.types.splice(ind, 1)
			}
		})
		
	}
}
