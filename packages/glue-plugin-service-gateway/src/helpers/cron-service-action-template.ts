const template = () => ` 
**--- Action CallMethod ---**: {
  handler(ctx) {
    return ctx.call("**--- Service Method ---**", **--- Action Data ---**).then((res) => res);
  },
},

 `;

export default template;
