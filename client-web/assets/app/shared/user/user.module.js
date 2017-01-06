(function () {
    'use strict';

    var angular = require('angular');

    var dependencies = [
        require('angular-ui-router')
    ];

    angular
        .module('app.user', dependencies)
        .factory('User', require('./user.factory'));


    module.exports = angular.module('app.user').name;
})();