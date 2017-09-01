# Schlepp

[![CircleCI](https://circleci.com/gh/TheGnarCo/schlepp/tree/master.svg?style=svg)](https://circleci.com/gh/TheGnarCo/schlepp/tree/master)

[![Coverage Status](https://coveralls.io/repos/github/TheGnarCo/schlepp/badge.svg?branch=master)](https://coveralls.io/github/TheGnarCo/schlepp?branch=master)

API client used for making authenticated JSON requests using a JWT bearer token to a
specified endpoint. Unauthenticated requests are also supported.

This API client follows the convention of storing the bearer token in local
storage. When creating an instance of the API client, pass the function the name
of the key in local storage to use when retrieving the bearer token for
authenticated requests.

## Setup

Create an instance of Schlepp passing in your API host and local storage bearer token key

```js
import Schlepp from 'schlepp';

const api = new Schlepp(
  bearerTokenKeyInLocalStorage: 'auth_token', // assumes localStorage.getItem('auth_token') will return the bearer token
  host: 'https://example.com',
);
```

## Usage

Use the `authenticated` and `unauthenticated` objects to send an HTTP request to
the server. Both objects expose the same HTTP method functions (`get`, `delete`,
`post`, `patch`).

The difference between the `authenticated` and `unauthenticated` request is that the `authenticated` requests include an `Authorization` header: (`{ Authorization: 'Bearer my-bearer-token' }`).

## Examples

### Unauthenticated requests

```js
import Schlepp from 'schlepp';

const api = new Schlepp(
  bearerTokenKeyInLocalStorage: 'auth_token',
  host: 'https://example.com',
);

api.unauthenticated.get('posts?title=Unicorns');
api.unauthenticated.delete('users/1');
api.unauthenticated.post('users', { first_name: 'Charlie', last_name: 'Brown' });
api.unauthenticated.patch('users/1', { last_name: 'Chaplin' });
```

### Authenticated requests

```js
import Schlepp from 'schlepp';

const api = new Schlepp(
  bearerTokenKeyInLocalStorage: 'auth_token',
  host: 'https://example.com',
);

api.authenticated.get('posts?title=Unicorns');
api.authenticated.delete('users/1');
api.authenticated.post('users', { first_name: 'Charlie', last_name: 'Brown' });
api.authenticated.patch('users/1', { last_name: 'Chaplin' });
```
