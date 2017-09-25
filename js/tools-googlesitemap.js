

/* =========================================================================
Google Sitemap Form
========================================================================= */
if (jQuery('.google-sitemap-form-block').length) {
    jQuery('.google-sitemap-form-block form').each(function (index) {

        jQuery(this).attr('id', 'gfort-google-sitemap-form-block-' + index);

        jQuery('#gfort-google-sitemap-form-block-' + index).submit(function ()
        {
            waitingDialog.show('Creazione Google sitemap in corso..');

            $("#download_link").remove();

            var div_message = '<div class="form-message-block"><div class="form-message-container"></div><button type="button" class="form-message-close-button"><i class="fa fa-times"></i></button></div>';

            var el = jQuery(this),
                formValues = el.serialize(),
                formActionURL = el.attr('action'),
                recaptchaID = el.find('.gfort-recaptcha').attr('id');

                el.find('.gfort-new-recaptcha').removeClass('gfort-new-recaptcha');
                el.find('.gfort-recaptcha').parent().addClass('gfort-new-recaptcha');
                el.find('button').addClass('add-spin');

                jQuery.ajaxSetup({
                    timeout: (60 * 3 * 1000), error: function () {
                        waitingDialog.hide();
                        jQuery('body').append(div_message);
                        jQuery('.form-message-container').html('<div class="success-message">Problemi nella generazione della sitemap.</div>');
                        jQuery('.form-message-block').fadeIn(100).fadeOut(6000).css({ bottom: '24px' });
                    }
                });

                jQuery.post('/wf/tools/googlesitemap/', formValues, function (response) {

                /* Form Message
                --------------------------------------------------------- */
                if (!jQuery('.form-message-block').length) {
                    jQuery('body').append(div_message);
                }
                jQuery('.form-message-container').html(response);
                jQuery('.form-message-block').fadeIn(100).fadeOut(6000).css({ bottom: '24px' });

                /* Handle Errors
                --------------------------------------------------------- */
                /* WebSite
                ----------------------------------------------------- */
                if (response.match('error-web-site') !== null) {
                    el.find('.web-site').next().addClass('error');
                    el.find('button').removeClass('add-spin');
                    waitingDialog.hide();
                }

                if (response.match('error-scheme') !== null) {
                    el.find('.scheme').next().addClass('error');
                    el.find('button').removeClass('add-spin');
                    waitingDialog.hide();
                }

                

                /* Captcha
                ----------------------------------------------------- */
                if (response.match('error-captcha') !== null) {
                    el.find('button').removeClass('add-spin');
                    waitingDialog.hide();
                }

                /* Success
                --------------------------------------------------------- */
                if (response.match('success-message') !== null) {

                    el.find('.gfort-recaptcha').remove();
                    el.find('.gfort-new-recaptcha').append('<div class="gfort-recaptcha" id="' + recaptchaID + '"></div>');
                    grecaptcha.render(recaptchaID, { sitekey: gfortRecaptchaSiteKey });

                    //el.find('.form-control').val('').removeClass('input-filled');

                    el.find('button').removeClass('add-spin');

                    var file_name = $('#filename').val();

                    var download_link = '<a id="download_link" href="/wf/download/?t=xml&n=' + file_name + '" title="Download Sitemap" class="btn btn-gfort wave-effect text-uppercase btn-download" download><i class="fa fa-download"></i> Download Sitemap</a>';
                    //$("#buttons-div").append(download_link);

                    function handler() { this.parentNode.removeChild(this) }
                    $('#buttons-div').append(function () {
                        return $(download_link).click(handler);
                    })

                    waitingDialog.hide();
                }

            });

            return false;

        });

        jQuery(this).find('.form-control').on('focus', function () {
            jQuery(this).next().removeClass('error');
            //dismissFormMessagefn();
        });

    });
}


//setTimeout(function ()
//{
//    waitingDialog.hide();

//    jQuery('.form-message-container').html('<div class="success-message">Problemi nella generazione della sitemap.</div>');
//    jQuery('.form-message-block').fadeIn(100).css({ bottom: '24px' });

//}, (60*3*1000));
