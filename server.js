const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// idea service
class IdeaService{
    constructor(){
        this.ideas = [];
    }

    async find(){
        return this.ideas;
    }

    async create(data){
        const idea = {
            id: this.ideas.length,
            name: data.name,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        }
        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea);

        return idea;
    }
}

const server = express(feathers());

// parse JSON
server.use(express.json());

// config socket.io realtime APIs
server.configure(socketio());

// enable REST services
server.configure(express.rest());

// create services
server.use('/ideas', new IdeaService());

// new connections connect to stream channel
server.on('connection', conn => server.channel('liveStream').join(conn));

// publish events to stream
server.publish(data => server.channel('liveStream'));

const PORT = process.env.PORT || 3000;

server.listen(PORT).on('listening', () => {
    console.log(`Realtime server running on port ${PORT}`);
});

// for testing
server.service('ideas').create({
    name: 'Chat Time',
    text: 'Build a chat app',
    tech: 'Node.js',
    viewer: 'Roy Cool Web',
})