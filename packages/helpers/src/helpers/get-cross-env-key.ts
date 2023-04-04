export const getCrossEnvKey = (instance: string, key: string): string => {
  return `${getPrefix(instance)}_${key}`;
};

export const getPrefix = (instance: string): string => {
  return instance.replace(/[^\w\s]/gi, "").toUpperCase();
};
