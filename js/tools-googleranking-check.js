
var config_check = { timeout: timeout_check, }

app.controller('HttpResultController', function ($scope, $http) {
    
    $http.post('/wf/tools/googleranking/check/?get', config_check).
    success(function (data, status) {

        console.info('=>get all first time');

        if (data.GRanking != null) {
            $scope.GRanking = data.GRanking;

            console.info(data.GRanking);

            if (data.Wait) StartMyTimerCheck();
            else StopMyTimerCheck();

            ShowResult();
        }
    }).
    error(function (data, status) {
        console.log(data || "Request failed");
    });


    $scope.CheckPos = function () {
        console.log("Check");

        $http.post('/wf/tools/googleranking/check/?verify', config_check).
        success(function (data, status) {

            console.info('=>verify new results');

            if (data.GRanking != null) {
                angular.forEach($scope.GRanking, function (p) {
                    for (var i = 0; i < data.GRanking.length; i++) {
                        if (p.IdKey == data.GRanking[i].IdKey) {
                            p.Pos = data.GRanking[i].Pos;
                            p.PageFound = data.GRanking[i].PageFound;
                            p.PosBusiness = data.GRanking[i].PosBusiness;
                            p.DateResult = data.GRanking[i].DateResult;
                        }
                    }
                });
            }

            console.log('DataWait:' + data.Wait);

            if (!data.Wait) {
                console.log('Stop Check');
                StopMyTimerCheck();
            }
            else {
                console.log('Continue Check');
            }
        }).
        error(function (data, status) {
            console.log(data || "Request failed");
        });
    }

    $scope.CheckFailed = function () {
        console.log("Check Failed");

        if ($scope.GRanking != null) {

            angular.forEach($scope.GRanking, function (p) {
                if (p.DateResult == null)
                {
                    $scope.$apply(function () {
                        p.Pos = '-';
                        p.PageFound = '-';
                        p.PosBusiness = '-';
                        p.DateResult = '-';
                    });
                }
            });

        }
    }

});




