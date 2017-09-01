import expect from 'expect';

import API from '../src';
import createRequestMock from './helpers/create_request_mock';

describe('API', () => {
  const host = 'http://www.example.com';

  describe('Setup', () => {
    describe('#absolutePath', () => {
      it('combines the host and the path', () => {
        const instance = new API(host);
        const path = 'my-path';

        expect(instance.absolutePath(path)).toEqual('http://www.example.com/my-path');
      });
    });

    describe('#setBearerToken', () => {
      it('sets the bearerToken attribute on the API instance', () => {
        const instance = new API(host);

        instance.setBearerToken('bearerToken');

        expect(instance.bearerToken).toEqual('bearerToken');
      });
    });

    describe('#removeBearerToken', () => {
      it('removes the bearerToken attribute from the API instance', () => {
        const instance = new API(host);

        instance.setBearerToken('bearerToken');

        expect(instance.bearerToken).toEqual('bearerToken');

        instance.removeBearerToken();

        expect(instance.bearerToken).toNotExist();
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

        const instance = new API(host);

        return instance.unauthenticated.get('users')
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('throws the response when the API call is not successful', () => {
        const request = createRequestMock({
          host,
          method: 'get',
          path: '/users',
          responseStatus: 422,
        });

        const instance = new API(host);

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

        const instance = new API(host);

        return instance.unauthenticated.delete('users/1')
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('throws the response when the API call is not successful', () => {
        const request = createRequestMock({
          host,
          method: 'delete',
          path: '/users/1',
          responseStatus: 404,
        });

        const instance = new API(host);

        return instance.unauthenticated.delete('users/1')
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });

    describe('PATCH requests', () => {
      it('calls the endpoint with the correct parameters', () => {
        const mockResponse = { first_name: 'The', last_name: 'Gnar' };
        const request = createRequestMock({
          host,
          method: 'patch',
          params: { last_name: 'Gnar' },
          path: '/users/1',
          response: mockResponse,
        });

        const instance = new API(host);

        return instance.unauthenticated.patch('users/1', { last_name: 'Gnar' })
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('throws the response when the API call is not successful', () => {
        const request = createRequestMock({
          host,
          method: 'patch',
          params: { last_name: 'Gnar' },
          path: '/users/1',
          responseStatus: 404,
        });

        const instance = new API(host);

        return instance.unauthenticated.patch('users/1', { last_name: 'Gnar' })
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });

    describe('POST requests', () => {
      it('calls the endpoint with the correct parameters', () => {
        const mockResponse = { first_name: 'The', last_name: 'Gnar' };
        const request = createRequestMock({
          host,
          method: 'post',
          params: { last_name: 'Gnar' },
          path: '/users',
          response: mockResponse,
        });

        const instance = new API(host);

        return instance.unauthenticated.post('users', { last_name: 'Gnar' })
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('throws the response when the API call is not successful', () => {
        const request = createRequestMock({
          host,
          method: 'post',
          params: { last_name: 'Gnar' },
          path: '/users',
          responseStatus: 404,
        });

        const instance = new API(host);

        return instance.unauthenticated.post('users', { last_name: 'Gnar' })
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });
  });

  describe('Authenticated requests', () => {
    const bearerToken = 'bearerToken';
    const instance = new API(host);

    beforeEach(() => instance.setBearerToken('bearerToken'));
    afterEach(() => instance.removeBearerToken());

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
        const request = createRequestMock({
          bearerToken,
          host,
          method: 'patch',
          params: { last_name: 'Gnar' },
          path: '/users/1',
          response: mockResponse,
        });

        return instance.authenticated.patch('users/1', { last_name: 'Gnar' })
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
          });
      });

      it('throws the response when the API call is not successful', () => {
        const request = createRequestMock({
          bearerToken,
          host,
          method: 'patch',
          params: { last_name: 'Gnar' },
          path: '/users/1',
          responseStatus: 404,
        });

        return instance.authenticated.patch('users/1', { last_name: 'Gnar' })
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

        return instance.authenticated.post('users', { last_name: 'Gnar' })
          .then((response) => {
            expect(request.isDone()).toEqual(true);
            expect(response).toEqual(mockResponse);
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

        return instance.authenticated.post('users', { last_name: 'Gnar' })
          .catch(() => expect(request.isDone()).toEqual(true));
      });
    });
  });
});
