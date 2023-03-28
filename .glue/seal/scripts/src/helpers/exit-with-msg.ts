
export const exitWithMsg = async (
  msg: unknown, code: number = -1
): Promise<void> => {
  console.log(msg);
  process.exit(code);
};
