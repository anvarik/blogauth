'use strict';

var app = angular.module('app', ['ngRoute', 'appControllers', 'appServices']);

var options = {};
options.api = {};
options.api.base_url = "http://localhost:3001";


app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.
        when('/', {
            templateUrl: '/blog/partials/post.list.html',
            controller: 'PostListCtrl'
        }).
        when('/post/:id', {
            templateUrl: '/blog/partials/post.view.html',
            controller: 'PostViewCtrl'
        }).
        when('/tag/:tagName', {
            templateUrl: '/blog/partials/post.list.html',
            controller: 'PostListTagCtrl'
        }).
        when('/admin', {
            templateUrl: '/blog/partials/admin.post.list.html',
            controller: 'AdminPostListCtrl',
            access: { requiredLogin: true }
        }).
        when('/admin/post/create', {
            templateUrl: '/blog/partials/admin.post.create.html',
            controller: 'AdminPostCreateCtrl',
            access: { requiredLogin: true }
        }).
        when('/admin/post/edit/:id', {
            templateUrl: '/blog/partials/admin.post.edit.html',
            controller: 'AdminPostEditCtrl',
            access: { requiredLogin: true }
        }).
        when('/admin/login', {
            templateUrl: '/blog/partials/admin.login.html',
            controller: 'AdminUserCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
});


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {
        console.log('called $routeChangeStart');
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredLogin 
            && !AuthenticationService.isLogged && !$window.sessionStorage.token) {

            $location.path("/admin/login");
        }
    });
});
