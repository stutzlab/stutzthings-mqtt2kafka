console.log("Starting MQTT Mosca <-> Kafka server....");

var mosca = require('mosca');

var backend = {
    type: "kafka",
    json: false,
    connectionString: "zookeeper:2181",
    clientId: "mosca",
    groupId: "mosca",
    defaultEncoding: "utf8",
    encodings: {
        "spiddal-adcp": "buffer"
    }
};

//var SECURE_KEY = __dirname + '/../../test/secure/tls-key.pem';
//var SECURE_CERT = __dirname + '/../../test/secure/tls-cert.pem';

var moscaSettings = {
    interfaces: [
        { type: "mqtt", port: 1883 },
        { type: "http", port: 80, bundle: true, static: "./public" }
        /*
                { type: "mqtts", port: 8883, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } },
                { type: "https", port: 3001, bundle: true, credentials: { keyPath: SECURE_KEY, certPath: SECURE_CERT } }
        */
    ],
    id: "mosca",

    /*
    * avoid publishing to $SYS topics because
    * it violates kafka topic naming convention
    */
    stats: false,
    publishNewClient: false,
    publishClientDisconnect: false,
    publishSubscriptions: false,

    logger: { name: 'MoscaServer', level: 'debug' },

   persistence: { factory: mosca.persistence.LevelUp, path: "/levelup-db" },

    backend: backend,
};

/*
 * default authorization, if no auth.json file is present.
 */
var auth = {
    "*": { // this asterisk requires no username. Remove it only allowing authorized users.
        password: "",
        subscribe: [
            "a_public_topic", "another_public_topic"
        ],
        publish: []
    }
};

var authenticate = function (client, username, password, callback) {
    //authorize everyone
    callback(null, true);
}
var authorizeSubscribe = function (client, topic, callback) {
    //authorize everyone
    callback(null, true);
}

var authorizePublish = function (client, topic, payload, callback) {
    //authorize everyone
    callback(null, true);
}

var server = new mosca.Server(moscaSettings);

server.on('ready', setup);

function setup() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;

    console.log('Mosca server is up and running.');
}

server.on("error", function (err) {
    console.log(err);
});

server.on('clientConnected', function (client) {
    console.log('Client Connected \t:= ', client.id);
});

server.on('published', function (packet, client) {
    console.log("Published :=", packet);
});

server.on('subscribed', function (topic, client) {
    console.log("Subscribed :=", topic);
});

server.on('unsubscribed', function (topic, client) {
    console.log('unsubscribed := ', topic);
});

server.on('clientDisconnecting', function (client) {
    console.log('clientDisconnecting := ', client.id);
});

server.on('clientDisconnected', function (client) {
    console.log('Client Disconnected     := ', client.id);
});

