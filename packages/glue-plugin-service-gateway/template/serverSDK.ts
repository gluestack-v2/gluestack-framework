class ServerSDK {
	_ctx: any;
	params: any;
	call: any;
	mcall: any;
	events: any;
	constructor(ctx) {
		this._ctx = ctx;
		this.params = ctx.params;
		this.call = ctx.call;
		this.mcall = ctx.mcall;
	}

	queue = {
		push: () => {},
	};
}
