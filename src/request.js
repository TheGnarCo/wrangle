import fetch from 'isomorphic-fetch';
import { isUndefined, omitBy } from 'lodash';

export default class Request {
  constructor (options) {
    this.body = options.body;
    this.endpoint = options.endpoint;
    this.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    };
    this.method = options.method;
  }

  get requestAttributes () {
    const { body, credentials, headers, method } = this;

    return omitBy({ body, credentials, headers, method }, isUndefined);
  }

  send () {
    const { endpoint, requestAttributes } = this;

    return fetch(endpoint, requestAttributes)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw response;
      });
  }
}
