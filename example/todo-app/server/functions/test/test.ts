module.exports = async function handler(ctx) {
  return await ctx.db.user.findMany();
};
