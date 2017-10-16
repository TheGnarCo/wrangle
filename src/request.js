import fetch from 'isomorphic-fetch';
import { isUndefined, omitBy } from 'lodash';

export default class Request {
  static send = (options) => {
    const { body, endpoint, headers, method } = options;
    const requestAttributes = omitBy({ body, headers, method }, isUndefined);

    return fetch(endpoint, requestAttributes)
      .then((response) => {
        return response.json()
          .then((result) => {
            if (response.ok) {
              return result;
            }

            const error = { http_status: response.status, errors: result };

            throw error;
          });
      });
  }
}
