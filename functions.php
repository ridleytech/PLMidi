<?php

error_reporting( E_ERROR | E_PARSE );

date_default_timezone_set( 'America/Detroit' );

if ( !function_exists( "GetSQLValueString" ) ) {
    function GetSQLValueString( $theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "" ) {
        if ( PHP_VERSION < 6 ) {
            $theValue = get_magic_quotes_gpc() ? stripslashes( $theValue ) : $theValue;
        }

        $theValue = function_exists( "mysql_real_escape_string" ) ? mysql_real_escape_string( $theValue ) : mysql_escape_string( $theValue );

        switch ( $theType ) {
            case "text":
                $theValue = ( $theValue != "" && $theValue != "(null)" ) ? "'" . $theValue . "'": "NULL";
                break;
            case "long":
            case "int":
                $theValue = ( $theValue != "" && $theValue != "(null)" ) ? intval( $theValue ) : "NULL";
                break;
            case "double":
                $theValue = ( $theValue != "" && $theValue != "(null)" ) ? doubleval( $theValue ) : "NULL";
                break;
            case "date":
                $theValue = ( $theValue != "" && $theValue != "(null)" ) ? "'" . $theValue . "'": "NULL";
                break;
            case "defined":
                $theValue = ( $theValue != "" ) ? $theDefinedValue : $theNotDefinedValue;
                break;
        }
        return $theValue;
    }
}

function humanTiming( $time ) {
    $time = time() - $time; // to get the time since that moment
    $time = ( $time < 1 ) ? 1 : $time;
    $tokens = array(
        31536000 => 'year',
        2592000 => 'month',
        604800 => 'week',
        86400 => 'day',
        3600 => 'hour',
        60 => 'minute',
        1 => 'second'
    );

    foreach ( $tokens as $unit => $text ) {
        if ( $time < $unit ) continue;
        $numberOfUnits = floor( $time / $unit );
        //return $numberOfUnits . ' ' . $text . ( ( $numberOfUnits > 1 ) ? 's' : '' );
        return $numberOfUnits . ' ' . $text . ( ( $numberOfUnits > 1 ) ? 's' : '' );
    }
}

function blankNull( $param ) {

    if ( $param == null ) {
        $param = "";
    }

    return $param;
}

$editFormAction = $_SERVER[ 'PHP_SELF' ];
if ( isset( $_SERVER[ 'QUERY_STRING' ] ) ) {
    $editFormAction .= "?" . htmlentities( $_SERVER[ 'QUERY_STRING' ] );
}

function get_hashtags( $string, $str = 1 ) {

    preg_match_all( '/#(\w+)/', $string, $matches );
    $i = 0;
    if ( $str ) {
        foreach ( $matches[ 1 ] as $match ) {
            $count = count( $matches[ 1 ] );
            $keywords .= "$match";
            $i++;
            if ( $count > $i )$keywords .= ", ";
        }
    } else {
        foreach ( $matches[ 1 ] as $match ) {
            $keyword[] = $match;
        }
        $keywords = $keyword;
    }
    return $keywords;
}

function roundUpToAny( $n, $x = 5 ) {
    return ( ceil( $n ) % $x === 0 ) ? ceil( $n ) : round( ( $n + $x / 2 ) / $x ) * $x;
}

function escapeJsonString( $value ) { # list from www.json.org: (\b backspace, \f formfeed)
    $escapers = array( "\\", "/", "\"", "\n", "\r", "\t", "\x08", "\x0c" );
    $replacements = array( "\\\\", "\\/", "\\\"", "\\n", "\\r", "\\t", "\\f", "\\b" );
    $result = str_replace( $escapers, $replacements, $value );
    return $result;
}

if ( !isset( $_SESSION ) ) {
    session_start();
}

$date = date( "Y-m-d H:i:s" );

if ( !isset( $_SESSION[ 'uid' ] ) && !isset( $_POST[ 'mobile' ] ) ) {
    //$_SESSION[ 'uid' ] = "1";
}

$colname_rsModelInfo = "-1";
if ( isset( $_SESSION[ 'uid' ] ) && !isset( $_POST[ 'mobile' ] ) ) {
    $colname_rsModelInfo = $_SESSION[ 'uid' ];
}

function generateRandomString( $length = 10 ) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen( $characters );
    $randomString = '';
    for ( $i = 0; $i < $length; $i++ ) {
        $randomString .= $characters[ rand( 0, $charactersLength - 1 ) ];
    }
    return $randomString;
}

function generateRandomTicket( $length = 10 ) {
    $characters = '0123456789';
    $charactersLength = strlen( $characters );
    $randomString = '';
    for ( $i = 0; $i < $length; $i++ ) {
        $randomString .= $characters[ rand( 0, $charactersLength - 1 ) ];
    }
    return $randomString;
}


?>