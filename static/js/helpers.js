
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

		readURL( '5d00000100ce0100000000000000119a48c65ab5aec1f910f780dfdfe473e599a211a90304ab6aa581b342b344db4e71099beb79352b3c442c8dee970ffb4d054491e356b4f55882c2f3554393fe6662cf2c348a3f51dcce7b5760290bbdfe48ab09dcec7b6eb464b77d2211f6e642c8d6a79f99ac1434da1efc26ebce3aee344a9a03d8065be33f6a7a377ff32b9f77189fc034a0e222e20dee94893373aa894eaee904201e32ccf1396ddee79d32976a9020f147a7dc4220e43ff287a22718170bce6e86fc853f61f3bba66a6c0c9641b1b45c98095792e5eee9f17c952194d8d17f0864ae91769c2979b8a5a5cee6863b5a7d0450d1dc3c16d5356bba66fafa3b5ad01d792881b0db9857047cbfcd517695d9f677354bdf8b96bfffb2ba86a0____5d00000100580000000000000000309d2ce46aacd0ed69f8859a375ab05b4cb4d15f6e13cfcd8ae44532e6e3aa4a0b196f25587fb3b034e68e3e36bc486e8734975733e2479c606e481b5b4c2d04bb501e9aea32758b26e1044bfe7aba00____5d000001001100000000000000003a194b7813eab51a290c91a72ff881044f0d36a93851ffcf190000' );

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

function nextPowerOfTwo(number){
	number--;
	number |= number >> 1;
	number |= number >> 2;
	number |= number >> 4;
	number |= number >> 8;
	number |= number >> 16;
	number++;
	return number;
}

