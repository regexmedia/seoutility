
var app = angular.module('googleRanking', ['vcRecaptcha']);

var config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }, timeout: timeout_add, }

app.directive('toggle', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.toggle == "tooltip") {
                $(element).tooltip();
            }
            if (attrs.toggle == "popover") {
                $(element).popover();
            }
        }
    };
})

app.controller('HttpController', function ($scope, $http, vcRecaptchaService) {

    $scope.response = null;
    $scope.widgetId = null;
    $scope.keyword = null;

    $scope.model = {
        key: recaptchaSiteKey
    };

    $scope.setResponse = function (response) {
        $scope.response = response;
    };

    $scope.setWidgetId = function (widgetId) {
        $scope.widgetId = widgetId;
    };

    $scope.cbExpiration = function () {
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
    };

    $scope.bindCountry = function () {

        $http.post('/wf/tools/googlesuggest/?cntr=true', config).
            success(function (data, status) {
                $scope.Country = data;
            }).
            error(function (data, status) {
                console.log(data || "Request failed");
            });

        $scope.myLang = "it~it"
        $scope.updateMyLang = function (item)
        {
            console.log(item);
            $scope.myLang = item;
        }

    }

    $scope.isMobile = "0";

    $scope.submit = function () {

        var el = jQuery(this);
        el.find('button').addClass('add-spin');
        
        HideResult();

        waitingDialog.show('Invio richiesta in corso..');

        /* Captcha Client
        ----------------------------------------------------- */
        if ($scope.response == null) {
            el.find('button').removeClass('add-spin');

            waitingDialog.hide();

            ShowMessage(error_captcha);

            console.log('Error captcha Client');

            return;
        }

        var data = $.param({
            website: $scope.website,
            keyword: $scope.keyword,
            address: $scope.address,
            myLang: $scope.myLang,
            isMobile: $scope.isMobile,
            thirdlevel: $scope.thirdlevel,
            recaptchaID: $scope.response
        });

        var startTime = (new Date()).getTime();

        $http.post('/wf/tools/googleranking/?add', data, config)
        .success(function (data, status, headers, config)
        {
            console.log(data.ResponseMessage);
            $scope.PostDataResponse = data;
            
            /* Message Server
            ----------------------------------------------------- */
            if (!data.ResponseStatus && data.ResponseMessage.match('error') !== null) {
                el.find('button').removeClass('add-spin');

                ShowMessage(data.ResponseMessage);

                console.log('Error Message Server');
            }

            /* Response OK */
            if (data.ResponseStatus) {

                angular.element('#httpResultController').scope().GRanking = data.GRanking;

                console.log(data.GRanking);

                ShowResult(); 

                StartMyTimerCheck();
            }

            /* Reload Chaptcha */
            vcRecaptchaService.reload($scope.widgetId);
            waitingDialog.hide();

            var endTime = (new Date()).getTime();
            console.log('Request response returned after ' + (endTime - startTime) / 1000 + ' sec.');
        })
        .error(function (data, status, header, config) {

            waitingDialog.hide();

            console.log('Request Error/Timeout');

            var endTime = (new Date()).getTime();
            console.log('Request response returned after ' + (endTime - startTime) / 1000 + ' sec.');

            ShowMessage(error_timeout);
            vcRecaptchaService.reload($scope.widgetId);
        });


    };
});


