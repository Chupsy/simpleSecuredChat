/*@ngInject*/
module.exports = function () {
    var cryptico = require('cryptico/lib/cryptico.js');

    return function () {
        var self = this;
        self.RSA = {
            generate : function(pass){
                self.RSA.key = cryptico.generateRSAKey(pass, 1024);
            },
            decrypt : function(text){
                if(self.RSA){
                    return cryptico.decrypt(text,self.RSA.key)
                }
            }
        }
    };

};