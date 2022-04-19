<?php

include("./db/config.php");

$pianolessons = mysql_pconnect( $hostname_pianolessons, $username_pianolessons, $password_pianolessons )or trigger_error( mysql_error(), E_USER_ERROR );

mysql_select_db( $database_pianolessons, $pianolessons );

$query_rsFileInfo = "SELECT * FROM `midifiles` WHERE userid = 1";

$rsFileInfo = mysql_query( $query_rsFileInfo, $pianolessons )or die( mysql_error() );
$row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo );
$totalRows_rsFileInfo = mysql_num_rows( $rsFileInfo );

do {

  //echo "file: {$row_rsFileInfo['filename']}<br>";

  $myObj1 = new stdClass;
  //$myObj1->s3name = $row_rsFileInfo[ 's3name' ];
  $myObj1->filename = $row_rsFileInfo[ 'filename' ];
  $myObj1->url = "https://plmidifiles.s3.us-east-2.amazonaws.com/" . $row_rsFileInfo[ 's3name' ];

  $files[] = $myObj1;

} while ( $row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo ) );

 echo "{\"data\":";
 echo "{\"uploadData\":";
 echo json_encode( $files );
 echo "}";
 echo "}";

?>