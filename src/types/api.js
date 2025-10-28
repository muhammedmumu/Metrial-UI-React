// API related types
export const ApiTypes = {
  // Standard API response
  ApiResponse: {
    data: 'any',
    status: 'number',
    message: 'string',
    success: 'boolean'
  },

  // API error response
  ApiError: {
    message: 'string',
    status: 'number',
    code: 'string'
  },

  // HTTP methods
  HttpMethod: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],

  // Request configuration
  RequestConfig: {
    method: 'HttpMethod',
    url: 'string',
    data: 'any',
    headers: 'object',
    timeout: 'number'
  }
};