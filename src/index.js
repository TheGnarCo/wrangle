import es6Promise from 'es6-promise';

import Request from './request';

es6Promise.polyfill();

class API {
  constructor ({ headers = {}, host, bearerTokenKeyInLocalStorage }) {
    this.bearerTokenKey = bearerTokenKeyInLocalStorage;
    this.instanceHeaders = { 'Content-Type': 'application/json', ...headers };
    this.host = host;
  }

  absolutePath = (path) => {
    return `${this.host}/${path}`;
  }

  bearerToken = () => {
    return global.window.localStorage.getItem(this.bearerTokenKey);
  }

  authenticatedHeaders = (overrideHeaders) => {
    return {
      Authorization: `Bearer ${this.bearerToken()}`,
      ...this.headers(overrideHeaders),
    };
  }

  headers = (overrideHeaders) => {
    return {
      ...this.instanceHeaders,
      ...overrideHeaders,
    };
  }

  authenticated = {
    delete: (path, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        endpoint,
        headers: this.authenticatedHeaders(headers),
        method: 'DELETE',
      });
    },
    get: (path, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        endpoint,
        headers: this.authenticatedHeaders(headers),
        method: 'GET',
      });
    },
    patch: (path, params, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        body: params,
        endpoint,
        headers: this.authenticatedHeaders(headers),
        method: 'PATCH',
      });
    },
    post: (path, params, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        body: params,
        endpoint,
        headers: this.authenticatedHeaders(headers),
        method: 'POST',
      });
    },
  }

  unauthenticated = {
    delete: (path, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        endpoint,
        headers: this.headers(headers),
        method: 'DELETE',
      });
    },
    get: (path, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        endpoint,
        headers: this.headers(headers),
        method: 'GET',
      });
    },
    patch: (path, params, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        body: params,
        endpoint,
        headers: this.headers(headers),
        method: 'PATCH',
      });
    },
    post: (path, params, headers = {}) => {
      const endpoint = this.absolutePath(path);

      return Request.send({
        body: params,
        endpoint,
        headers: this.headers(headers),
        method: 'POST',
      });
    },
  }
}

export default API;
