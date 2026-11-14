import { handle } from 'hono/vercel';
import app from '../src/app';

// Vercel serverless entry — same Hono app as Bun.serve
export default handle(app);
