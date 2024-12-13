export const getValueIfTrue = <T, G>(fail: G, condition: boolean, val: T): G | T => (condition ? val : fail);
