//Envía datos RFID a la aplicación Webkit a través de Socket.io

var io = require('socket.io').listen(6321);
var sp = require("serialport");
var SerialPort = require("serialport").SerialPort;

var serialPort = new SerialPort("COM3", {
  baudrate: 9600,
  parser: sp.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true] 



io.sockets.on('connection', function (socket)
{	
	if(serialPort.isOpen())
	{
		serialPort.close();
	}
	
	serialPort.open(function (error) {
	  if ( error ) {

	    console.log('Fallo al abrir: '+error);
	    socket.emit("refresh", { refresh: true});
	  } else {
	    console.log('ABIERTO');
	    serialPort.on('data', function(data) {
	    	//console.log('data: '+data);
	    	limpio = data.replace(/[^a-zA-Z 0-9.]+/g,' ');	
	    	//console.log('limpio: '+limpio);
	    	cortado = limpio.substring(5,11);
	    	//console.log('cortado: '+cortado);
	    	decimal = parseInt(cortado,16);
	    	//console.log('decimal: '+decimal)
	    	console.log('rfid: '+decimal);
	      //console.log('datos recibidos: ' + data);
	      socket.emit("rfid", {rfid : decimal});
	    });
	    serialPort.write("ls\n", function(err, results) {
	      console.log('error :' + err);
	      console.log('resultados :' + results);
	    });
	  }
	}); 

    
});
