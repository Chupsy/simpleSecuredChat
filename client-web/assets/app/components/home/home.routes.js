/*@ngInject*/
module.exports = function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('rsa', states.rsa());
};

var states = {
    rsa: function () {
        return {
            url: '/rsa',
            templateUrl: 'app/components/RSA/rsa.view.html',
            controller: 'RSAController',
            controllerAs: 'rsaVm'
        }
    }
};