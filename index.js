const { client } = require('./client/client');
const welcome = require('./welcome/welcome');
const roleSelector = require('./role-selector/role-selector');
require('./client/client');


welcome(client);
roleSelector(client);



//HANDLERS
let handlers = ['events', 'commands', 'tickets'];
handlers.forEach(handler => {
    console.log(handler)
    require(`./handlers/${handler}`)(client)
})




//https://discordjs.guide/interactions/modals.html#building-and-responding-with-modals