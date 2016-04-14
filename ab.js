#!/usr/bin/env node

var pcsc = require('pcsclite');

var pcsc = pcsc();

pcsc.on('reader', function(reader) {

    function exit() {
        reader.close();
        pcsc.close();
    }

    cmd_select = new Buffer([0x00, 0xA4, 0x04, 0x00, 0x0A, 0xA0, 0x00, 0x00, 0x00, 0x62, 0x03, 0x01, 0x0C, 0x06, 0x01]);
    cmd_command = new Buffer([0x00, 0x00, 0x00, 0x00]);

    console.log('Using:', reader.name);

    reader.connect(function(err, protocol) {
        if (err) {
            console.log(err);
           // return exit();
        }
        reader.transmit(cmd_select, 255, protocol, function(err, data) {
            if (err) {
                console.log(err);
             //   return exit();
            }
            console.log('Data received 1', data);
            reader.control(cmd_command,1, 255, function(err, output) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Data received 2', output);
                    console.log('Data received 3', output.toString());
                }
               // return exit();
            });
        });
    });
});

pcsc.on('error', function(err) {
    console.log('PCSC error', err.message);
});