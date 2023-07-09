module.exports = async function getUser(ctx) {
  return {
    name: 'Viraj',
    id: '1',
  };
};
module.exports = async function login(ctx) {
  const { username, password } = ctx.params;
  const jwtToken = `${username}jwtToken`;
  return jwtToken;
};
