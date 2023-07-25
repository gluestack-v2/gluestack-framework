
  module.exports = async function handler(ctx) {
    const { query } = ctx.params;
    // const { prismaClient } = ctx.sdk;
    let resolvedQuery = ctx.sdk.providers.get('dbClient').prisma;

    query.forEach(async (q) => {
      if (q.type === "key") {
        resolvedQuery = resolvedQuery?.[q.key];
      }
      if (q.type === "function") {
        arguments = q.args || {};
        resolvedQuery = await resolvedQuery?.[q.key](arguments);
      }
    });
    return resolvedQuery;
  };
  