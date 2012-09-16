
function initialize_compressor() {
	compressor=new LZMA( "js/lzma_worker.js" );
	return compressor;
}

function initialize_helper() {
}

function load_url_code() {
	if ( window.location.hash ) {

		var hash = window.location.hash.substr( 1 );
		var version = hash.substr( 0, 2 );

		if ( version == 'A/' ) {

			// LZMA

			readURL( hash.substr( 2 ) );

		} else {

			// Basic format

			fragCode.value = decodeURIComponent( hash );

		}

	} else {

		readURL( '5d00000100790200000000000000119a48c65ab5aec1f910f780dfdfe473e599a211a90304ab6aa581b342b344db4e71099beb79352b3c442c8dee970ffb4d054491e356b4f55882c2f3554393fe6662cf2c348a3f51dcce7b5760290bbc5c1b937d382ba6cdd0a9b35cf7fd57cebd8006f8d0890914e3f7b821ef92b0143a5417e183bc9bc4e260bfa30c897f178ecf9a485282e38ae9fa011dfa46174ccc63100f187684b312d20cc52621e00a82e4c5c5a3938614726cdcc86c25f2681251f217873b5c70e8449cd323a904e2140758fd4c62ab6fed75f9859959a20f5d4d1a804bbb8e6ce8467bf19b063880e7fb9d13a71dba124f6cf74fffd59754466d10b818d5179032b59ee0c764bd7b156188ebffbce97a60____5d00000100580000000000000000309d2ce46aacd0ed69f8859a375ab05b4cb4d15f6e13cfcd8ae44532e6e3aa4a0b196f25587fb3b034e68e3e36bc486e8734975733e2479c606e481b5b4c2d04bb501e9aea32758b26e1044bfe7aba00____5d000001001100000000000000003a194b7813eab51a290c91a72ff881044f0d36a93851ffcf190000' );

	}
}

function setURL( string ) {
	string = string.split("____");
	var fragString = string[0];
	var vertString = string[1];
	var texString = string[2];

	var fragHex, vertHex, texHex;
	var fragReady = false;
	var vertReady = false;
	var texReady = false;

	function replaceLocation(){
		window.location.replace( '#A/' + fragHex + '____' + vertHex + '____' + texHex );
	}

	compressor.compress( fragString, 1, function( bytes ) {
		fragHex = convertBytesToHex( bytes );
		fragReady = true;
		if(fragReady && vertReady && texReady) replaceLocation();
	},
	dummyFunction );

	compressor.compress( vertString, 1, function( bytes ) {
		vertHex = convertBytesToHex( bytes );
		vertReady = true;
		if(fragReady && vertReady && texReady) replaceLocation();
	},
	dummyFunction );

	compressor.compress( texString, 1, function( bytes ) {
		texHex = convertBytesToHex( bytes );
		texReady = true;
		if(fragReady && vertReady && texReady) replaceLocation();
	},
	dummyFunction );

}

function readURL( hash ) {
	hash = hash.split("____");
	var fragString = hash[0];
	var vertString = hash[1];
	var texString = hash[2];

	var vertBytes = convertHexToBytes( vertString );
	var fragBytes = convertHexToBytes( fragString );
	var texBytes = convertHexToBytes( texString );

	var fragShader, vertShader, texUrl;
	var fragReady = false;
	var vertReady = false;
	var texReady = false;

	function applySettings(){
		compileOnChangeCode = false;  // Prevent compile timer start
		vertCode.setValue(vertShader);
		fragCode.setValue(fragShader);
		textureURLInput.value = texUrl;
		loadTexture(texUrl);
		compile();
		compileOnChangeCode = true;
	}

	compressor.decompress( fragBytes, function( text ) {
		fragShader = text;
		fragReady = true;
		if(fragReady && vertReady && texReady) applySettings();

	},
	dummyFunction );

	compressor.decompress( vertBytes, function( text ) {
		vertShader = text;
		vertReady = true;
		if(fragReady && vertReady && texReady) applySettings();

	},
	dummyFunction );

	compressor.decompress( texBytes, function( text ) {
		texUrl = text;
		texReady = true;
		if(fragReady && vertReady && texReady) applySettings();

	},
	dummyFunction );

}

function convertHexToBytes( text ) {

	var tmpHex, array = [];

	for ( var i = 0; i < text.length; i += 2 ) {

		tmpHex = text.substring( i, i + 2 );
		array.push( parseInt( tmpHex, 16 ) );

	}

	return array;

}

function convertBytesToHex( byteArray ) {

	var tmpHex, hex = "";

	for ( var i = 0, il = byteArray.length; i < il; i ++ ) {

		if ( byteArray[ i ] < 0 ) {

			byteArray[ i ] = byteArray[ i ] + 256;

		}

		tmpHex = byteArray[ i ].toString( 16 );

		// add leading zero

		if ( tmpHex.length == 1 ) tmpHex = "0" + tmpHex;

		hex += tmpHex;

	}

	return hex;

}

// dummy functions for saveButton
function set_save_button(visibility) {
}

function set_parent_button(visibility) {
}

function add_server_buttons() {
}

