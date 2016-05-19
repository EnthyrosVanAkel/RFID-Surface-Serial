//Envía datos RFID a la aplicación Webkit a través de Socket.io

var io = require('socket.io').listen(1235   );
var pcsc = require('pcsclite');
var pcsc = pcsc();

var osc = require('node-osc')

var oscClient;
var url = '10.1.7.146';
var puerto = 1234;
oscClient = new osc.Client(url,puerto);


io.on('connection', function (socket) {
    socket.on("mensaje", function (mensaje) {
        console.log('mensaje',mensaje);
        oscClient.send('/checkin',mensaje);
        
    });
});



var COMANDO = new Buffer([0xff, 0xCA, 0x00, 0x00, 0x00]);
var LONG_RESPONSE = 10;

function reverse(s){
    return s.split("").reverse().join("");
}

	console.log('ABIERTO');
	pcsc.on('reader', function(reader) {






    console.log('Lector Detectado = > ', reader.name);

    reader.on('error', function(err) {
        console.log('Error(', this.name, '):', err.message);
    });

    reader.on('status', function(status) {
        //console.log('Status(', this.name, '):', status);
        /* check what has changed */
        var changes = this.state ^ status.state;
        if (changes) {
            if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
                console.log("No detecta Tarjeta");/* No detecta Tarjeta */
                reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('removida');
                    }
                });
            } else if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
                console.log("Tarjeta insertada");/* Tarjeta insertada */

                reader.connect({ share_mode : this.SCARD_SHARE_SHARED }, function(err, protocol) {
                    if (err) {
                        console.log(err);
                    } else {
                        reader.transmit(COMANDO, LONG_RESPONSE, protocol, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                var cadena = "";
                                console.log('Datos Recibidos', data);
                                tamano = data.length;
                                var r = []
                                //console.log(tamano);
                                for(i = 0 ;i<tamano-2;i++){
                                    r.push(data[i].toString(16));
                                    //console.log(v);
                                    //cadena = cadena.concat(r[i]);
                                }
                                //console.log(r);
                                invertir = r.reverse();
                                //console.log(invertir);
                                //invertir = reverse(cadena);
                                for(i = 0 ;i<tamano-2;i++){
                                    //console.log(v);
                                    a = invertir[i];
                                    //console.log(a);
                                    //console.log(a.length);
                                    if(a.length == 1){
                                        a = '0'+a;
                                        //console.log('neva',a);
                                        cadena = cadena.concat(a);
                                    }
                                    else{cadena = cadena.concat(a);}
                                } 
                                //console.log('cadena',cadena);
                                decimal = parseInt(cadena,16);   
                                //console.log('invertida',invertir);
                               

                                console.log('decimal',decimal);
                                io.emit("rfid", {rfid : decimal});


                                //console.log('Datos Recibidos', data.toJSON());
                                //reader.close();
                                //pcsc.close();
                            }
                        });


                    }
                });
            }
        }
    });

	    reader.on('end', function() {
	        console.log('Reader',  this.name, 'Lector Removido');
	    });
	});

	pcsc.on('error', function(err) {
	    console.log('PCSC error', err.message);
	});






