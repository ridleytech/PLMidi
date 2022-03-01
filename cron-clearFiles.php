<?

$dir = __DIR__ . "/uploads2/*";

$files = glob( $dir ); // get all file names

$filecount = count( $files );

foreach ( $files as $file ) { // iterate files

  //echo "file: ".basename($file)."<br>";
    if ( is_file( $file ) ) {
      unlink( $file ); // delete file
    }
}

?>