<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<?php

include( "./db/config.php" );

//$query_rsFileInfo = "SELECT * FROM `midifiles` WHERE userid2 = '" . $_GET['userid2'] ."'";
$query_rsFileInfo = "SELECT a.*,b.* FROM (SELECT * FROM midifiles) as a INNER JOIN (SELECT categoryid,categoryname FROM midicategories) as b ON a.categoryid = b.categoryid";

$query_rsCategories = "SELECT categoryid,categoryname FROM midicategories  order by categoryname ASC";

if ( $_GET[ 'categoryid' ] ) {

  $query_rsFileInfo .= " WHERE categoryid = " . $_GET[ 'categoryid' ];
}

$query_rsFileInfo .= " order by filename ASC";

$files = [];

if ( $debug == true ) {
  $rsFileInfo = mysql_query( $query_rsFileInfo, $pianolessons )or die( mysql_error() );
  $totalRows_rsFileInfo = mysql_num_rows( $rsFileInfo );
  $row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo );

  $rsCategories = mysql_query( $query_rsCategories, $pianolessons )or die( mysql_error() );
  $totalRows_rsCategories = mysql_num_rows( $rsCategories );
  $row_rsCategories = mysql_fetch_assoc( $rsCategories );

  do {

    //echo "file: {$row_rsFileInfo['filename']}<br>";

    $myObj1 = new stdClass;
    $myObj1->filename = $row_rsFileInfo[ 'filename' ];
    $myObj1->fileid = $row_rsFileInfo[ 'fileid' ];

    $myObj1->categoryid = $row_rsFileInfo[ 'categoryid' ];
    $myObj1->categoryname = $row_rsFileInfo[ 'categoryname' ];

    $myObj1->url = "https://plmidifiles.s3.us-east-2.amazonaws.com/" . $row_rsFileInfo[ 's3name' ];

    $files[] = $myObj1;

  } while ( $row_rsFileInfo = mysql_fetch_assoc( $rsFileInfo ) );

  do {

    //echo "file: {$row_rsFileInfo['filename']}<br>";

    $myObj1 = new stdClass;
    $myObj1->categoryname = $row_rsCategories[ 'categoryname' ];
    $myObj1->categoryid = $row_rsCategories[ 'categoryid' ];
    $categories[] = $myObj1;

  } while ( $row_rsCategories = mysql_fetch_assoc( $rsCategories ) );
} else {
  $rsFileInfo = mysqli_query( $pianolessons, $query_rsFileInfo );
  $totalRows_rsFileInfo = mysqli_num_rows( $rsFileInfo );

  $rsCategories = mysqli_query( $pianolessons, $query_rsCategories );
  $totalRows_rsCategories = mysqli_num_rows( $rsCategories );

  while ( $row_rsFileInfo = $rsFileInfo->fetch_assoc() ) {
    $myObj1 = new stdClass;
    $myObj1->filename = $row_rsFileInfo[ 'filename' ];
    $myObj1->fileid = $row_rsFileInfo[ 'fileid' ];

    $myObj1->categoryid = $row_rsFileInfo[ 'categoryid' ];
    $myObj1->categoryname = $row_rsFileInfo[ 'categoryname' ];

    $myObj1->url = "https://plmidifiles.s3.us-east-2.amazonaws.com/" . $row_rsFileInfo[ 's3name' ];

    $files[] = $myObj1;
  }

  while ( $row_rsCategories = $rsCategories->fetch_assoc() ) {
    $myObj1 = new stdClass;
    $myObj1->categoryid = $row_rsCategories[ 'categoryid' ];
    $myObj1->categoryname = $row_rsCategories[ 'categoryname' ];

    $categories[] = $myObj1;
  }
}

$myObj2 = new stdClass;
$myObj2->query = $query_rsFileInfo;

if ( $totalRows_rsFileInfo ) {
  $myObj2->files = $files;
} else {
  $myObj2->files = [];
}

//echo "{\"data\":";
//echo "{\"uploadData\":";
//echo json_encode( $myObj2 );
//echo "}";
//echo "}";

?>

<body>
<?php

//echo "files: ". var_dump($myObj2->files) ;

//var_dump( $files );

//var_dump( $categories );


//echo $x->filename . "<option value=\"" . $x->categoryid . "\"> . $x->categoryname . ""</option>";

foreach ( $files as $x ) {

  echo "<div class=\"file\" style=\"display:flex;\" id=\"$x->fileid\">" . $x->filename . "<select class=\"category\" style=\"margin-left: 10px; margin-bottom: 10px;\">";

  foreach ( $categories as $z ) {

    if ( $z->categoryid == $x->categoryid ) {
      echo "<option value=\"$z->categoryid\" selected> $z->categoryname </option>";
    } else {
      echo "<option value=\"$z->categoryid\" > $z->categoryname </option>";
    }
  }

  echo "</select><a href=\"$x->url\" style=\"margin-left: 10px\">download</a><div class=\"delete\" style=\"margin-left: 10px; cursor:pointer;\">delete</div></div>";

}

?>
<script>
	
	var currentFile = "";
	var url = "https://pianolessonwithwarren.com/dev_site";

//url = "http://localhost:8888/pianolesson";

	
	$( ".category" ).change(function() {
  //alert( "Handler for .change() called." );
		
		var categoryid = $( this ).val();
		
		//console.log("val: "+categoryid + " for file "+currentFile);
		
		//return;
		
		var newurl = url +
    "/PLMidi/updateFileInfo.php?fileid=" +
    currentFile + '&categoryid='+categoryid;

  console.log("newurl: " + newurl);
		
		//https://www.w3schools.com/php/php_ajax_xml.asp

  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {
	  
	  console.log("change")
    if (this.readyState==4 && this.status==200) {
		
		console.log(this.responseText)
    }
  }
  xmlhttp.open("GET",newurl,true);
  xmlhttp.send();
});


$( ".delete" ).click(function() {
  //alert( "Handler for .change() called." );
		
		var categoryid = $( this ).val();
		
		//console.log("delete file "+currentFile);

		//return;
		
		var newurl = url +
    "/PLMidi/deleteFile.php?fileid=" + currentFile;

  //console.log("newurl: " + newurl);
		
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {
	  
	  //console.log("change")
    if (this.readyState==4 && this.status==200) {
		
      console.log(this.responseText)

    setTimeout(() => {
      location.reload(true);
    }, 1000);
    }
  }
  xmlhttp.open("GET",newurl,true);
  xmlhttp.send();
});
	
	$( ".file" ).hover(function() {
  //alert( "Handler for .change() called." );
		
		//console.log("file: "+$( this ).attr('id'));
		
		currentFile = $( this ).attr('id');
});
</script>
</body>
