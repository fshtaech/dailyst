export const getRandomArrayItem = <T>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

export const getFirstObject = <T>(obj: {
  new (): T;
}): { key: string; value: T } => {
  const [key, value] = Object.entries(obj)[0];

  return { key, value };
};
