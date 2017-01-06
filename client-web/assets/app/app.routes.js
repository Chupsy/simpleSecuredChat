/*@ngInject*/
module.exports = function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/home/rsa');
    $stateProvider
        .state('home', states.home());
};

var states = {
    home: function () {
        return {
            url : '/home',
            controller: 'HomeController',
            abstract : true,
            resolve: {
                user : ['User', function(User){
                    console.log('user generated');
                    return new User();
                }]
            }
        }
    }
};