export default function replaceHandlerNames(str: string) {
  const regex = /"handler":\s*"([^"]*)"/g;
  return str.replace(regex, '"handler": $1');
}
