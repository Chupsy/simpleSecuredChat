(function () {
    'use strict';

    var angular = require('angular');

    var dependencies = [
        require('angular-ui-router')
    ];

    angular
        .module('app.home.rsa', dependencies)
        .controller('RSAController', require('./rsa.controller'));


    module.exports = angular.module('app.home.rsa').name;
})();