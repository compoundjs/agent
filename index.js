var Agent = require('./lib/agent.js');

exports.init = function(compound) {
    compound.on('ready', function() {
        var settings = compound.app.get('agent');
        compound.agent = new Agent(compound, settings);
    });
};
