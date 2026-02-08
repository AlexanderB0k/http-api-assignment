const respond = (request, response, status, content, type) => {
  let responseContent = '';

  // Create the response content first
  if (type === 'application/json') {
    responseContent = JSON.stringify(content);
  } else if (type === 'text/xml') {
    responseContent = '<response>';
    responseContent += `<message>${content.message}</message>`;
    responseContent += `<id>${content.id}</id>`;
    responseContent += '</response>';
  }else {
    responseContent = content.message;
  }


  const headers = {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(responseContent, 'utf8'),
  };

  response.writeHead(status, headers);
  response.write(responseContent);
  response.end();
};

//The response for a successful request
const success = (request, response, acceptedTypes) => {

  const responseData = {
    message: 'This is a successful response.',
    id: 'Success',
  };

  return respond(request, response, 200, responseData, acceptedTypes[0]);
};


//bad request with two different response datas
const badRequest = (request, response, acceptedTypes, params) => {
  let responseData = {
    message: 'Missing valid query parameter set to true.',
    id: 'Bad Request',
  };
  let responseData2 = {
    message: 'This request has the required parameters.',
  };

  if(!params || params.get('valid') !== 'true') {
    return respond(request, response, 400, responseData2, acceptedTypes[0]);
  }

  return respond(request, response, 200, responseData2, acceptedTypes[0]);
};

//same things with badRequest
const Unauthorized = (request, response, acceptedTypes, params) => {

  let responseData = {
    message : 'You have sucessfully viewed the content.',
  };
  let responseData2 = {
    message: 'Missing loggedIn query parameter set to yes.',
    id: 'Unauthorized',
  };

  if(!params || params.get('loggedIn') !== 'yes') {
    return respond(request, response, 401, responseData2, acceptedTypes[0]);
  }

  return respond(request, response, 200, responseData, acceptedTypes[0]);
};

const forbidden = (request, response, acceptedTypes) => {

  const responseData = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };
  return respond(request, response, 403, responseData, acceptedTypes[0]);
};

const internal = (request, response, acceptedTypes) => {
  const responseData = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'Internal Error',
  };
  return respond(request, response, 500, responseData, acceptedTypes[0]);
};

const notImplemented = (request, response, acceptedTypes) => {
  const responseData = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'Not Implemented',
  };
  return respond(request, response, 501, responseData, acceptedTypes[0]);
}

const notFound = (request, response, acceptedTypes) => {
  const responseData = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(request, response, 404, responseData, acceptedTypes[0]);
};

module.exports = {
  success,
  notFound,
  badRequest,
  Unauthorized,
  forbidden,
  internal,
  notImplemented,
};

