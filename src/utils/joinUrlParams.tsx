import snakeCase from 'lodash/snakeCase';

type Params = Record<string, any>;

export const joinParams = (params: Params) =>
  Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => `${encodeURIComponent(snakeCase(k))}=${encodeURIComponent(params[k])}`)
    .join('&');

/**
 * @param {string} url
 * @param  {...Object} paramObjects
 */
const joinUrlParams = (url: string, ...paramObjects: Params[]) => {
  let result = url;
  paramObjects.forEach((params) => {
    if (params && Object.keys(params).length) {
      result = `${result}${result.includes('?') ? '&' : '?'}${joinParams(params)}`;
    }
  });

  return result;
};

export default joinUrlParams;
