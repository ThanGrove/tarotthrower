<?php

define("HOST", "localhost"); // The host you want to connect to.
define("USER", "tsec_user"); // The database username.
define("PWD", "Q4vDQbVCZMUWyhfV"); // The database password. 
define("DATABASE", "tarotdata"); // The database name.

$mysqli = new mysqli(HOST, USER, PWD, DATABASE);
// If you are connecting via TCP/IP rather than a UNIX socket remember to add the port number as a parameter.

//echo '<p> mysqli: ' . var_export($mysqli) . '</p>';
?>