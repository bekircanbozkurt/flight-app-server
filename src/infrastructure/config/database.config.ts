import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  useLocal: process.env.USE_LOCAL === 'true',
}));
