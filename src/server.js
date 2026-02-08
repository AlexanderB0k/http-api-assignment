const http = require('http');

const htmlResponses = require('./htmlResponses.js');
const responses = require('./Responses.js'); 

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const URLStruct = {
    '/': htmlResponses.getIndex,
    '/style.css': htmlResponses.getCSS,
    '/success': responses.success,
    '/badRequest': responses.badRequest,
    '/unauthorized': responses.Unauthorized,
    '/forbidden': responses.forbidden,
    '/internal': responses.internal,
    '/notImplemented': responses.notImplemented,
    notFound: responses.notFound,
    
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  // Default the response to a json 
  let acceptedTypes = ['application/json'];
  
  if (request.headers.accept) {
    acceptedTypes = request.headers.accept.split(',').map(type => type.trim());
  }

  // Get query parameters
  const params = parsedUrl.searchParams;

  if (URLStruct[parsedUrl.pathname]) {
    return URLStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  }

  return URLStruct.notFound(request, response, acceptedTypes, params);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});

