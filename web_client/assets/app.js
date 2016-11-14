(function () {
    'use strict';
    
    var angular = require('angular');

    var dependencies = [
        require('angular-ui-router')
    ];

    angular
        .module('app', dependencies)
        .config(require('./app.routes.js'));

    module.exports = angular.module('app').name;

})();