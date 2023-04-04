export const removeSpecialChars =
  (str: string): string =>
    str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
