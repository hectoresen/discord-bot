const { client } = require('./src/client/client');
const welcome = require('./src/welcome/welcome');
const mainRoleSelector = require('./src/role-selector/pve-main-role-selector');
//const alterRoleSelector = require('./src/role-selector/pve-main-role-selector');
require('./src/client/client');


welcome(client);
mainRoleSelector(client);
//alterRoleSelector(client);

//HANDLERS
let handlers = ['events', 'commands', 'tickets'];
handlers.forEach(handler => {
    console.log(handler)
    //require(`./src/handlers/${handler}`)(client)
    require(`./src/handlers/${handler}`)(client);
})




//https://discordjs.guide/interactions/modals.html#building-and-responding-with-modals