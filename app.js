//. app.js
var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    ejs = require( 'ejs' ),
    request = require( 'request' ),
    app = express();

var settings = require( './settings' );
var apikey = settings.apikey;

//. ルーティング
app.use( express.Router() );

//. スタティックファイル・フォルダの指定
app.use( express.static( __dirname + '/public' ) );

//. POST データ処理
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

//. EJS テンプレートエンジン
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'ejs' );

//. GET / へのハンドラ
app.get( '/', function( req, res ){
  res.render( 'index', {} );
});

//. https://cl.asahi.com/api_data/longsum.html

//. POST /abstract へのハンドラ
app.post( '/abstract', async function( req, res ){
  var text = req.body.text;
  if( text ){
    var params = {};
    var rate = req.body.rate;
    if( rate ){
      params.rate = parseFloat( rate );
    }
    var length = req.body.rate;
    if( length ){
      params.length = parseInt( length );
    }
    var result = await generateHeadline( 'abstract', text, params );
    if( result && result.status ){
      res.write( JSON.stringify( { status: true, result: result.body } ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: result.error } ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no text found.' } ) );
    res.end();
  }
});

//. POST /align へのハンドラ
app.post( '/align', async function( req, res ){
  var text = req.body.text;
  if( text ){
    var params = {};
    var length = req.body.length;
    if( length ){
      params.length = parseInt( length );
    }
    var result = await generateHeadline( 'align', text, params );
    if( result && result.status ){
      res.write( JSON.stringify( { status: true, result: result.body } ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: result.error } ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no text found.' } ) );
    res.end();
  }
});

//. POST /extract へのハンドラ
app.post( '/extract', async function( req, res ){
  var text = req.body.text;
  if( text ){
    var params = {};
    var rate = req.body.rate;
    if( rate ){
      params.rate = parseFloat( rate );
    }
    var result = await generateHeadline( 'extract', text, params );
    if( result && result.status ){
      res.write( JSON.stringify( { status: true, result: result.body } ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: result.error } ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no text found.' } ) );
    res.end();
  }
});

//. POST /control-len へのハンドラ
app.post( '/control-len', async function( req, res ){
  var text = req.body.text;
  if( text ){
    var params = {};
    var length = req.body.length;
    if( length ){
      params.length = parseInt( length );
    }
    var result = await generateHeadline( 'control-len', text, params );
    if( result && result.status ){
      res.write( JSON.stringify( { status: true, result: result.body } ) );
      res.end();
    }else{
      res.status( 400 );
      res.write( JSON.stringify( { status: false, error: result.error } ) );
      res.end();
    }
  }else{
    res.status( 400 );
    res.write( JSON.stringify( { status: false, error: 'no text found.' } ) );
    res.end();
  }
});


async function generateHeadline( type, text, params ){
  return new Promise( async ( resolve, reject ) => {
    var headers = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': apikey
    };
    params.text = text;
    var option = {
      url: 'https://clapi.asahi.com/' + type,
      method: 'POST',
      headers: headers,
      json: params
    };
    console.log( 'option', option );
    request( option, ( err, res, body ) => {
      if( err ){
        console.log( 'err', err );
        resolve( { status: false, error: err } );
      }else{
        console.log( 'body', body ); //. body = { detail: 'Forbidden' } 
        resolve( { status: true, body: body } );
      }
    });
  });
}


//. 特定ポート番号で待受
var port = process.env.PORT || 8080;
app.listen( port );
console.log( "server starting on " + port + " ..." );
