<?php

define("HOST", "localhost"); // The host you want to connect to.
//define("USER", "tsec_user"); // The database username.
//define("PWD", "jkw32Hs0WlO97Vbsq"); // The database password. 
define("USER", "root"); // The database username.
define("PWD", "r00t"); // The database password. 
define("DATABASE", "tarotdata"); // The database name.

$mysqli = new mysqli(HOST, USER, PWD, DATABASE);

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

?>