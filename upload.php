<?php

include( "functions.php" );
require( './aws/aws-autoloader.php' );
$config = require( "s3/config.php" );
//echo "require<br>";

include( "./db/config.php" );

use Aws\ S3\ S3Client;
use Aws\ S3\ Exception\ S3Exception;

//$filename = "file.midi";
$bucket = 'plmidifiles';

$file = basename( $_FILES[ 'afile' ][ 'name' ] );
$name = basename( $file );

$keyname = $name;

$extension = strtolower( strrchr( $file, '.' ) );
$e = explode( ".", $file );
$pre = $e[ 0 ];

$filename = generateRandomString( 10 ) . $extension;

$source = $_FILES[ 'afile' ][ 'tmp_name' ];

/*if ($_FILES['userfile']['size']> 300000) {
	exit("Your file is too large."); 
}*/

if ( $extension != ".mid" && $extension != ".midi" ) {
  return;
}

$date = date( "Y-m-d H:i:s" );

$s3 = new S3Client( [
  'version' => '2006-03-01',
  'region' => 'us-east-2',
  'credentials' => [
    'key' => $config[ 's3' ][ 'key' ],
    'secret' => $config[ 's3' ][ 'secret' ],
  ],
] );


//$object->status = "data inserted";
//
//echo "{\"data\":";
//echo "{\"uploadData\":";
//echo json_encode( $object );
//echo "}";
//echo "}";

//return;

//echo "client<br>";

if(!isset($_POST[ 'categoryid' ])){

  $_POST[ 'categoryid' ] = "1";
}

//$query_rsFileInfo = "SELECT * FROM `midifiles` WHERE userid2 = '" . $_GET[ 'userid2' ] . "' AND filename = '" + $filename + "'";

$query_rsFileInfo = "SELECT * FROM `midifiles` WHERE filename = '" . $keyname . "'";

if ( $debug == true ) {
  $rsFileInfo = mysql_query( $query_rsFileInfo, $pianolessons )or die( mysql_error() );
  $totalRows_rsFileInfo = mysql_num_rows( $rsFileInfo );
  $row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo );

} else {
  $rsFileInfo = mysqli_query( $pianolessons, $query_rsFileInfo );
  $totalRows_rsFileInfo = mysqli_num_rows( $rsFileInfo );
  $row_rsFileInfo = $rsFileInfo->fetch_assoc();
}

$status;

