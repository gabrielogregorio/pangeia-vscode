export const excludeCommonItems = (list1: string[], list2: string[]): string[] => {
  const set2 = new Set(list2);
  return list1.filter((item) => !set2.has(item));
};
