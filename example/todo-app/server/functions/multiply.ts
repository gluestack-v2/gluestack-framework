module.exports = async function handler(ctx) {
  const data = await ctx.db.user.create({
    data: {
      title: 'Ceo',
      votes: 899,
      status: false,
    },
  });
  return data;
};
