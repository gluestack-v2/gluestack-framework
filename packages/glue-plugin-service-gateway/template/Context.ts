// @ts-nocheck
const ServerSdk = require("./ServerSdk.ts");

class Context {
	_molecularCtx;
	params;
	call;
	mcall;
	sdk;

	constructor(ctx) {
		this._molecularCtx = ctx;
		this.params = ctx.params;
		this.call = ctx.call;
		this.mcall = ctx.mcall;
		this.sdk = ServerSdk.getInstance();
	}

	events = {
		emit: (eventName, params) => {
			return this._molecularCtx.call("events.emit", {
				eventName: eventName,
				params: params,
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
