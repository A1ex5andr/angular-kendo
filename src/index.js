import test from './components/test';

// components
import './components/version/interpolate-filter';
import './components/version/version';
import './components/version/version-directive';

import './components/view1/view1';
import './components/view2/view2';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/view1'});
}]);


// test es6 and babel transpiling
((message = 'Up and running!') => {
    console.log(message);
    test();
})();
