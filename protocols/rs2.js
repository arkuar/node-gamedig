const Valve = require('./valve');

class Rs2 extends Valve {
    constructor() {
        super();
    }

    async cleanup(state) {
        state.players = state.raw.players;
        delete state.raw.players;
    }
}

module.exports = Rs2;
