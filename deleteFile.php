<?php

include( "functions.php" );
//echo "require<br>";

require( './aws/aws-autoloader.php' );
$config = require( "s3/config.php" );
//echo "require<br>";

include( "./db/config.php" );

use Aws\ S3\ S3Client;
use Aws\ S3\ Exception\ S3Exception;

$s3 = new S3Client( [
  'version' => '2006-03-01',
  'region' => 'us-east-2',
  'credentials' => [
    'key' => $config[ 's3' ][ 'key' ],
    'secret' => $config[ 's3' ][ 'secret' ],
  ],
] );

$status;

//file exists

$fileid = $_GET[ 'fileid' ];

$query_rsFileInfo = "SELECT * FROM `midifiles` WHERE fileid = " . $fileid;

$filename;
$totalRows_rsFileInfo;

if ( $debug == true ) {
  $rsFileInfo = mysql_query( $query_rsFileInfo, $pianolessons )or die( mysql_error() );
  $totalRows_rsFileInfo = mysql_num_rows( $rsFileInfo );
  $row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo );

  $filename = $row_rsFileInfo[ 'filename' ];
} else {
  $rsFileInfo = mysqli_query( $pianolessons, $query_rsFileInfo );
  $totalRows_rsFileInfo = mysqli_num_rows( $rsFileInfo );

  while ( $row_rsFileInfo = $rsFileInfo->fetch_assoc() ) {
    $filename = $row_rsFileInfo[ 'filename' ];
  }
}

$debug = false;

$bucket = 'plmidifiles';

//echo $totalRows_rsFileInfo;
//
//return;

if ( $totalRows_rsFileInfo > 0 ) {

  try {

    //delete file

    $result = $s3->deleteObject( [
      'Bucket' => $bucket,
      'Key' => $filename,
    ] );

    if ( $debug == true ) {

      $query_rsFileData = "DELETE FROM `midifiles` WHERE `fileid` = $fileid";

      $rsFileData = mysql_query( $query_rsFileData, $pianolessons )or die( mysql_error() );
    } else {

      $query_rsFileData = "DELETE FROM `midifiles` WHERE `fileid` = $fileid";

      $rsFileData = mysqli_query( $pianolessons, $query_rsFileData );
    }

    //echo "file updated " . $query_rsFileData;

    $myObj2 = new stdClass;
    $myObj2->query = $query_rsFileData;

    echo "{\"data\":";
    echo "{\"deleteData\":";
    echo json_encode( $myObj2 );
    echo "}";
    echo "}";

  } catch ( S3Exception $e ) {
    echo "delete object error: " . $e->getMessage() . "\n";
  }
}
?>