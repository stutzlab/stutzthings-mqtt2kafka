console.log("Starting MQTT Mosca <-> Kafka server");

var mosca = require('mosca');
var ascoltatori = require('ascoltatori');

var settings = {
    type: 'kafka',
    json: false,
    kafka: require("kafka-node"),
    connectionString: "${KAFKA_ZOOKEEPER_CONNECT}",
    clientId: "ascoltatori",
    groupId: "ascoltatori",
    defaultEncoding: "utf8",
    encodings: {
        image: "buffer"
    }
};

var settings = {
    port: 1883,
    backend: ascoltatori
};

var server = new mosca.Server(settings);

server.on('clientConnected', function (client) {
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function (packet, client) {
    console.log('Published', packet.payload);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
    console.log('Mosca server is up and running');
}