const template = () => ` 
**--- Action CallMethod ---**: {
  handler(ctx) {
    ctx.call("**--- Service Method ---**", **--- Action Data ---**).then((res) =>
      console.log("Result: ", res)
    );
  },
},

 `;

export default template;
