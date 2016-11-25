/*@ngInject*/
module.exports = function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', states.home());
};

var states = {
    home: function () {
        return {
            url: '/home',
            templateUrl: 'app/components/home/home.view.html',
            controller: 'HomeController',
            controllerAs: 'homeVm',
            resolve: {
            }
        }
    }
};