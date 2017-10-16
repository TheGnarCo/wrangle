import nock from 'nock';

const createRequestMock = ({ bearerToken, headers = {}, host, method, params, path, responseStatus = 200, response }) => {
  const authorizedHeaders = { Authorization: `Bearer ${bearerToken}`, ...headers };
  const req = bearerToken ? nock(host, { reqheaders: authorizedHeaders }) : nock(host, { reqHeaders: headers });

  if (params) {
    return req[method](path, JSON.stringify(params))
      .reply(responseStatus, response);
  }

  if (responseStatus >= 300) {
    return req[method](path)
      .replyWithError(response);
  }

  return req[method](path)
    .reply(responseStatus, response);
};

export default createRequestMock;
