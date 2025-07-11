export default function fallback<T = unknown>(...values: T[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const value of values) {
      if (value !== undefined) return value;
    }
    return undefined;
  }
  