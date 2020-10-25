const Valve = require('./valve');

class Rs2 extends Valve {
    constructor() {
        super();
    }

    async cleanup(state) {
        // Epic players are not included in the players array but can be found in rules.
        const epicPlayers = Object.keys(state.raw.rules)
            .filter((key) => state.raw.rules[key] === "EOS")
            .map((platformKey) => state.raw.rules[platformKey.replace("PI_P", "PI_N")])
            .map(player => ({ name: player, score: 0, time: 0 })); // No way to get score or time for epic players?

        state.players = state.raw.players.concat(epicPlayers);
        delete state.raw.players;
    }
}

module.exports = Rs2;
