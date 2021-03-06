var pcsc = require('pcsclite');

var pcsc = pcsc();


var COMANDO = new Buffer([0xff, 0xCA, 0x00, 0x00, 0x00]);
var LONG_RESPONSE = 10;


function reverse(s){
    return s.split("").reverse().join("");
}


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
                                //console.log('Datos Recibidos', data);
                                tamano = data.length;
                                //console.log(tamano);
                                for(i = 0 ;i<tamano-2;i++){
                                    v = data[i];
                                    //console.log(v);
                                    cadena = cadena.concat(v);
                                }
                                invertir = reverse(cadena);
                                decimal = parseInt(invertir,16);     
                                console.log(cadena);
                                console.log(invertir);
                                console.log(decimal);
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