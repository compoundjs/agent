module.exports = Agent;

function Agent(compound, settings) {
    this.compound = compound;
    this.settings = settings;
    this.inititalize();
}

Agent.prototype.inititalize = function inititalize() {
    this.compound.on('request', function (req, res) {
        req.spy = new Spy(req, res);
    });
    this.compound.on('controller instance', function(ctl) {
        ctl.getLogger().on('beforeProcessing', function() {
            ctl.context.req.spy.attachController(ctl);
        });
    });
};

function Spy(req, res) {
    this.req = req;
    this.res = res;
    this.startTime = Date.now();
    this.ctl = null;
    this.initialize();
    this.controllerStartedAt = 0;
    this.history = [];
    this.render = null;
}

Spy.prototype.attachController = function attachController(ctl) {
    var spy = this;
    this.controllerStartedAt = Date.now();
    this.ctl = ctl;
    this.ctl.logger.on('afterHook', function(action, duration) {
        spy.history.push([action, duration]);
    });
    this.ctl.logger.on('render', function(file, layout, duration) {
        spy.render = {
            file: file,
            layout: layout,
            duration: duration
        };
    });
};

Spy.prototype.initialize = function initialize() {
    var spy = this;
    var end = spy.res.end;
    spy.res.end = function () {
        process.nextTick(function() {
            spy.end();
        });
        end.apply(spy.res, Array.prototype.slice.call(arguments));
    };
};

Spy.prototype.end = function() {
    console.log(this.controllerStartedAt - this.startTime);
    console.log(Date.now() - this.controllerStartedAt);
    console.log(Date.now() - this.startTime);
    console.log(this.history);
};
