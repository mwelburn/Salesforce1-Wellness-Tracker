(function(angular) {
    'use strict';

    var module = angular.module('WellnessApp', []);

    module.controller('LogController', ['$scope', function($scope) {
        $scope.activeGoals = [];

        $scope.init = function() {
            $scope.retrieveActiveGoals();
        };

        $scope.retrieveActiveGoals = function() {
            var goals = new RemoteObjectModel.Wellness_Goal__c();
            goals.retrieve({ 
                where: {
                    Active__c : {eq: true} } // TODO - sort alphabetical
                },
                function(err, records) {
                    $scope.activeGoals = [];

                    if (err) {
                        alert(err);
                    } else {
                        console.log('Number of Active Goals', records.length);

                        records.forEach(function(goal, index) {
                            $scope.activeGoals.push(goal._props);
                        });

                        $scope.$apply();
                    }
                }
            );
        };

        $scope.createActivity = function(goal) {
            var activity = new RemoteObjectModel.Wellness_Activity__c();
            activity.set('Wellness_Goal__c', goal.Id);
            activity.set('User__c', userId);
            activity.create(function(error, result, event) {
                if (error != null) {
                    alert(error);
                } else {
                    alert('Activity logged successfully!');
                }
            });
        };
    }]);

    module.controller('LeaderController', ['$scope', function($scope) {
        $scope.weeklyLeaders = [];

        $scope.init = function() {
            $scope.getWeeklyRanking();
        }

        $scope.getWeeklyRanking = function() {
            WellnessTrackerController.getWeeklyRanking(
                function(result, event) {
                    if (event.statusCode == 400) {
                        alert(event.message);
                    } else {
                        $scope.weeklyLeaders = result;
                        $scope.$apply();
                    }
                }
            );
        };
    }]);
})(angular);