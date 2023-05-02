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
		emit: (eventName, params) => {
			return this._ctx.call("events.emit", {
				eventName,
				params,
			});
			// return this._ctx.call("events.emit", {
			// 	data: { eventName: eventName, params: params, data: data },
			// });
		},
	};

	queue = {
		push: () => {},
	};
}

module.exports = Ctx;