if ( $totalRows_rsFileInfo > 0 ) {
  //file exists

  $status = "replace file";

  //  $object = new stdClass();
  //  $object->filename = $filename;
  //  $object->userid = $_POST[ 'userid2' ];
  //  $object->query = $query_rsFileInfo;
  //  $object->status = $status;
  //  $object->delete = $row_rsFileInfo[ 's3name' ];
  //
  //  echo "{\"data\":";
  //  echo "{\"uploadData\":";
  //  echo json_encode( $object );
  //  echo "}";
  //  echo "}";
  //
  //  return;

  //$filename = "what";

  if ( $debug == true ) {
    //    $query_rsFileData = sprintf(
    //      "UPDATE midifiles SET s3name = %s,uploaddate = %s WHERE filename = %s",
    //      GetSQLValueString( $filename, "text" ),
    //      GetSQLValueString( $date, "date" ),
    //      GetSQLValueString( $keyname, "text" )
    //    );

    $query_rsFileData = "UPDATE midifiles SET s3name = '$keyname',uploaddate = '$date' WHERE filename = '$keyname'";

    $rsFileData = mysql_query( $query_rsFileData, $pianolessons )or die( mysql_error() );
  } else {

    //    $query_rsFileData = sprintf(
    //      "UPDATE midifiles SET s3name='%s',uploaddate='%s' WHERE filename='%s'",
    //      filter_var( $filename, FILTER_SANITIZE_STRING ),
    //      filter_var( $date, FILTER_SANITIZE_STRING ),
    //      filter_var( $keyname, FILTER_SANITIZE_STRING )
    //    );

    $query_rsFileData = "UPDATE midifiles SET s3name = '$keyname',uploaddate = '$date' WHERE filename = '$keyname'";

    $rsFileData = mysqli_query( $pianolessons, $query_rsFileData );
  }

  try {

    //delete file

    $result = $s3->deleteObject( [
      'Bucket' => $bucket,
      'Key' => $keyname,
    ] );

  } catch ( S3Exception $e ) {
    echo "delete object error: " . $e->getMessage() . "\n";
  }

  try {

    // Upload data.

    $result = $s3->putObject( [
      'Bucket' => $bucket,
      'Key' => $keyname,
      'SourceFile' => $source,
      'ACL' => 'public-read'
    ] );

    // Print the URL to the object.
    //echo $result[ 'ObjectURL' ] . PHP_EOL;

    //  echo "{\"data\":";
    //  echo "{\"uploadData\":";
    //  echo json_encode( $object );
    //  echo "}";
    //  echo "}";

    $object = new stdClass();
    $object->filename = $keyname;
    //$object->status = "media upload";
    //$object->res = $result[ 'ObjectURL' ];
    $object->userid = $_POST[ 'userid2' ];
    $object->query = $query_rsFileData;
    $object->query2 = $query_rsFileInfo;

    $object->status = $status;
    $object->delete = $row_rsFileInfo[ 's3name' ];

    echo "{\"data\":";
    echo "{\"uploadData\":";
    echo json_encode( $object );
    echo "}";
    echo "}";

  } catch ( S3Exception $e ) {
    //echo $e->getMessage() . PHP_EOL;

    echo "s3 replace upload error: " . $e->getMessage() . "\n";

    //      $object->res = json_encode( $e->getMessage() . PHP_EO );
    //      $object->status = "upload error";
  }
} else {

  //is a new file

  $status = "new file";

  if ( $debug == true ) {
    $query_rsFileData = sprintf(
      "INSERT INTO midifiles (filename,s3name,userid2,categoryid,uploaddate) VALUES (%s,%s,%s,%s,%s)",
      GetSQLValueString( $keyname, "text" ),
      GetSQLValueString( $keyname, "text" ),
      GetSQLValueString( $_POST[ 'userid2' ], "text" ),
      GetSQLValueString( $_POST[ 'categoryid' ], "text" ),
      GetSQLValueString( $date, "date" )
    );

    $rsFileData = mysql_query( $query_rsFileData, $pianolessons )or die( mysql_error() );
  } else {

    $query_rsFileData = sprintf(
      "INSERT INTO midifiles (filename,s3name,userid2,categoryid,uploaddate) VALUES ('%s','%s','%s','%s','" . $date . "')",
      filter_var( $keyname, FILTER_SANITIZE_STRING ),
      filter_var( $keyname, FILTER_SANITIZE_STRING ),
      filter_var( $_POST[ 'userid2' ], FILTER_SANITIZE_STRING),
      filter_var( $_POST[ 'categoryid' ], FILTER_SANITIZE_STRING)
    );
    $rsFileData = mysqli_query( $pianolessons, $query_rsFileData );
  }

  try {

    // Upload data.
    $result = $s3->putObject( [
      'Bucket' => $bucket,
      'Key' => $keyname,
      'SourceFile' => $source,
      'ACL' => 'public-read'
    ] );

    // Print the URL to the object.
    //echo $result[ 'ObjectURL' ] . PHP_EOL;

    //  echo "{\"data\":";
    //  echo "{\"uploadData\":";
    //  echo json_encode( $object );
    //  echo "}";
    //  echo "}";

    $object = new stdClass();
    $object->filename = $keyname;
    //$object->status = "media upload";
    $object->res = $result[ 'ObjectURL' ];
    $object->userid = $userid;
    $object->query = $query_rsFileData;
    $object->status = $status;

    echo "{\"data\":";
    echo "{\"uploadData\":";
    echo json_encode( $object );
    echo "}";
    echo "}";

  } catch ( S3Exception $e ) {
    //echo $e->getMessage() . PHP_EOL;

    $object->res = json_encode( $e->getMessage() . PHP_EO );
    $object->status = "s3 insert upload error";
  }
}


// if ( move_uploaded_file( $_FILES[ 'afile' ][ 'tmp_name' ], "uploads/" . $filename ) ) {

//   //echo "file moved\r\n";			
//   //list($width, $height) = getimagesize($source);

//   // $object = new stdClass();
//   // $object->status = "media upload";
//   // $object->filename = $filename;

//   //echo "image upload";
// }

// echo "{\"data\":";
// echo "{\"uploadData\":";
// echo json_encode( $object );
// echo "}";
// echo "}";

?>