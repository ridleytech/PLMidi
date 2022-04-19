<?php

include( "functions.php" );
require( './aws/aws-autoloader.php' );
$config = require( "s3/config.php" );
//echo "require<br>";

include("./db/config.php");

$pianolessons = mysql_pconnect( $hostname_pianolessons, $username_pianolessons, $password_pianolessons )or trigger_error( mysql_error(), E_USER_ERROR );

//$pianolessons = mysqli_connect( $hostname_pianolessons, $username_pianolessons, $password_pianolessons, $database_pianolessons );

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

/*if ($_FILES['userfile']['size']> 300000) {
	exit("Your file is too large."); 
}*/

if ( $extension != ".mid" && $extension != ".midi" ) {
  return;
}

$date = date( "Y-m-d H:i:s" );

$object = new stdClass();
$object->filename = $filename;

mysql_select_db( $database_pianolessons, $pianolessons );

$query_rsFileData = sprintf(
  "INSERT INTO midifiles (filename,s3name,userid,uploaddate) VALUES (%s,%s,%s,%s)",
  GetSQLValueString( $keyname, "text" ),
  GetSQLValueString( $filename, "text" ),
  GetSQLValueString( 1, "int" ),
  GetSQLValueString( $date, "date" )
);

$rsFileData = mysql_query( $query_rsFileData, $pianolessons )or die( mysql_error() );

//$object->status = "data inserted";
//
//echo "{\"data\":";
//echo "{\"uploadData\":";
//echo json_encode( $object );
//echo "}";
//echo "}";

//return;

$s3 = new S3Client( [
  'version' => '2006-03-01',
  'region' => 'us-east-2',
  'credentials' => [
    'key' => $config[ 's3' ][ 'key' ],
    'secret' => $config[ 's3' ][ 'secret' ],
  ],
] );

//echo "client<br>";

try {
  // Upload data.
  $result = $s3->putObject( [
    'Bucket' => $bucket,
    'Key' => $filename,
    'SourceFile' => $_FILES[ 'afile' ][ 'tmp_name' ],
    'ACL' => 'public-read'
  ] );

  $object->status = "media upload";
  $object->res = json_encode( $result[ 'ObjectURL' ] . PHP_EOL );

  // Print the URL to the object.
  //echo $result[ 'ObjectURL' ] . PHP_EOL;

  //  echo "{\"data\":";
  //  echo "{\"uploadData\":";
  //  echo json_encode( $object );
  //  echo "}";
  //  echo "}";

} catch ( S3Exception $e ) {
  //echo $e->getMessage() . PHP_EOL;

  $object->res = json_encode( $e->getMessage() . PHP_EO );
  $object->status = "upload error";
}

echo "{\"data\":";
echo "{\"uploadData\":";
echo json_encode( $object );
echo "}";
echo "}";
if ( move_uploaded_file( $_FILES[ 'afile' ][ 'tmp_name' ], "uploads/" . $filename ) ) {

  //echo "file moved\r\n";			
  //list($width, $height) = getimagesize($source);

  // $object = new stdClass();
  // $object->status = "media upload";
  // $object->filename = $filename;

  //echo "image upload";
}

// echo "{\"data\":";
// echo "{\"uploadData\":";
// echo json_encode( $object );
// echo "}";
// echo "}";

?>