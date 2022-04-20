<?php

include( "functions.php" );
require( './aws/aws-autoloader.php' );
$config = require( "s3/config.php" );
//echo "require<br>";

include("./db/config.php");

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



  // Print the URL to the object.
  //echo $result[ 'ObjectURL' ] . PHP_EOL;

  //  echo "{\"data\":";
  //  echo "{\"uploadData\":";
  //  echo json_encode( $object );
  //  echo "}";
  //  echo "}";


if($debug == true)
{
	$query_rsFileData = sprintf(
  "INSERT INTO midifiles (filename,s3name,userid2,uploaddate) VALUES (%s,%s,%s,%s)",
  GetSQLValueString( $keyname, "text" ),
  GetSQLValueString( $filename, "text" ),
  GetSQLValueString( $_POST[ 'userid2' ], "text" ),
  GetSQLValueString( $date, "date" )
);
	
  $rsFileData = mysql_query( $query_rsFileData, $pianolessons )or die( mysql_error() );
}
else {
	
	$query_rsFileData = sprintf(
  "INSERT INTO midifiles (filename,s3name,userid2,uploaddate) VALUES ('%s','%s','%s','".$date."')",
		filter_var( $keyname, FILTER_SANITIZE_STRING ),
		filter_var( $filename, FILTER_SANITIZE_STRING ),
		filter_var( $_POST[ 'userid2' ], FILTER_SANITIZE_STRING ),
);
  $rsFileData = mysqli_query( $pianolessons, $query_rsFileData );
}

$object->status = "media upload";
$object->res = $result[ 'ObjectURL' ];
$object->userid = $_FILES[ 'userid2' ];
$object->query = $query_rsFileData;

echo "{\"data\":";
  echo "{\"uploadData\":";
  echo json_encode( $object );
  echo "}";
  echo "}";

} catch ( S3Exception $e ) {
  //echo $e->getMessage() . PHP_EOL;

  $object->res = json_encode( $e->getMessage() . PHP_EO );
  $object->status = "upload error";
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