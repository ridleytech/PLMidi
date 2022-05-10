<?php

include( "functions.php" );
//echo "require<br>";

include( "./db/config.php" );

$status;

//file exists

$categoryid = $_GET[ 'categoryid' ];
$fileid = $_GET[ 'fileid' ];

$debug = false;

//UPDATE `midifiles` SET `categoryid` = '1' WHERE `midifiles`.`fileid` = 4;

if ( $debug == true ) {

  $query_rsFileData = "UPDATE `midifiles` SET `categoryid` = $categoryid WHERE `fileid` = $fileid";

  $rsFileData = mysql_query( $query_rsFileData, $pianolessons )or die( mysql_error() );
} else {


  $query_rsFileData = "UPDATE `midifiles` SET `categoryid` = $categoryid WHERE `fileid` = $fileid";
	
  $rsFileData = mysqli_query( $pianolessons, $query_rsFileData );
}

//echo "file updated " . $query_rsFileData;

$myObj2 = new stdClass;
$myObj2->query = $query_rsFileData;

echo "{\"data\":";
echo "{\"uploadData\":";
echo json_encode( $myObj2 );
echo "}";
echo "}";

?>