export const StringUtils = {
  startsWith: (str: string, searchStrings: Array<string>): boolean => {
    for (let i = 0; i < searchStrings.length; i++) {
      let searchString = searchStrings[i];
      if (str.startsWith(searchString)) {
        return true;
      }
    }
    return false;
  },
  hash: (str: string): number => {
    let hash: number = 0;
    if (str.length === 0) return hash;

    for (let i = 0; i < str.length; i++) {
      let char: number = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }
};