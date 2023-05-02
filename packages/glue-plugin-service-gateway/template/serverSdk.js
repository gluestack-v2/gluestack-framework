class Ctx {
	_ctx;
	params;
	call;
	mcall;

	constructor(ctx) {
		this._ctx = ctx;
		this.params = ctx.params;
		this.call = ctx.call;
		this.mcall = ctx.mcall;
	}

	events = {
		emit: (eventName, params, data) => {
			console.log(eventName, params, data);
			return this._ctx.call("events.emit", {
				data: { eventName: eventName, params: params, data: data },
			});
		},
	};

	queues = {
		push: (functionName, params) => {
			// Uncomment to debug
			// console.log("Queues Data", {
			// 	functionName: functionName,
			// 	params: params,
			// });

			return this._ctx.call("queues.push", {
				data: { functionName: functionName, params: params },
			});
		},
	};
}

module.exports = Ctx;