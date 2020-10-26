const Valve = require('./valve');

class Rs2 extends Valve {
    constructor() {
        super();
    }

    async cleanup(state) {

        const openConnections = +state.raw.rules.NumOpenPublicConnections;
        const totalPlayerCount = +state.raw.rules.PI_COUNT;
        const steamPlayerCount = state.raw.players.length;

        // Check if there are any connections to the server.
        // Total server count may be greater than 0 even if there are no players in the server
        if (openConnections < state.maxplayers && totalPlayerCount > 0) {
            
            // Epic players are not included in the players array but can be found in rules.
            const epicPlayers = Object.keys(state.raw.rules)
                .filter(k => state.raw.rules[k] === "EOS")
                .map(p => +p.split("PI_P_")[1])
                .sort((a, b) => a - b) // Sort players since the data may contain players that are not in the server.
                .slice(0, totalPlayerCount - steamPlayerCount) // Discard leftover data
                .map(i => ({ name: state.raw.rules[`PI_N_${i}`], time: 0, score: state.raw.rules[`PI_S_${i}`] }))
                .filter((player, index, arr) => arr.findIndex(p => p.name === player.name) === index);

            state.players = state.raw.players.concat(epicPlayers);
        } else {
            state.players = state.raw.players;
        }
        delete state.raw.players;

        state.raw.numplayers = state.players.length;
    }
}

module.exports = Rs2;
