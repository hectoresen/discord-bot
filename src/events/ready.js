module.exports = {
    name: 'ready',
    run: (client) => {
        console.log(`✅ | ${client.user.username} initialized`)
    }
}