(function () {
    'use strict';

    var angular = require('angular');

    var dependencies = [
        require('angular-ui-router'),
    ];

    angular
        .module('app.home', dependencies)
        .controller('HomeController', require('./home.controller'));


    module.exports = angular.module('app.home').name;
})();