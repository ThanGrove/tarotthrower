<?php
include '../lib/php/db_connect.php';
include 'functions.php';
tarot_session_start();

header('Content-type: application/json');

if (login_check($mysqli)) {
	$uid = $_SESSION['user_id'];
	$jdata = $_GET['json'];
	$insert_stmt = 'INSERT INTO throws (user, data) VALUES (?,?)';
	if($insert_stmt) {    
       $insert_stmt->bind_param('is', $uid, $jdata); 
       // Execute the prepared query.
       $insert_stmt->execute();
       echo '{"status": "success", "jdata": "' . $jdata . '"}';
    } else {
    	echo '{"status": "fail", "reason": "bad insert statement"}';
    }
} else {
	echo '{"status": "fail", "reason": "not valid user"}';
}
?>