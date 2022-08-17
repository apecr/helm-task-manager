var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var amqp = require('amqplib/callback_api');
var amqpUrl = 'amqp://guest:guest@' + process.env.RABBITMQ_SERVER
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://' + process.env.MONGO_SERVER + '/' + process.env.MONGO_DATABASE;
var mongoDB = process.env.MONGO_DATABASE;
const MONGO_COLLECTION = "taskHistory";



app.use(express.static('public'));
app.use(express.json());

var task;
var userWs;
var amqpChannel;
var client;

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        mongoClient.connect(mongoUrl, (err, clientCallback) => {
            var db;

            if (!err && clientCallback) {
                client = clientCallback;
                db = client.db(mongoDB);
                resolve(db);
            } else {
                reject(err);
            }
        })
    })
}

amqp.connect(amqpUrl, async function (err, conn) {

    amqpChannel = await conn.createChannel();

    console.log("Connected to RabbitMQ");

    amqpChannel.consume('tasksProgress', function (msg) {

        var message = JSON.parse(msg.content.toString());
        openDatabase().then((db) => {
            db.collection(MONGO_COLLECTION).insertOne(message, function (err, res) {
                if (err) throw err;
                client.close();
            });
        });
        console.log("Message received: " + JSON.stringify(message));

        sendWs(message);

    }, { noAck: true });

});

function sendWs(message) {
    if (!!userWs) {
        userWs.send(JSON.stringify(message));
    }
}

async function processTask() {

    if (!amqpChannel) {
        console.error("Not connected to RabbitMQ");
    } else {

        var newTask = {
            id: task.id,
            text: task.text
        }

        amqpChannel.sendToQueue("newTasks", Buffer.from(JSON.stringify(newTask)));
    }

}

app.route('/tasks/:id')
    .get(function (req, res, next) {

        if (!!task && req.params.id == task.id) {
            res.send(task);
        } else {
            res.status(404).end();
        }

    }).delete(function (req, res) {

        if (!!task && req.params.id == task.id) {
            res.send(task);
            task = undefined;
        } else {
            res.status(404).end();
        }
    });

app.post('/tasks/', function (req, res) {

    if (!!task) {
        res.status(409).send('Tasks already created');
    } else {

        task = {
            id: 1,
            text: req.body.text,
            progress: 0,
            completed: false
        }

        res.status(201).send(task);

        processTask();
    }

})

app.ws('/taskProgress', async function (ws, req) {
    console.log('User connected');
    userWs = ws;
});

app.ws('/tasksHistory', async function (ws, req) {
    console.log('Task history request');

    openDatabase().then((db) => {
        db.collection(MONGO_COLLECTION).find({}).toArray(function (err, result) {
            if (err) throw err;
            ws.send(JSON.stringify(result));
            console.log(result);

            client.close();
        });
    });


});

app.listen(8080);