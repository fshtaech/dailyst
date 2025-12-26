export const getRandomArrayItem = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

export const getFirstObject = <T>(obj: {
  new (): T;
}): { key: string; value: T } => {
  const [key, value] = Object.entries(obj)[0];

  return { key, value };
};

export const getHTMLCharacterCount = (htmlString: string): number => {
  return htmlString.replace(/^(\\<\\\/?[A-z0-9]+\\>)|(\\\\[A-z]{1})$/, "")
    .length;
};
