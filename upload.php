<?php 

//require_once('/Connections/haulyeah.php');  

include("functions.php");

$file = basename($_FILES['afile']['name']);

$name = basename($file);
$extension = strtolower(strrchr($file, '.'));
$e = explode(".", $file );
$pre = $e[0];

$filename = generateRandomString(10) . $extension;

/*if ($_FILES['userfile']['size']> 300000) {
	exit("Your file is too large."); 
}*/

if($extension != ".mid" && $extension != ".midi"){return;}

$date = date("Y-m-d H:i:s");

if (move_uploaded_file($_FILES['afile']['tmp_name'], "uploads/".$filename)) {
	
	//echo "file moved\r\n";			
	//list($width, $height) = getimagesize($source);
		
	$object = new stdClass();
	$object->status = "media upload";
	$object->filename = $filename;
	
	//echo "image upload";
}

echo "{\"data\":";
echo "{\"uploadData\":";
echo json_encode( $object );
echo "}";
echo "}";

?>