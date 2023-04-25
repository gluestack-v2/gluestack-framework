module.exports = async function handler(ctx) {
  // add your method logic here.
  const { message } = ctx.params;
  console.log(message);
};
