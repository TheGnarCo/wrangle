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
  headers: { Accept: 'application/json' }, // default is { 'Content-Type': 'application/json' }
  host: 'https://example.com',
);
```

## Usage

Use the `authenticated` and `unauthenticated` objects to send an HTTP request to
the server. Both objects expose the same HTTP method functions (`get`, `delete`,
`post`, `patch`).

The difference between the `authenticated` and `unauthenticated` request is that the `authenticated` requests include an `Authorization` header: (`{ Authorization: 'Bearer my-bearer-token' }`).


### Request methods

The following request methods can be performed as either authenticated or
unauthenticated requests

### #delete

```js
delete = (path: string, headers?: object = {}) => promise

// Example:
api.authenticated.delete('users/1', { Accept: 'application/json' });
api.unauthenticated.delete('users/1');
```

### #get

```js
get = (path: string, headers?: object = {}) => promise

// Example:
api.authenticated.get('users');
api.unauthenticated.get('users', { Accept: 'application/json' });
```

### #patch

```js
patch = (path: string, params: object, headers?: object = {}) => promise

// Example:
api.authenticated.patch('users/1', { first_name: 'Mike' });
api.unauthenticated.patch(
  '/users/1',
  { first_name: 'Mike' },
  { Accept: 'application/json' },
);
```

### #post

```js
post = (path: string, params: object, headers?: object = {}) => promise

// Example:
api.authenticated.post('comments', { comment: 'This is neat!' });
api.unauthenticated.post(
  'comments',
  { comment: 'This is neat!' },
  { Accept: 'application/json' },
);
```

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

### Specifying headers

By default, request headers will be set to `{ 'Content-Type': 'application/json'
}`. Request headers can be amended/overridden in 2 ways.

**1) Instantiating the class with headers**

If you'd like to set headers to be used across all requests made by the API
client, you may want to set headers when creating an instance of the Schlepp
class.

```js
import Schlepp from 'schlepp';

const api = new Schlepp(
  bearerTokenKeyInLocalStorage: 'auth_token',
  headers: { Accept: 'application/json' },
  host: 'https://example.com',
);

// in the above example all requests send from the `api` constant will include the following headers:
// { Accept: 'application/json', 'Content-Type': 'application/json' }

import Schlepp from 'schlepp';

const api = new Schlepp(
  bearerTokenKeyInLocalStorage: 'auth_token',
  headers: { 'Content-Type': 'text/plain' },
  host: 'https://example.com',
);

// in the above example all requests send from the `api` constant will include the following headers:
// { 'Content-Type': 'text/plain' }
```

**2) Setting headers on each request**

To override or amend the default or instance headers, you can specify the
headers of an individual request.

```js
import Schlepp from 'schlepp';

const api = new Schlepp(
  bearerTokenKeyInLocalStorage: 'auth_token',
  headers: { Accept: 'text/plain' },
  host: 'https://example.com',
);

api.unauthenticated.get('users', { Accept: 'application/json' });

// in the above example the request will include the following headers:
// { Accept: 'application/json', 'Content-Type': 'application/json' }

import Schlepp from 'schlepp';

const api = new Schlepp(
  bearerTokenKeyInLocalStorage: 'auth_token',
  host: 'https://example.com',
);

api.unauthenticated.get('users', { 'Content-Type': 'text/plain' });

// in the above example the request will include the following headers:
// { 'Content-Type': 'text/plain' }
```
