const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const base = alphabet.length;

export const encodeBase62 = (num: number): string => {
  if (num === 0) return alphabet[0]!;
  let result = '';
  let n = num;
  while (n > 0) {
    const rem = n % base;
    result = alphabet[rem]! + result;
    n = Math.floor(n / base);
  }
  return result;
};

export const generateShortCode = (length = 6): string => {
  const max = Math.pow(base, length) - 1;
  const randomNum = Math.floor(Math.random() * max);
  const code = encodeBase62(randomNum);
  if (code.length >= length && code.length <= 8) return code;
  if (code.length < length) {
    return code.padEnd(length, alphabet[Math.floor(Math.random() * base)]!);
  }
  return code.slice(0, 8);
};

