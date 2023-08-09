module.exports = async function handler(ctx) {
  const { a, b } = ctx.paramse;
  return a + b;
};
