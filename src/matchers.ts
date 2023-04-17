const INTEGER_REGEX = /^(-?[1-9][0-9]*|0)$/;
export const matchInteger = (param: string) => INTEGER_REGEX.test(param);
