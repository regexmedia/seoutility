var div_message = '<div class="form-message-block"><div class="form-message-container"></div><button type="button" class="form-message-close-button"><i class="fa fa-times"></i></button></div>';
var error_timeout = "<div class=\"error-server\">Siamo spiacenti, impossibile evadere la richiesta, riprova più tardi.</div>";
var error_captcha = "<div class=\"error-captcha\">Assicuraci di non essere un robot.</div>";
var timeout_request = 15000;

var app = angular.module('spiderSimulator', ['vcRecaptcha']);



app.controller('HttpController', function ($scope, $http, vcRecaptchaService)
{
    $scope.response = null;
    $scope.widgetId = null;
    $scope.website = null;

    $scope.scheme = "http";
    $scope.updateScheme = function (item) {
        $scope.scheme = item;
        //console.log($scope.scheme);
    }

    $scope.model = {
        key: recaptchaSiteKey
    };

    $scope.setResponse = function (response) {
        //console.info('Response available');
        $scope.response = response;
    };

    $scope.setWidgetId = function (widgetId) {
        //console.info('Created widget ID: %s', widgetId);

        $scope.widgetId = widgetId;
    };

    $scope.cbExpiration = function () {
        //console.info('Captcha expired. Resetting response object');

        vcRecaptchaService.reload($scope.widgetId);

        $scope.response = null;
    };

    $scope.submit = function () {

        var el = jQuery(this);
        el.find('button').addClass('add-spin');

        $("#spider-results").hide();
        $("#show_report_btn").remove();

        waitingDialog.show('Analisi in corso..');
      
        /* Form Message
        --------------------------------------------------------- */
        if (!jQuery('.form-message-block').length) {
            jQuery('body').append(div_message);
        }

        /* Captcha Client
        ----------------------------------------------------- */
        if ($scope.response == null) {
            el.find('button').removeClass('add-spin');

            waitingDialog.hide();

            ShowMessage(error_captcha);

            //console.log('Error captcha Client');

            return;
        }

        var data = $.param({
            website: $scope.website,
            scheme: $scope.scheme,
            recaptchaID: $scope.response
        });

        var config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }, timeout: timeout_request, }

        var startTime = (new Date()).getTime();

        $http.post('/wf/tools/spidersimulator/', data, config)
        .success(function (data, status, headers, config)
        {
            //console.log(data);

            $scope.PostDataResponse = data;

            //console.log($scope.PostDataResponse.MetaTag);

            $scope.MetaTag = data.MetaTag;
            $scope.ServerInformation = data.ServerInformation;
            $scope.GenericInformation = data.GenericInformation;

            /* Message Server
            ----------------------------------------------------- */
            if (!data.ResponseStatus && data.ResponseMessage.match('error') !== null) {
                el.find('button').removeClass('add-spin');

                ShowMessage(data.ResponseMessage);

                //console.log('Error Message Server');
            }
            
            /* Response OK */
            if (data.ResponseStatus)
            {
                var show_report_btn = '<a id="show_report_btn" href="#spider-results" title="Analisi SEO" class="btn btn-gfort wave-effect text-uppercase btn-download" data-scroll><i class="fa fa-cogs"></i> Vai al report</a>';
                $("#buttons-div").append(show_report_btn);
                
                $("#spider-results").show();
                $("#show_report_btn").click();

                //console.log('Success');
            }

            /* Reload Chaptcha */
            vcRecaptchaService.reload($scope.widgetId);
            waitingDialog.hide();

            var endTime = (new Date()).getTime();
            //console.log('Request response returned after ' + (endTime - startTime)/1000 + ' sec.');
        })
        .error(function (data, status, header, config)
        {

            //$scope.ResponseDetails = "Data: " + data + "<hr />status: " + status +  "<hr />headers: " + header +  "<hr />config: " + config;

            waitingDialog.hide();

            //console.log('Request Error/Timeout');

            var endTime = (new Date()).getTime();
            //console.log('Request response returned after ' + (endTime - startTime) / 1000 + ' sec.');

            ShowMessage(error_timeout);
            vcRecaptchaService.reload($scope.widgetId);
        });


    };
});

function ShowMessage(message)
{
    jQuery('.form-message-container').html(message);
    jQuery('.form-message-block').fadeIn(100).fadeOut(6000).css({ bottom: '24px' });
}



