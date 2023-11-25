const { client } = require('./src/client/client');
const welcome = require('./src/welcome/welcome');
const roleSelector = require('./src/role-selector/role-selector');
require('./src/client/client');


welcome(client);
roleSelector(client);



//HANDLERS
let handlers = ['events', 'commands', 'tickets'];
handlers.forEach(handler => {
    console.log(handler)
    //require(`./src/handlers/${handler}`)(client)
    require(`./src/handlers/${handler}`)(client);
})




//https://discordjs.guide/interactions/modals.html#building-and-responding-with-modals