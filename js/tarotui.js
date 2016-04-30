$(document).ready(function() {
    
});

/* Page Manipulation Functions */
function showIntro() {
    if ($('#intro').is(':hidden')) {
        $('#intro').fadeIn();
    } else {
        $('#intro').fadeOut();
    }

    return false;
}

function loadOverlay(divid, phpfile) {
    $("#overlay").before('<div id="' + divid + '" class="infopop" style="display: none;"></div>');
    var mypath = window.location.pathname;
    var pthpts = mypath.split('/');
    if (pthpts[pthpts.length - 1].indexOf('.') > -1) {
        pthpts.pop();
        mypath = pthpts.join('/') + '/';
    }
    $('#' + divid).load(mypath + phpfile, function() {
        $('#overlay').show();
        $('#overlay').bind('click', function() {
            $('#overlay, #' + divid).fadeOut('fast', function() {
                $('#' + divid).remove();
                $('#main').fadeIn();
            });
        });
        $('#' + divid).fadeIn();
        $('#main').fadeOut();
    });
}