<?php

define("HOST", "localhost"); // The host you want to connect to.
define("USER", "##PUT USER NAME HERE##"); // The database username.
define("PWD", "##PUT PASSWORD HERE##"); // The database password. 
define("DATABASE", "tarotdata"); // The database name.

$mysqli = new mysqli(HOST, USER, PWD, DATABASE);

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

?>