import session from 'express-session';
import ConnectRedis from 'connect-redis';
import { redis } from '../core/redis';

const RedisStore = ConnectRedis(session);

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { path: '/', httpOnly: false, secure: false },
  store: new RedisStore({
    client: redis,
  }),
});
