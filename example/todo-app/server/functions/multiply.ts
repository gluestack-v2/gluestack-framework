module.exports = async function handler(ctx) {
  const data = await ctx.sdk.db.user.create({
    data: {
      title: 'Ceo',
      votes: 899,
      status: false,
    },
  });
  return data;
};
