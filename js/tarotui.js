
$(document).ready(function() {
  // Add a live 'submit' button callback on a regular button to do submission via ajax
  $('#loginsubmitbtn').live("click", function() {
    var formname = '#' + $(this).parents('form').attr('id');
    // Serialize form info
    var vobj = validateForm(formname);
    if(vobj.valid) {
      var sa = $(formname).serializeArray();
      jdata = {};
      for (var n in sa) {
       if(sa[n].name == 'pwd') {
        sa[n].value = hex_sha512(sa[n].value); // convert pwd into sha512 hash
       }
       jdata[sa[n].name] = sa[n].value;
      }
      // Send form info as ajax call
      $.ajax({
        url: "login.php",
        type: "POST",
        data: jdata,
        // Load response into the login div (Response may have timeout to close login div if successful)
        success: function(resp) {
          $('#login').html(resp);
        }
      });
    } else {
      $('#msgp').text(vobj.msg);
      $('#msgp').show();
    }
  });
  // Set click function on overlay to revert back and hide login div
  $('#overlay, .closebtn').live("click", function() {
    toggleLoginForm('hide');
  });
  $("a#loadthrowlink").live('click', function() {
    console.info("Need to write load throw code, after save code is done!");
  });
  $("a#usersettings").live('click', function() {
    userSettings();
  });
  $("a#logoutlink").live('click', function() {
    $.ajax({
      type: 'post',
      url: 'login.php',
      success: function(data) {
        window.location.reload();
      }
    })
  });
  
  // Enable enter to submit form from password
  $('#signin #pwd').live('keypress', function(e) {
  	if (e.which && e.which == 13) {
        $('#loginsubmitbtn').click();
        return false;
    } else {
        return true;
    }
  });
  
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

/** Show or hide the form to sign up or login to the tarot thrower
 *    Modes:
 *      signup: Create a new user
 *      login:  Login as an existing user
 *      logout: Logout existing user
 *      hide:   Hide the form
 **/
function toggleLoginForm(mode) {
  var dur = 500; // Animation duration
  if(typeof(mode) == "undefined" || mode == "") { mode = "login"; }
  
  // mode = hide: hide the login form and return
  if (mode == 'hide') {
    $('#login').animate({'height': 1}, dur - 100, function() {
      $('#login').animate({'width': 1}, dur - 100, function() {
        var props = {
          padding: '0px',
          border: 'none',
          zIndex: 10,
          height: 'auto',
          width: 'auto'
        }
        
        $('#login').html($('#login').data('myhtml'));
        $('#login').removeData('myhtml');
        $('#login').css(props);
        $('#overlay').unbind('click');
        $('#overlay').hide();
      });
    });
    return;
  }
  // Other modes show login form configured a certain way
  var w = '450px';
  switch(mode) {
    case "signup":
      logintype = '2';
      h = '230px';
      break;
    case "logout":
      logintype = '5';
      h = '200px';
      break;
    default:
      logintype = '0';
      h = '180px';
  }
  if(typeof($('#login').data('myhtml')) == "undefined") {
    $('#login').data('myhtml', $('#login').html());
  }
  $('#login').html('');
  var props = {
    'padding': '12px',
    'border': '3px #FFFFAA outset',
    'backgroundColor': '#000000',
    'zIndex': '1000'
  };
  // Add CSS props to login (border, etc.)
  $('#login').css(props);
  // Expand dimensions of login div first by width and then height
  $('#login').animate({'width': w}, dur, function() {
    $('#login').animate({'height': h}, dur, function() {
      // show overlay
      $('#overlay').show();
      // Load login form into login div. type=2 (new) is the signup form.
      $('#login').load('loginForm.php?type=' + logintype);
    });
  });
}

/* Validate the user name
 * Only allow letters, numbers, comma, period, dash and underscores
 */
function checkUserName() {
  var val = $("#uname").val();
  if (val.match(/[^\d\w \,\.\-\_]/)) {
    showValidationError("User name can only contain letters, numbers, comma, period, dash, and underscore.",
                        $('#uname').offset());

    val = val.replace(/[^\d\w \,\.\-\_]/g,'');
    $('#uname').val(val);
  }
}

/*
 * Regex for email checking is from:
 *    http://www.regular-expressions.info/email.html
 */
function checkEmail() {
  var email = $('#email').val();
  if(!email.toUpperCase().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/)) {
     showValidationError(email + " is not a valid e-mail address!", $('#email').offset());
    $('#email').css({'color':'red'});
    $('#email').keyup(function() { $('#email').css({'color':'black'})});
    setTimeout(function() { $('#email').focus(); }, 300);
  }
}

/*
 * Display a popup near form field
 */
function showValidationError(msg, ofs) {
  var vm = '#valmessage';
  if($(vm).length > 0) { $(vm).remove(); }
  $('body').append('<div id="' + vm.replace('#','') + '" style="display:none;">' + msg + '</div>');
  //$(vm).css({position: 'absolute', top: offset.top, left: offset.left});
  $(vm).offset({top: ofs.top - 55, left: ofs.left + 5});
  $(vm).show();
  setTimeout(function() { $(vm).hide(); }, 2500);
}

function validateForm(kind) {
  kind = (typeof(kind) == "undefined")?"login":kind;
  var retobj = {
    'valid': true,
    'msg': ''
  }
  var uname = $('#uname').val();
  if(typeof(uname) != "string" || uname == "" || uname.match(/[^\d\w \,\.\-\_]/)) {
    retobj.valid = false;
    retobj.msg = "User name is not valid";
  } 
  if(kind == "#signup" && retobj.valid) {
    var email = $('#email').val();
    if(typeof(email) != "string" || email == "" || !email.toUpperCase().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/)) {
      retobj.valid = false;
      retobj.msg = "Not a valid e-mail address!";
    }
  }
  if(retobj.valid) {
    var pwd = $('#pwd').val();
    if (typeof(pwd) != "string" || pwd == "") {
      retobj.valid = false;
      retobj.msg = "Not a valid password!";
    }
  }
  return retobj;
}
/*
 * Checks to see if session has been authenticated
 *    Calls login.php?mode=3
 */
