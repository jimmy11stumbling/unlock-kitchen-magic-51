
import { rest } from 'msw';

export const handlers = [
  // Add mock API handlers here
  rest.get('/api/example', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Mock response' })
    );
  }),
];
