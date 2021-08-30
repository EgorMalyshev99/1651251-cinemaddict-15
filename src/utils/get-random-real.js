export const getRandomReal = (min = 0, max = 1, fix = 1) => (min + Math.random() * (max - min)).toFixed(fix);
