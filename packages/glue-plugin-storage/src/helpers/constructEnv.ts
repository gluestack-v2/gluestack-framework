export function constructEnv(json: any) {
  let env = "";
  Object.keys(json).map((key) => {
    env += `${key}=${json[key]}
`;
  });
  return env;
}
