/** @module helpers */

export const functionOrDefault = (f, fdefault) => {
  if (typeof f === 'function') {
    return f;
  }

  return fdefault;
};