<?php

include '../lib/php/db_connect.php';
include 'functions.php';
tarot_session_start();

$type = (isset($_GET['type']))? $_GET['type'] : '0';
$secsToShow = 2; // how long to display a message

/* Types are:
 *  0 = Login
 *  1 = Login Success
 *  2 = Register
 *  3 = Register success
 *  4 = Error
 *  5 = Logout
 */
$type = is_numeric($type)? intval($type) : 4;
if ($type > 5) { $type = 0; }
switch($type) {
  case 0;
    loginForm();
    break;
  case 1:
    if (login_check($mysqli)) {
      loginSuccessMessage();
    } else {
      loginForm("You are not logged in!");
    }
    break;
  case 2:
    registerForm();
    break;
  case 3:
    registerSuccessMessage();
    break;
  case 4:
    errorMessage();
    break;
  case 5:
    logoutSuccessMessage();
    break;
}

// Functions called
function loginForm($msg = '') {
  closeButton();
?>
  <h2>Log Into the Tarot Thrower</h2>
  <p id="msgp"
    <? if (strlen($msg) == 0) { echo 'style="display: none;"'; } ?>
  ><? echo $msg ?></p>
  <form id="signin" method="post">
    <table>
      <tr>
        <td class="label">User ID</td>
        <td><input id="uname" type="text" name="uname" size="50" title="Enter your user name." onkeyup="javascript:checkUserName();"/></td>
      </tr>
      <tr>
        <td class="label">Password</td>
        <td>
          <input id="pwd" type="password" name="pwd" size="50" title="Enter your password"/>
          <input type="hidden" name="mode" value="0"/>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <table class="centered">
            <tr>
              <td><input id="loginsubmitbtn" type="button" value="Submit" class="btn" /></td>
              <td>
                <input type="reset" value="Reset" class="btn" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <blockquote>Don't have an account?
      <a onclick="javascript:toggleLoginForm('signup');">Sign up here.</a></blockquote>
  </form>
<?php
}

function loginSuccessMessage() {
  closeButton();
?>
  <h2>Welcome <? echo $_SESSION['username']; ?>! </h2>
  <p>You have successfully logged in! </p>
<?php
  timeoutScript(TRUE);
}

function registerForm() {
  closeButton();
  ?>
    <h2>Sign Up for Tarot Thrower</h2>
    <p>You can create an account in order to save your throws and review them in the future.
    To do so, please enter the following information: </p>
    <p id="msgp" style="display: none;"></p>
    <form id="signup" method="post" >
      <table>
        <tr>
          <td class="label">User Name</td>
          <td>
            <input id="uname" type="text" name="uname" size="50" onkeyup="javascript:checkUserName();" />
          </td>
        </tr>
        <tr>
          <td class="label">E-mail</td>
          <td>
            <input id="email" type="text" name="email" size="50" onchange="javascript:checkEmail();" />
          </td>
        </tr>
        <tr>
          <td class="label">Password</td>
          <td>
            <input id="pwd" type="password" name="pwd" size="50" />
            <input type="hidden" name="mode" value="2" />
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <table class="centered">
              <tr>
                <td><input id="loginsubmitbtn" type="button" value="Submit" class="btn" /></td>
                <td><input type="reset" value="Reset" class="btn" /></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </form>
<?php
}

function registerSuccessMessage($result) {
  closeButton();
?>
  <h2>Success!</h2>
  <p>Congratulations! You have successfully registered for an account with the Tarot Thrower!</p>
<?php
  timeoutScript();
}

function logoutSuccessMessage() {
  closeButton();
?>
  <h2>Goodbye!</h2>
  <p>You have successfully logged out of the Tarot Thrower! <br/><br/> Come back again soon!</p>
<?php
  timeoutScript(TRUE);
}

/** Error messages sent from login form:
* 
*     default => 0
*     badpass: bad password => 1
*     locked: account locked => 2
*     mysql: mysql error => 3
*     nouser: no user => 4
*     postvar: incorrect post variables => 5
*     
**/

function errorMessage() {
 $err = (isset($_GET['err']))? $_GET['err'] : '0';
 $msg = "An error occurred!";
 switch($err) {
  case '1':
    $msg = "The password was incorrect!";
    break;
  case '2':
    $msg = "Your account is locked!";
    break;
  case '3':
    if(isset($_GET['enum'], $_GET['emsg'])) {
      $msg = $_GET['emsg'] . "(" . $_GET['enum'] . ")";
    } else {
      $msg = "A Mysql error occurred!";
    }
    break;
  case "4":
    $msg = "User name does not exist!";
    break;
  case '5':
    $msg = "Incorrect post variables sent!";
    break;    
 }
 loginForm($msg);
}

function closeButton() {
  ?>
  <div id="loginclose" class="closebtn">x</div>
  <?
}

function timeoutScript($reload = FALSE) {
  $wait = 3000;
  if($reload === TRUE) {
    ?>
      <script type="text/javascript">
        setTimeout(function() {
          $('#login').fadeOut();
        }, <? echo $wait - 750; ?>);
        setTimeout(function() {
          location.reload();
        }, <? echo $wait; ?>);
      </script>
    <?php
  } else { ?>
    <script type="text/javascript">
        setTimeout(function() {
          toggleLoginForm("hide");
        }, <? echo $wait; ?>);
      </script>
    <?php
  }

}
?>