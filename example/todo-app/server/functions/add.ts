module.exports = async function handler(ctx) {
  const { a, b } = ctx.params;
  console.log(
    await ctx.sdk.providers.get('dbClient').prisma.user.createMany({
      data: [
        {
          // name: 'Alice',
          title: 'sldfjkldsfjklj',
          votes: 81,
          status: false,
        },
      ],
    })
  );
};
