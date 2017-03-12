var app = angular.module('easyrashApp', ['ngRoute', 'ngAnimate', 'angularFileUpload'])

app.run(function ($http, $rootScope, $location){
	if (localStorage.getItem('id') && localStorage.getItem('token')) {
		$rootScope.user = {}
		$rootScope.user.email = localStorage.getItem('id');
		$rootScope.user.password = localStorage.getItem('token');
		console.log('ok')
	}
})
app.factory('HttpInterceptorMessage', ['$q', '$location', '$rootScope', function ($q, $location, $rootScope) {
	return {
		
		// optional method
		'request': function (config) {
			
			// do something on success
			if ($rootScope.user) {
				var id = $rootScope.user.id
				var token = $rootScope.user.password
			} else {
				var id = localStorage.getItem('id')
				var token = localStorage.getItem('token')
			}
			if (token && id) {
				config.headers['www-authenticate'] = window.btoa(id + ' ' + token)
			}
			return config
		},
		'response': function (response) {
			
			// do something on success
			if (response.data.message) {
				alertify.success(response.data.message)
			};
			return response
		},

		'responseError': function (response) {
			
			// do something on error
			if (response.data && response.data.message) {
				alertify.error(response.data.message)
			}
			if (response.data && response.data.error) {
				alertify.error(response.data.error.error)
			}

			return $q.reject(response)
		}
	}
}])

// Templates mapper
app.config(['$locationProvider', '$routeProvider', '$httpProvider',
	function ($locationProvider, $routeProvider, $httpProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'home/home.template.php',
			reloadOnSearch: false
		})
		.when('/login', {
			templateUrl: 'login/login.template.php'
		})
		.when('/logout', {
			templateUrl: 'login/logout.template.php'
		})
		.when('/submit', {
			templateUrl: 'submit/submit.template.php'
		})
		.when('/submit2', {
			templateUrl: 'submit/submit2.template.php'
		})
		.when('/plugins', {
			templateUrl: 'home/home2.template.php',
			reloadOnSearch: false
		})
		.when('/api', {
			templateUrl: 'home/api.template.php'
		})
		.when('/edit/:hid', {
			templateUrl: 'submit/edit.template.php'
		})
		.when('/info/:hid', {
			templateUrl: 'home/info.template.php'
		})

		$httpProvider.interceptors.push('HttpInterceptorMessage')
}])