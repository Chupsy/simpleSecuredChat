(function () {
    'use strict';

    var angular = require('angular');
    require('ui-router-extras/release/modular/ct-ui-router-extras.core.min.js');
    require('ui-router-extras/release/modular/ct-ui-router-extras.dsr.min.js');
    require('ui-router-extras/release/modular/ct-ui-router-extras.sticky.min.js');
    require('ui-router-extras/release/modular/ct-ui-router-extras.previous.min.js');
    require('ui-router-extras/release/modular/ct-ui-router-extras.transition.min.js');


    var dependencies = [
        require('angular-ui-router'),
        require('angular-translate'),
        require('angular-translate-loader-static-files'),
        'ct.ui.router.extras.dsr',
        'ct.ui.router.extras.transition',
        'ct.ui.router.extras.previous',
        'ct.ui.router.extras.sticky',
        require('./components/home/home.module'),
        require('./shared/user/user.module')
    ];

    angular
        .module('app', dependencies)
        .config(require('./app.routes'))
        .config(require('./app.locals'));


    module.exports = angular.module('app').name;
})();
