<?php
include 'db_connect.php';
include 'functions.php';
tarot_session_start();

if(login_check($mysqli) === TRUE) {
	?>
	<div>
		<h2>User Information for <? echo $_SESSION['username'] . ' (' . $_SESSION['user_id'] . ')'; ?></h2>
		<p>Your user info would be here.</p>
	</div>
	<?
} else {
	?>
	<h2>User Information</h2>
	<p style="font-weight:bold; color: red;">We're sorry there has been some kind of problem. 
		You do not appear to be logged in and should not be able to access this page.</p>
		<?
}

?>