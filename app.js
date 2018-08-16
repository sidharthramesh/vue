var registration = new Vue({
    el: '#registration',
    data: {
        user: {name:'', phone:'', rsa:'', password:''},
        db: null
    },
    created () {
        this.db = new PouchDB("http://localhost:5984/medblocks");
    },
    methods: {
        generateRSA : function() {
            //let usr = this.user;
            window.crypto.subtle.generateKey(
                {
                    name: "RSA-OAEP",
                    modulusLength: 2048, //can be 1024, 2048, or 4096
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
                },
                false, //whether the key is extractable (i.e. can be used in exportKey)
                ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
            )
            .then(key => window.crypto.subtle.exportKey("jwk", key.publicKey))
            .then(key => {
                this.user.rsa = key.n;
            })
            .catch(function(err){
                console.error(err);
            });
        },
        register: function() {
            console.log("Registering...")
            this.db.signUp(
                this.user.phone,
                this.user.password,
                {
                    metadata:{
                    rsa:this.user.rsa,
                    nickname:this.user.name
                    }
                })
            .then(console.log)
            .catch(console.log)
        }
    }
})