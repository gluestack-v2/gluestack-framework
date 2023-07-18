const getPathAfterString = (inputString: string, matchString: string) => {
  const functionsDirectory = matchString;
  const startIndex =
    inputString.indexOf(functionsDirectory) + functionsDirectory.length;
  return inputString.slice(startIndex);
};

export default getPathAfterString;
