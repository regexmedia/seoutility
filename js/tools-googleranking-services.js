var div_message = '<div class="form-message-block"><div class="form-message-container"></div><button type="button" class="form-message-close-button"><i class="fa fa-times"></i></button></div>';
var error_timeout = "<div class=\"error-server\">Siamo spiacenti, impossibile evadere la richiesta, riprova più tardi.</div>";
var error_captcha = "<div class=\"error-captcha\">Assicuraci di non essere un robot.</div>";
$('body').append(div_message);

var timeout_add = 1000 * 60 * 1;
var timeout_check = 1000 * 60 * 3;

var sec = 0;
var sec_check = 5;
var my_timer_enabled = false;

function MyTimerCheck() {
    sec += 1;

    $("#counter").val(sec);

    var is_timeout = (sec > (timeout_check / 1000));

    if (!is_timeout && my_timer_enabled) {
        if ((sec % sec_check) == 0) {

            angular.element('#httpResultController').scope().CheckPos();

            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
            $("#check_status").val(time);
        }

        setTimeout(MyTimerCheck, 1000);
    }
    else if (is_timeout) {
        
        angular.element('#httpResultController').scope().CheckFailed();
        ShowMessage("<div class=\"error-timeout\">Timeout dell\'operazione, tutte le richieste continueranno ad essere elaborate, aggiornare la pagina tra qualche minuto per i risultati.</div>");
        console.info('Timeout - Stop Timer');
    }
    else
    {
        console.info('Check Finished'); //!is_timeout && !my_timer_enabled
    }
};

function ShowResult()
{
    $("#ranking-results").show();

    var show_report_btn = '<a id="show_report_btn" href="#ranking-results" title="Ranking Check Google" class="btn btn-gfort wave-effect text-uppercase btn-download" data-scroll><i class="fa fa-cogs"></i> Vai al report</a>';
    $("#buttons-div").append(show_report_btn);
    $("#show_report_btn").click();
}

function HideResult()
{
    $("#ranking-results").hide();
    $("#show_report_btn").remove();
}


function StartMyTimerCheck() {
    my_timer_enabled = true;
    sec = 0;
    MyTimerCheck();
    EnableBtnCheck(false);
}
function StopMyTimerCheck() {
    my_timer_enabled = false;
    EnableBtnCheck(true);
}

function EnableBtnCheck(status)
{
    $("#check-ranking-btn").prop('disabled', !status);
}

function ShowMessage(message) {
    $('.form-message-container').html(message);
    $('.form-message-block').fadeIn(100).fadeOut(25000).css({ bottom: '24px' });
}
