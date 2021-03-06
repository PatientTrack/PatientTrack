// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'Templates/Tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.Login', {
                url: '/Login',
                views: {
                    'tab-login': {
                        templateUrl: 'Templates/Login.html',
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('tab.Register', {
                url: '/Register',
                views: {
                    'tab-register': {
                        templateUrl: 'Templates/Register.html',
                        controller: 'RegisterCtrl'
                    }
                }
            })

            .state('settings', {
                url: '/Settings',
                templateUrl: 'Templates/Settings.html',
                controller: 'SettingsCtrl'
            })

            .state('changePassword', {
                url: '/ChangePassword',
                templateUrl: 'Templates/ChangePassword.html',
                controller: 'ChangePasswordCtrl'
            })

            .state('privacyPolicy', {
                url: '/PrivacyPolicy',
                templateUrl: 'Templates/PrivacyPolicy.html',
                controller: 'PrivacyPolicyCtrl'
            })

            .state('help', {
                url: '/Help',
                templateUrl: 'Templates/Help.html',
                controller: 'HelpCtrl'
            })

            .state('home', {
                url: '/Home',
                templateUrl: 'Templates/Home.html',
                controller: 'HomeCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/Register');

    });


