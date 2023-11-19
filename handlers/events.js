const fs = require('fs');
const eventsDir = `${process.cwd()}/events`;


module.exports = client => {
    const events = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

    for (const file of events) {
        const event = require(`${eventsDir}/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
        console.log(`✅ | Event ${file.replace(/.js/)} processed`)
    }
}