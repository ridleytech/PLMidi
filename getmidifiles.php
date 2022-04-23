<?php

include("./db/config.php");

//$query_rsFileInfo = "SELECT * FROM `midifiles` WHERE userid2 = '" . $_GET['userid2'] ."'";
$query_rsFileInfo = "SELECT * FROM `midifiles` order by filename ASC";

$files = [];

if($debug == true)
{
  $rsFileInfo = mysql_query( $query_rsFileInfo, $pianolessons )or die( mysql_error() );
  $totalRows_rsFileInfo = mysql_num_rows( $rsFileInfo );
  $row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo );

  do {

    //echo "file: {$row_rsFileInfo['filename']}<br>";

    $myObj1 = new stdClass;
    $myObj1->filename = $row_rsFileInfo[ 'filename' ];
    $myObj1->url = "https://plmidifiles.s3.us-east-2.amazonaws.com/" . $row_rsFileInfo[ 's3name' ];

    $files[] = $myObj1;

  } while ( $row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo ) );
}
else {
  $rsFileInfo = mysqli_query( $pianolessons, $query_rsFileInfo );
  $totalRows_rsFileInfo = mysqli_num_rows( $rsFileInfo );

  while ( $row_rsFileInfo = $rsFileInfo->fetch_assoc() ) {
    $myObj1 = new stdClass;
    $myObj1->filename = $row_rsFileInfo[ 'filename' ];
    $myObj1->url = "https://plmidifiles.s3.us-east-2.amazonaws.com/" . $row_rsFileInfo[ 's3name' ];

    $files[] = $myObj1;
  }
}

$myObj2 = new stdClass;
$myObj2->files = $files;
$myObj2->query = $query_rsFileInfo;

echo "{\"data\":";
echo "{\"uploadData\":";
echo json_encode( $myObj2 );
echo "}";
echo "}";

?>