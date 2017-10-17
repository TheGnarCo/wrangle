import expect, { restoreSpies, spyOn } from 'expect';

import API from '../src';
import createRequestMock from './helpers/create_request_mock';
import Request from '../src/request';

describe('API', () => {
  const bearerTokenKeyInLocalStorage = 'auth_token';
  const host = 'http://www.example.com';

  afterEach(() => restoreSpies());

  describe('Setup', () => {
    describe('#absolutePath', () => {
      it('combines the host and the path', () => {
        const instance = new API({ host, bearerTokenKeyInLocalStorage });
        const path = 'my-path';

        expect(instance.absolutePath(path)).toEqual('http://www.example.com/my-path');
      });
    });

    describe('#authenticatedHeaders', () => {
      beforeEach(() => global.window.localStorage.setItem(bearerTokenKeyInLocalStorage, 'bearer-token'));
      afterEach(() => global.window.localStorage.removeItem(bearerTokenKeyInLocalStorage));

      context('when no headers have been set when the API client is instantiated', () => {
        it('returns the default headers for Authorization & Content-Type', () => {
          const instance = new API({ host, bearerTokenKeyInLocalStorage });

          expect(instance.authenticatedHeaders()).toEqual({
            Authorization: 'Bearer bearer-token',
            'Content-Type': 'application/json',
          });
        });
      });

      context('when headers are set when the API client is instantiated', () => {
        it('adds the headers to the default headers', () => {
          const headers = { foo: 'bar' };
          const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });

          expect(instance.authenticatedHeaders()).toEqual({
            Authorization: 'Bearer bearer-token',
            'Content-Type': 'application/json',
            foo: 'bar',
          });
        });

        it('overrides the default headers', () => {
          const headers = { 'Content-Type': 'text/plain' };
          const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });

          expect(instance.authenticatedHeaders()).toEqual({
            Authorization: 'Bearer bearer-token',
            'Content-Type': 'text/plain',
          });
        });

        context('when override headers are provided', () => {
          it('adds the headers to the default and instance headers', () => {
            const headers = { 'Content-Type': 'text/plain' };
            const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });
            const overrideHeaders = { baz: 'qux' };

            expect(instance.authenticatedHeaders(overrideHeaders)).toEqual({
              Authorization: 'Bearer bearer-token',
              baz: 'qux',
              'Content-Type': 'text/plain',
            });
          });

          it('overrides the default and instance headers', () => {
            const headers = { 'Content-Type': 'text/plain' };
            const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });
            const overrideHeaders = { 'Content-Type': 'application/xml' };

            expect(instance.authenticatedHeaders(overrideHeaders)).toEqual({
              Authorization: 'Bearer bearer-token',
              'Content-Type': 'application/xml',
            });
          });
        });
      });
    });

    describe('#bearerToken', () => {
      context('when the bearer token is set in local storage', () => {
        beforeEach(() => global.window.localStorage.setItem(bearerTokenKeyInLocalStorage, 'bearer-token'));
        afterEach(() => global.window.localStorage.removeItem(bearerTokenKeyInLocalStorage));

        it('returns the bearer token from local storage', () => {
          const instance = new API({ host, bearerTokenKeyInLocalStorage });

          expect(instance.bearerToken()).toEqual('bearer-token');
        });
      });

      context('when the bearer token is not set in local storage', () => {
        it('returns null', () => {
          const instance = new API({ host, bearerTokenKeyInLocalStorage });

          expect(instance.bearerToken()).toEqual(null);
        });
      });
    });

    describe('#headers', () => {
      context('when no headers have been set when the API client is instantiated', () => {
        it('returns the default headers for Content-Type', () => {
          const instance = new API({ host, bearerTokenKeyInLocalStorage });

          expect(instance.headers()).toEqual({ 'Content-Type': 'application/json' });
        });
      });

      context('when headers are set when the API client is instantiated', () => {
        it('adds the headers to the default headers', () => {
          const headers = { foo: 'bar' };
          const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });

          expect(instance.headers()).toEqual({
            foo: 'bar',
            'Content-Type': 'application/json',
          });
        });

        it('overrides the default headers', () => {
          const headers = { 'Content-Type': 'text/plain' };
          const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });

          expect(instance.headers()).toEqual({ 'Content-Type': 'text/plain' });
        });

        context('when override headers are provided', () => {
          it('adds the override headers to the instance headers', () => {
            const headers = { 'Content-Type': 'text/plain' };
            const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });
            const overrideHeaders = { foo: 'bar' };

            expect(instance.headers(overrideHeaders)).toEqual({
              'Content-Type': 'text/plain',
              foo: 'bar',
            });
          });

          it('overrides the instance headers', () => {
            const headers = { 'Content-Type': 'text/plain' };
            const instance = new API({ headers, host, bearerTokenKeyInLocalStorage });
            const overrideHeaders = { 'Content-Type': 'application/xml' };

            expect(instance.headers(overrideHeaders)).toEqual({
              'Content-Type': 'application/xml',
            });
          });
        });
      });
    });
  });

  describe('Unauthenticated requests', () => {
    describe('GET requests', () => {
      it('calls the endpoint with the correct parameters', () => {
        const mockResponse = [{ first_name: 'Gnar' }];
        const request = createRequestMock({
          host,
          method: 'get',
          path: '/users',
          response: mockResponse,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.get('users')
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('sends the correct headers', () => {
        spyOn(Request, 'send').andReturn(Promise.resolve());

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.get('users', { foo: 'bar' })
          .then(() => {
            return expect(Request.send).toHaveBeenCalledWith({
              endpoint: `${host}/users`,
              headers: {
                'Content-Type': 'application/json',
                foo: 'bar',
              },
              method: 'GET',
            });
          });
      });

      it('throws the response when the API call is not successful', () => {
        const request = createRequestMock({
          host,
          method: 'get',
          path: '/users',
          responseStatus: 422,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.get('users')
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });

    describe('DELETE requests', () => {
      it('calls the endpoint with the correct parameters', () => {
        const mockResponse = {};
        const request = createRequestMock({
          host,
          method: 'delete',
          path: '/users/1',
          response: mockResponse,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.delete('users/1')
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('sends the correct headers', () => {
        spyOn(Request, 'send').andReturn(Promise.resolve());

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.delete('users/1', { foo: 'bar' })
          .then(() => {
            return expect(Request.send).toHaveBeenCalledWith({
              endpoint: `${host}/users/1`,
              headers: {
                'Content-Type': 'application/json',
                foo: 'bar',
              },
              method: 'DELETE',
            });
          });
      });

      it('throws the response when the API call is not successful', () => {
        const request = createRequestMock({
          host,
          method: 'delete',
          path: '/users/1',
          responseStatus: 404,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.delete('users/1')
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });

    describe('PATCH requests', () => {
      it('calls the endpoint with the correct parameters', () => {
        const mockResponse = { first_name: 'The', last_name: 'Gnar' };
        const params = JSON.stringify(mockResponse);
        const request = createRequestMock({
          host,
          method: 'patch',
          params,
          path: '/users/1',
          response: mockResponse,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.patch('users/1', params)
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('sends the correct headers', () => {
        spyOn(Request, 'send').andReturn(Promise.resolve());

        const instance = new API({ host, bearerTokenKeyInLocalStorage });
        const params = JSON.stringify({ last_name: 'Gnar' });

        return instance.unauthenticated.patch('users/1', params, { foo: 'bar' })
          .then(() => {
            return expect(Request.send).toHaveBeenCalledWith({
              body: params,
              endpoint: `${host}/users/1`,
              headers: {
                'Content-Type': 'application/json',
                foo: 'bar',
              },
              method: 'PATCH',
            });
          });
      });

      it('throws the response when the API call is not successful', () => {
        const params = JSON.stringify({ last_name: 'Gnar' });
        const request = createRequestMock({
          host,
          method: 'patch',
          params,
          path: '/users/1',
          responseStatus: 404,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.patch('users/1', params)
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });

    describe('POST requests', () => {
      it('calls the endpoint with the correct parameters', () => {
        const mockResponse = { first_name: 'The', last_name: 'Gnar' };
        const params = JSON.stringify(mockResponse);
        const request = createRequestMock({
          host,
          method: 'post',
          params,
          path: '/users',
          response: mockResponse,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.post('users', params)
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('sends the correct headers', () => {
        spyOn(Request, 'send').andReturn(Promise.resolve());

        const instance = new API({ host, bearerTokenKeyInLocalStorage });
        const params = JSON.stringify({ last_name: 'Gnar' });

        return instance.unauthenticated.post('users/1', params, { foo: 'bar' })
          .then(() => {
            return expect(Request.send).toHaveBeenCalledWith({
              body: params,
              endpoint: `${host}/users/1`,
              headers: {
                'Content-Type': 'application/json',
                foo: 'bar',
              },
              method: 'POST',
            });
          });
      });

      it('throws the response when the API call is not successful', () => {
        const params = JSON.stringify({ last_name: 'Gnar' });
        const request = createRequestMock({
          host,
          method: 'post',
          params,
          path: '/users',
          responseStatus: 404,
        });

        const instance = new API({ host, bearerTokenKeyInLocalStorage });

        return instance.unauthenticated.post('users', params)
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });
  });

  describe('Authenticated requests', () => {
    const bearerToken = 'bearerToken';
    const instance = new API({ host, bearerTokenKeyInLocalStorage });

    describe('When the bearer token is added after instance is created', () => {
      it('calls the endpoint with the correct parameters', () => {
        const mockResponse = [{ first_name: 'Gnar' }];
        const request = createRequestMock({
          bearerToken,
          host,
          method: 'get',
          path: '/users',
          response: mockResponse,
        });

        expect(instance.bearerToken()).toNotExist();

        global.window.localStorage.setItem(bearerTokenKeyInLocalStorage, bearerToken);

        return instance.authenticated.get('users')
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });
    });

    describe('When the bearer token is set in local storage', () => {
      beforeEach(() => global.window.localStorage.setItem(bearerTokenKeyInLocalStorage, bearerToken));
      afterEach(() => global.window.localStorage.removeItem(bearerTokenKeyInLocalStorage));

      describe('GET requests', () => {
        it('calls the endpoint with the correct parameters', () => {
          const mockResponse = [{ first_name: 'Gnar' }];
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'get',
            path: '/users',
            response: mockResponse,
          });

          return instance.authenticated.get('users')
            .then((response) => {
              expect(request.isDone()).toEqual(true);
              expect(response).toEqual(mockResponse);
            });
        });

        it('sends the correct headers', () => {
          spyOn(Request, 'send').andReturn(Promise.resolve());

          return instance.authenticated.get('users', { foo: 'bar' })
            .then(() => {
              return expect(Request.send).toHaveBeenCalledWith({
                endpoint: `${host}/users`,
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                  'Content-Type': 'application/json',
                  foo: 'bar',
                },
                method: 'GET',
              });
            });
        });

        it('throws the response when the API call is not successful', () => {
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'get',
            path: '/users',
            responseStatus: 422,
          });

          return instance.authenticated.get('users')
            .catch(() => expect(request.isDone()).toEqual(true));
        });
      });

      describe('DELETE requests', () => {
        it('calls the endpoint with the correct parameters', () => {
          const mockResponse = {};
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'delete',
            path: '/users/1',
            response: mockResponse,
          });

          return instance.authenticated.delete('users/1')
            .then((response) => {
              expect(request.isDone()).toEqual(true);
              expect(response).toEqual(mockResponse);
            });
        });

        it('sends the correct headers', () => {
          spyOn(Request, 'send').andReturn(Promise.resolve());

          return instance.authenticated.delete('users/1', { foo: 'bar' })
            .then(() => {
              return expect(Request.send).toHaveBeenCalledWith({
                endpoint: `${host}/users/1`,
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                  'Content-Type': 'application/json',
                  foo: 'bar',
                },
                method: 'DELETE',
              });
            });
        });

        it('throws the response when the API call is not successful', () => {
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'delete',
            path: '/users/1',
            responseStatus: 404,
          });

          return instance.authenticated.delete('users/1')
            .catch(() => expect(request.isDone()).toEqual(true));
        });
      });

      describe('PATCH requests', () => {
        it('calls the endpoint with the correct parameters', () => {
          const mockResponse = { first_name: 'The', last_name: 'Gnar' };
          const params = JSON.stringify(mockResponse);
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'patch',
            params,
            path: '/users/1',
            response: mockResponse,
          });

          return instance.authenticated.patch('users/1', params)
            .then((response) => {
              expect(request.isDone()).toEqual(true);
              expect(response).toEqual(mockResponse);
            });
        });

        it('sends the correct headers', () => {
          spyOn(Request, 'send').andReturn(Promise.resolve());

          const params = JSON.stringify({ last_name: 'Gnar' });

          return instance.authenticated.patch('users/1', params, { foo: 'bar' })
            .then(() => {
              return expect(Request.send).toHaveBeenCalledWith({
                body: params,
                endpoint: `${host}/users/1`,
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                  'Content-Type': 'application/json',
                  foo: 'bar',
                },
                method: 'PATCH',
              });
            });
        });

        it('throws the response when the API call is not successful', () => {
          const params = JSON.stringify({ last_name: 'Gnar' });
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'patch',
            params,
            path: '/users/1',
            responseStatus: 404,
          });

          return instance.authenticated.patch('users/1', params)
            .catch(() => expect(request.isDone()).toEqual(true));
        });
      });

      describe('POST requests', () => {
        it('calls the endpoint with the correct parameters', () => {
          const mockResponse = { first_name: 'The', last_name: 'Gnar' };
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'post',
            params: { last_name: 'Gnar' },
            path: '/users',
            response: mockResponse,
          });

          return instance.authenticated.post('users', JSON.stringify({ last_name: 'Gnar' }))
            .then((response) => {
              expect(request.isDone()).toEqual(true);
              expect(response).toEqual(mockResponse);
            });
        });

        it('sends the correct headers', () => {
          spyOn(Request, 'send').andReturn(Promise.resolve());

          const params = JSON.stringify({ last_name: 'Gnar' });

          return instance.authenticated.post('users/1', params, { foo: 'bar' })
            .then(() => {
              return expect(Request.send).toHaveBeenCalledWith({
                body: params,
                endpoint: `${host}/users/1`,
                headers: {
                  Authorization: `Bearer ${bearerToken}`,
                  'Content-Type': 'application/json',
                  foo: 'bar',
                },
                method: 'POST',
              });
            });
        });

        it('throws the response when the API call is not successful', () => {
          const request = createRequestMock({
            bearerToken,
            host,
            method: 'post',
            params: { last_name: 'Gnar' },
            path: '/users',
            responseStatus: 404,
          });

          return instance.authenticated.post('users', JSON.stringify({ last_name: 'Gnar' }))
            .catch(() => expect(request.isDone()).toEqual(true));
        });
      });
    });
  });
});