function checkLoginStatus() {
  //getUser = (typeof(getUser) == "undefined")? false : true;
  $.ajax({
    url: "login.php",
    type: "POST",
    data: "mode=3",
    // Load response into the login div (Response may have timeout to close login div if successful)
    success: function(results) {
      var lel = $('#login');
      if(results == "0") {
        var lh = lel.data('html');
        if(lh == null || lh == '') {
          lh = '<a onclick="javascript: toggleLoginForm();">Login</a>';
        }
        lel.html(lh);
        lel.removeData('html');
      } else {
        var jobj = JSON.parse(results);
        var uname = (typeof(jobj.user) == "string")?jobj.user: "User";
        var lh = lel.html();
        lel.data('html', lh);
        lel.data('uname', uname);
        var lhtml = '<div id="ulinks"> ';
        var la = Array();
        for(var n in jobj.links) {
          la.push('<a id="' + n + '">' + jobj.links[n] + '</a>');
        }
        lhtml += la.join(' | ') + '</div><div id="resetlink" style="display: none;"><div id="savethrowlink" style="display: none;"><a onclick="javascript: savethrow();">Save Throw</> | </div><a onclick="javascript: window.location.reload();" class="link">Reset</a></div>';
        lel.html(lhtml);
      }
    }
  });
}

function userSettings() {
	$("#overlay").before('<div id="usets" style="display: none;"></div>');
	var mypath = window.location.pathname;
	var pthpts = mypath.split('/');
	if (pthpts[pthpts.length - 1].indexOf('.') > -1) {
		pthpts.pop();
		mypath = pthpts.join('/') + '/';
	}
	$('#usets').load(mypath + 'user.php', function() {
		$('#overlay').show();
		$('#overlay').bind('click', function() { $('#overlay, #usets').fadeOut('fast', function() { $('#usets').remove(); $('#main').fadeIn(); }); });
		$('#usets').fadeIn();
		$('#main').fadeOut();
	});
}
