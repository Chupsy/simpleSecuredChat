(function () {
    'use strict';

    var angular = require('angular');

    var dependencies = [
        require('angular-ui-router'),
        require('./../RSA/rsa.module')
    ];

    angular
        .module('app.home', dependencies)
      .config(require('./home.routes'))
      .controller('HomeController', require('./home.controller'));


    module.exports = angular.module('app.home').name;
})();