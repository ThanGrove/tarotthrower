<?php
include 'db_connect.php';
include 'functions.php';
tarot_session_start();
// 0 = login, 2 = register, 3 = check login status, 4 = error, 5  = logout, default = logout
$mode = (isset($_POST['mode']))? $_POST['mode'] : -1;  // defaults to logout
$mode = (is_numeric($mode))? intval($mode) : -1;

switch($mode) {
  case 0:
    doLogin();
    break;
  case 2:
    doRegister();
    break;
  case 3:
    checkLogin();
    break;
  case 4:
    doError("postvar");
    break;
  case 5:
    doLogout();
    break;
  default:
    doLogout();
}

function doLogin() {
  global $mysqli;
  if(isset($_POST['uname'], $_POST['pwd'])) { 
   $uname = $_POST['uname'];
   $password = $_POST['pwd']; // The hashed password.
   $res = tarot_login($uname, $password, $mysqli);
   if($res == "success") {
    log_event('login', $mysqli);
    header('Location: ./loginForm.php?type=1');
   } else {
    doError($res);
   }
  } else { 
     // The correct POST variables were not sent to this page.
     doError("postvar");
  }
}

/* Checks login status and returns boolean for Ajax API */
function checkLogin() {
  global $mysqli;
  if(login_check($mysqli)) {
    echo '{ "user": "' . $_SESSION['username'] . '", "status":"valid", ' . 
            ' "links": { "loadthrowlink": "Load Past Throw", ' .
            '            "usersettings":"User Settings",' .
            '            "logoutlink":"Logout ' . $_SESSION['username'] . '" }}';
  } else {
    echo 0;
  }
}

function doRegister() {
  global $mysqli;
  if(isset($_POST['uname'], $_POST['email'], $_POST['pwd'])) { 
    $uname = $_POST['uname'];
    $email = $_POST['email'];
    $password = $_POST['pwd'];   // The hashed password from the form
    // Create a random salt
    $random_salt = hash('sha512', uniqid(mt_rand(1, mt_getrandmax()), true));
    // Create salted password (Careful not to over season)
    $password = hash('sha512', $password.$random_salt);
    
    // Add your insert to database script here. 
    // Make sure you use prepared statements!
    $insert_stmt = $mysqli->prepare("INSERT INTO users (uname, email, pwd, salt) VALUES (?, ?, ?, ?)");
    if($insert_stmt) {    
       $insert_stmt->bind_param('ssss', $uname, $email, $password, $random_salt); 
       // Execute the prepared query.
       $insert_stmt->execute();
       header('Location: ./loginForm.php?type=3');
    } else {
      doError("mysql", $mysqli->errno, $mysqli->error);
    }
  } else {
    doError("postvar");
  } 
}

function doLogout() {
  global $mysqli;
  log_event('logout', $mysqli);
  // get session parameters 
  $params = session_get_cookie_params();
  // Delete the actual cookie.
  setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
  // Destroy session
  if(session_id() != "") {
    session_destroy();
  }
  // Unset all session values
  $_SESSION = array();
  header('Location: ./loginForm.php?type=5');
}

function doError($en = "default", $enum = NULL, $emsg = NULL) {
  /**
   * Send Error Message code:
   *     default => 0
   *     badpass: bad password => 1
   *     locked: account locked => 2
   *     mysql: mysql error => 3
   *     nouser: no user => 4
   *     postvar: incorrect post variables => 5
   *      
   **/
  global $mysqli;
  log_event("Error: $en", $mysqli);
  $ecode = '';
  switch($en) {
    case "badpass":
      $ecode = '1';
      break;
    case "locked":
      $ecode = '2';
      break;
    case "mysql":
      $ecode = '3&enum=' . $enum . '&emsg=' . $emsg;
      break;
    case "nouser":
      $ecode = '4';
      break;
    case "postvar":
      $ecode = '5';
      break;
    default:
      $ecode = '0';
  }
  header('Location: ./loginForm.php?type=4&err=' . $ecode);
}

?>