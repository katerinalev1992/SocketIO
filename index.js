var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongooseTest');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
   console.log("We are connected to DB")
});

var kittySchema = mongoose.Schema({
    name: String
});

kittySchema.methods.speak = function () {
    var greeting = this.name
        ? "Meow name is " + this.name
        : "I don't have a name";
    console.log(greeting);
}


var Kitten = mongoose.model('Kitten', kittySchema);



Kitten.find(function (err, kittens) {
    console.log("START SEARCH")
    if (err) return console.error(err);
    else{
        console.log("FIND");
        console.log(kittens);
    }

})

Kitten.findOne({ 'name': 'fifi' }, 'name', function (err, person) {
    if (err) return handleError(err);
    console.log("FOuND") // Space Ghost is a talk show host.
    console.log('%s', person.name) // Space Ghost is a talk show host.
})

var fluffy = new Kitten({ name: 'fifi' });

fluffy.save(function (err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
});

// find each person with a last name matching 'Ghost'
var query = Kitten.findOne({ 'name': 'fifi' });

// execute the query at a later time
query.exec(function (err, person) {
    if (err) return handleError(err);
    console.log('%s', person.name) // Space Ghost is a talk show host.
})
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
    Kitten.find({ name: 'FINAL' }, kittySchema);
});

io.on('connection', function(socket){
    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
    });
    
    //Send message to everyone exept certain
    io.on('connection', function(socket){
        socket.broadcast.emit('hi');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
    console.log(Kitten)
});
    