class Context {
	_molecularCtx;
	params;
	call;
	mcall;

	constructor(ctx) {
		this._molecularCtx = ctx;
		this.params = ctx.params;
		this.call = ctx.call;
		this.mcall = ctx.mcall;
	}

	events = {
		emit: (eventName, params, data) => {
			return this._molecularCtx.call("events.emit", {
				data: { eventName: eventName, params: params, data: data },
			});
		},
	};

	queues = {
		push: (functionName, params) => {
			//Console to debug
			console.log("Queues Data", {
				functionName: functionName,
				params: params,
			});

			return this._molecularCtx.call("queues.push", {
				data: { functionName: functionName, params: params },
			});
		},
	};
}

module.exports = Context;
