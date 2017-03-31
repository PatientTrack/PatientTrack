angular.module('starter.controllers', ['ionic'])

    .controller('LoginCtrl', function ($scope, $http, $rootScope, $window, $ionicLoading) {
        $scope.settings = {
            enableFriends: true
        };

        $scope.getDetails = function () {
            $ionicLoading.show();
            $http.get('http://patienttrackapiv2.azurewebsites.net/api/Patients/' + this.loginEmail + '/' + this.loginPwd)
                .success(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log('data success');
                    console.log(data); // for browser console
                    $rootScope.patient = data; // for UI
                    $window.location.href = '#/Home';
                    $window.localStorage.setItem('ptLoginEmail', $rootScope.patient.PatientEmail);
                    $window.localStorage.setItem('ptLoginPwd', $rootScope.patient.PatientPwd);
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    $scope.showLoginFail();
                });
        };
    })

    .controller('RegisterCtrl', function ($scope, $http, $ionicLoading, $window, $rootScope) {
        // Check if user has stored login details
        var email = $window.localStorage.getItem('ptLoginEmail');
        var pwd = $window.localStorage.getItem('ptLoginPwd');
        if (email != undefined && pwd != undefined) {
            console.log('Logging in from localstorage');
            console.log('Email is ' + email + ", Pwd is " + pwd);
            $ionicLoading.show();
            $http.get('http://patienttrackapiv2.azurewebsites.net/api/Patients/' + email + '/' + pwd)
                .success(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log('data success');
                    console.log(data); // for browser console
                    $rootScope.patient = data; // for UI
                    $window.location.href = '#/Home';
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    $scope.showLoginFail();
                });
        }

        $scope.registerPatient = function () {
            if (this.regUsername != null && this.regEmail != null && this.regPwd != null && this.regPostcode != null) {
                // Generate patientcode using the patient's email - not guaranteed to be unique but fine for demonstation purposes
                $ionicLoading.show();
                var patientCode = '';
                for (var i = 0; i <= 6; i++) {
                    var randPos = Math.floor(Math.random() * this.regEmail.length);
                    if (this.regEmail[randPos] != ".") {
                        patientCode += this.regEmail[randPos];
                    }
                    else {
                        i--;
                    }
                }

                // POST request body
                var data =
                    {
                        "Locations": [],
                        "Carers": [],
                        "PatientFName": this.regUsername,
                        "PatientEmail": this.regEmail,
                        "PatientPwd": this.regPwd,
                        "PatientPostcode": this.regPostcode,
                        "PatientCode": patientCode
                    };

                $http.post('http://patienttrackapiv2.azurewebsites.net/api/Patients/', data)
                    .success(function () {
                        $ionicLoading.hide();
                        console.log('Registered successfully');
                        $window.location.href = '#/tab/Login';
                        $scope.showRegSuccess();
                    })
                    .error(function () {
                        $ionicLoading.hide();
                        $scope.showRegFail();
                    });
            }
            else {
                $scope.showRegFail();
            }
        };
    })

    .controller('SettingsCtrl', function ($scope, $rootScope, $http, $ionicLoading, $window) {

        $scope.updateUsername = function () {
            $ionicLoading.show();
            // PUT Request body - contains new username
            var data =
                {
                    "Locations": $rootScope.patient.Locations,
                    "Carers": $rootScope.patient.Carers,
                    "PatientID": $rootScope.patient.PatientID,
                    "PatientFName": this.updatedUsername,
                    "PatientEmail": $rootScope.patient.PatientEmail,
                    "PatientPwd": $rootScope.patient.PatientPwd,
                    "PatientPostcode": $rootScope.patient.PatientPostcode,
                    "PatientCode": $rootScope.patient.PatientCode
                };

            $http.put('http://patienttrackapiv2.azurewebsites.net/api/Patients/' + $rootScope.patient.PatientID, data)
                .success(function (data) {
                    $ionicLoading.hide();
                    console.log('Updated username successfully');
                    $rootScope.patient = data;
                    $scope.showChangeNameAlert();
                })
                .error(function () {
                    $ionicLoading.hide();
                    console.log('Error updating username');
                    $scope.showChangeNameError();
                });
        };

        $scope.signOut = function () {
            $ionicLoading.show();
            $window.localStorage.removeItem("ptLoginEmail");
            $window.localStorage.removeItem("ptLoginPwd");
            $window.location.href = '#/tab/Login';
            $ionicLoading.hide();
        }
    })

    .controller('ChangePasswordCtrl', function ($scope, $rootScope, $http, $ionicLoading, $window) {
        $scope.updatePwd = function () {
            if (this.currentPwd == $rootScope.patient.PatientPwd) {
                if (this.newPwd1 == this.newPwd2) {
                    $ionicLoading.show();
                    var data =
                        {
                            "Locations": $rootScope.patient.Locations,
                            "Carers": $rootScope.patient.Carers,
                            "PatientID": $rootScope.patient.PatientID,
                            "PatientFName": $rootScope.patient.PatientFName,
                            "PatientEmail": $rootScope.patient.PatientEmail,
                            "PatientPwd": this.newPwd1,
                            "PatientPostcode": $rootScope.patient.PatientPostcode,
                            "PatientCode": $rootScope.patient.PatientCode
                        };

                    $http.put('http://patienttrackapiv2.azurewebsites.net/api/Patients/' + $rootScope.patient.PatientID, data)
                        .success(function (data) {
                            console.log('Updated password successfully');
                            $rootScope.patient = data;
                            $window.location.href = '#/Settings';
                            $window.localStorage.removeItem("ptLoginPwd");
                            $window.localStorage.setItem('ptLoginPwd', $rootScope.patient.PatientPwd);
                            $ionicLoading.hide();
                            $scope.showPwdChange();
                        })
                        .error(function () {
                            $ionicLoading.hide();
                            console.log('Error updating password');
                            $scope.showPwdError();
                        });
                }
                else {
                    $scope.showPwdMismatch();
                }
            }
            else {
                $scope.showOldPwdError();
            }
        };
    })

    .controller('HomeCtrl', function ($scope, $rootScope, $cordovaGeolocation, $ionicLoading) {
        $scope.navigateHome = function () {
            $ionicLoading.show();
            var options = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                console.log("Found location, using launchnavigator to navigate");
                $ionicLoading.hide();
                launchnavigator.navigate($rootScope.patient.PatientPostcode, {
                    start: position.coords.latitude + "," + position.coords.longitude
                });
            }, function (error) {
                $ionicLoading.hide();
                console.log("Could not get location");
                console.log(error);
            });
        };
    })

    .controller('PrivacyPolicyCtrl', function () {

    })

    .controller('HelpCtrl', function () {

    })

    .controller('PopupCtrl', function ($ionicHistory, $scope, $ionicPopup, $timeout, $rootScope, $http, $window, $interval, $cordovaGeolocation, $ionicLoading) {

        $scope.goBack = function() {
            $ionicHistory.backView().go();
        };

        // Function to upload patients location to db every 30000ms (30s)
        $interval(function () {
            $scope.uploadLocation();
        }, 30000);
        $scope.uploadLocation = function () {
            var options = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                console.log("Found user at location '" + position.coords.latitude + "," + position.coords.longitude + "', pushing to DB");
                // POST request body
                var locationData =
                    {
                        "Latitude": position.coords.latitude,
                        "Longitude": position.coords.longitude
                    };

                    $http.post('http://patienttrackapiv2.azurewebsites.net/api/Patients/AddLocation/' + $rootScope.patient.PatientID, locationData)
                    .success(function () {
                        console.log('Updated location');
                    })
                    .error(function (error) {
                        console.log('Error updating location');
                        console.log("Error: " + error);
                    });

            }, function (error) {
                console.log("Could not get interval location");
                console.log(error);
            });
        };

