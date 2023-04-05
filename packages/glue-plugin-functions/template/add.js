module.exports = async function handler(ctx) {
  const { a, b } = ctx.params;
  return a + b;
};
