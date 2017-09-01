import es6Promise from 'es6-promise';

import Request from './request';

es6Promise.polyfill();

class API {
  constructor ({ host, bearerTokenKeyInLocalStorage }) {
    this.bearerTokenKey = bearerTokenKeyInLocalStorage;
    this.host = host;
  }

  absolutePath = (path) => {
    return `${this.host}/${path}`;
  }

  get bearerToken () {
    return global.window.localStorage.getItem(this.bearerTokenKey);
  }

  authenticatedHeaders = {
    Authorization: `Bearer ${this.bearerToken}`,
  }

  authenticated = {
    delete: (path) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        endpoint,
        headers: this.authenticatedHeaders,
        method: 'DELETE',
      });

      return request.send();
    },
    get: (path) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        endpoint,
        headers: this.authenticatedHeaders,
        method: 'GET',
      });

      return request.send();
    },
    patch: (path, params) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        body: JSON.stringify(params),
        endpoint,
        headers: this.authenticatedHeaders,
        method: 'PATCH',
      });

      return request.send();
    },
    post: (path, params) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        body: JSON.stringify(params),
        endpoint,
        headers: this.authenticatedHeaders,
        method: 'POST',
      });

      return request.send();
    },
  }

  unauthenticated = {
    delete: (path) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        endpoint,
        method: 'DELETE',
      });

      return request.send();
    },
    get: (path) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        endpoint,
        method: 'GET',
      });

      return request.send();
    },
    patch: (path, params) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        body: JSON.stringify(params),
        endpoint,
        method: 'PATCH',
      });

      return request.send();
    },
    post: (path, params) => {
      const endpoint = this.absolutePath(path);

      const request = new Request({
        body: JSON.stringify(params),
        endpoint,
        method: 'POST',
      });

      return request.send();
    },
  }
}

export default API;