// A confirm dialog for deleting a patient
        $scope.showConfirmDeleteAccount = function () {
            var confirmPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="userPwd">',
                title: 'Delete Account',
                subTitle: 'Enter your password to confirm',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-calm'
                    },
                    {
                        text: '<b>Delete</b>',
                        type: 'button-assertive',
                        onTap: function () {
                            // delete patient
                            if (this.scope.userPwd == $rootScope.patient.PatientPwd) {
                                $ionicLoading.show();
                                $http.delete('http://patienttrackapiv2.azurewebsites.net/api/Patients/' + $rootScope.patient.PatientID)
                                    .success(function () {
                                        $ionicLoading.hide();
                                        console.log('Deleted account successfully');
                                        $rootScope.patient = null;
                                        $window.location.href = '#/Register';
                                        $window.localStorage.removeItem("ptLoginEmail");
                                        $window.localStorage.removeItem("ptLoginPwd");
                                        $scope.showDelete();
                                    })
                                    .error(function () {
                                        $ionicLoading.hide();
                                        console.log('Error deleting account.');
                                        $scope.showDeleteError();
                                    });
                            }
                            else {
                                $scope.showDeletePwdError();
                            }
                        }
                    }
                ]
            });

            $timeout(function () {
                confirmPopup.close(); //close the popup after 10 seconds to avoid accidents
            }, 10000);
        };

// An alert dialog for username change
        $scope.showChangeNameAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Username Changed'
            });

            alertPopup.then(function (res) {
                console.log('Username changed');
            });
        };

// An alert dialog for username change
        $scope.showChangeNameError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Username could not be changed'
            });

            alertPopup.then(function (res) {
                console.log('Username not changed');
            });
        };

// An alert dialog for login failure
        $scope.showLoginFail = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Details not found',
                subTitle: 'Please check your credentials'
            });

            alertPopup.then(function (res) {
                console.log('Login attempt failed');
            });
        };

// An alert dialog for registration failure
        $scope.showRegFail = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Registration error',
                subTitle: 'Possible causes:' +
                '<br>\u2022 Account already exists' +
                '<br>\u2022 Invalid email' +
                '<br>\u2022 No internet connection' +
                '<br>\u2022 Server issue'
            });

            alertPopup.then(function (res) {
                console.log('Registration attempt failed');
            });
        };

// An alert dialog for registration success
        $scope.showRegSuccess = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Registration success!',
                subTitle: 'Please proceed to login'
            });
        };

// An alert dialog for mismatching new password entries
        $scope.showPwdMismatch = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'New password entries do not match',
                subtitle: 'Password not changed'
            });
        };

// An alert dialog for password change success
        $scope.showPwdChange = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Password changed'
            });
        };

// An alert dialog for misc password change error
        $scope.showPwdError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Could not change password',
                subtitle: 'You did everything right, something went wrong on our end.'
            });
        };

// An alert dialog for incorrect 'current password'
        $scope.showOldPwdError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Current password incorrect'
            });
        };

// An alert dialog for incorrect password on delete account
        $scope.showDeletePwdError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Password incorrect',
                subtitle: 'Account not deleted'
            });
        };

// An alert dialog for misc delete account error
        $scope.showDeleteError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Account could not be deleted',
                subtitle: 'You did everything right, something went wrong on our end.'
            });
        };

// An alert dialog for delete account success
        $scope.showDelete = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Account deleted'
            });
        };
    });