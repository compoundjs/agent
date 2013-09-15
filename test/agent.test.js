var request = require('supertest');
var agent = require('../');

describe('agent', function() {
    var app, compound;

    before(function(done) {
        app = require('compound').createServer();
        app.enable('quiet');
        agent.init(app.compound);
        app.compound.on('ready', function(compound) {
            compound.map.get('/', 'ctl#action');
            compound.structure.controllers.ctl = Ctl;
            function Ctl(init) {
            };
            Ctl.prototype.action = function(c) {
                c.send('hi');
            };
            done();
        });
    });

    it('should collect information about request', function(done) {
        request(app).get('/').end(function(err, res) {
            setTimeout(done, 10);
        });
    });

});
