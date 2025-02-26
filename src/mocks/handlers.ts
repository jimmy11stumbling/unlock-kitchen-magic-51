
import { http } from 'msw';

export const handlers = [
  // Add mock API handlers here
  http.get('/api/example', () => {
    return new Response(
      JSON.stringify({ message: 'Mock response' }),
      { status: 200 }
    );
  }),
];
