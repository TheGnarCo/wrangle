import Request from './request';

class API {
  constructor (host) {
    this.host = host;
  }

  absolutePath = (path) => {
    return `${this.host}/${path}`;
  }

  setBearerToken = (bearerToken) => {
    this.bearerToken = bearerToken;
  }

  removeBearerToken = () => {
    this.bearerToken = null;
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
