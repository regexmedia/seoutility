
//$(document).ready(function () {

//    $("#myIframeDiv").append("<iframe id='my-modal-frame' frameBorder='0' class='myIframeModal'></iframe>");
//    //my-modal-frame
//    //<div id="myIframeDiv"></div>
//    //<iframe id="my-modal-frame" frameBorder="0" class="myIframeModal"></iframe>
//});



$('.open-modal-dialog').click(function (event) {
    var elem = $('#' + event.target.id);
    $('#modal-title').text((elem.data("title")).toUpperCase());
    $('#my-modal-frame').hide();
    $('#modal-loading').show();
    $('#my-modal-frame').attr("src", elem.data("url"));
    OpenMyModal();
});

function OpenMyModal() {

    jQuery('.notification-my-modal').find('.modal').modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });

    notificationBlockTimer = setTimeout(function () {
        $('#modal-loading').hide();
        $('#my-modal-frame').show();
    }, 3000);
}

//http://stackoverflow.com/questions/12872394/resize-iframe-to-content-with-jquery
$("#my-modal-frame").load(function () {
    $(this).height($(this).contents().find("body").height());
});