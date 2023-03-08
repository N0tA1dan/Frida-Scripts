// still in development
// will add base64 output and more


// converts binary array to ascii
function bin2ascii(array) {
    var result = [];

    for (var i = 0; i < array.length; ++i) {
        result.push(String.fromCharCode( 
            parseInt(
                ('0' + (array[i] & 0xFF).toString(16)).slice(-2),
                16
            )
        ));
    }
    return result.join('');
}

// converts binary to hex
function bin2hex(array, length) {
    var result = "";

    length = length || array.length;

    for (var i = 0; i < length; ++i) {
        result += ('0' + (array[i] & 0xFF).toString(16)).slice(-2);
    }
    return result;
}

Java.perform(function() {
    // hooks crypto function and attempts to log the key
    Java.use('javax.crypto.spec.SecretKeySpec').$init.overload('[B', 'java.lang.String').implementation = function(key, spec) {
        console.log("ASCII KEY FOUND: " + bin2ascii(key));
        console.log("Hex Key:" + bin2hex(key));
        return this.$init(key, spec);
    };

    // waits for function call and hooks it
    Java.use('javax.crypto.Cipher')['getInstance'].overload('java.lang.String').implementation = function(spec) {
        console.log("CIPHER: " + spec);
        return this.getInstance(spec);
    };

    Java.use('javax.crypto.Cipher')['doFinal'].overload('[B').implementation = function(data) {
        console.log("Found data!");
        console.log(bin2ascii(data));
        return this.doFinal(data);
    };
});
