// Setup Socket.io
const socket = io('http://localhost:3000');

// Initize feathers app
const app = feathers();

// Allow socket.io to communicate to the server
app.configure(feathers.socketio(socket));

document.getElementById('form').addEventListener('submit', submitIdea);

async function submitIdea(e){
    // stop the page from reloading
    e.preventDefault();

    const name = document.getElementById('idea-name');
    const text = document.getElementById('idea-text');
    const tech = document.getElementById('idea-tech');
    const viewer = document.getElementById('idea-viewer');
    
    // create a new idea
    app.service('ideas').create({
        name: name.value,
        text: text.value,
        tech: tech.value,
        viewer: viewer.value,
    });

    // reset the inputs after submiting
    name.value = "";
    text.value = "";
    tech.value = "";
    viewer.value = "";
};

function displayIdea(idea){
    // doing '=' will replace the idea
    // doing '+=' will add another idea
    document.getElementById('ideas').innerHTML += `
        <div class="card bg-secondary my-3">
            <div class="card-body">
                <h3>${idea.name}</h3>
                <p class="lead">
                    ${idea.text} with (${idea.tech})
                <br />
                <em>Submitted by ${idea.viewer}</em>
                <br />
                <small>${idea.time}</small>
                </p>
            </div>
        </div>
    `;
}

async function init(){
    // find the list of ideas
    const ideas = await app.service('ideas').find();

    // add exisiting ideas to the list
    ideas.forEach(displayIdea);

    // listen for a new idea and display it in realtime
    app.service('ideas').on('created', displayIdea);
}

init();