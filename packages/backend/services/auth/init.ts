import type { Express } from 'express';
import passport from 'passport';
import { Namespace, Server } from 'socket.io';
import LocalStrategy, { VerifyFunction } from 'passport-local';
// 
import { getUserByID, loginUser } from './auth';
import { User } from '.prisma/client';
import { wrapConnectMiddlewareToSocket } from '../../utils/middleware';
import { sessionMiddleware } from '../../core/common';

const passportAuthStrategyVerifyFn: VerifyFunction = async (email, password, done) => {
  try {
    const user = await loginUser({
      email,
      password
    });
    
    if (user) {
      return done(null, user);
    } else {
      done(null, false);
    }
  } catch (err: unknown) {
    done(null, false);
  }
}

const passportInitialize = passport.initialize();
const passportSession = passport.session();

export const initAuth = () => {
  passport.use(
    new LocalStrategy.Strategy({
      usernameField: 'email',
      passwordField: 'password'
    }, passportAuthStrategyVerifyFn)
  );

  passport.serializeUser((user: User, done) => {
    done(null, user.ID);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    const user = await getUserByID(id);

    done(null, user);
  });
}

export const initAuthForHttp = (app: Express) => {
  app.use(passportInitialize);
  app.use(passportSession);
}

export const initAuthForWS = (io: Server | Namespace) => {
  io.use(wrapConnectMiddlewareToSocket(sessionMiddleware));
  io.use(wrapConnectMiddlewareToSocket(passportInitialize));
  io.use(wrapConnectMiddlewareToSocket(passportSession));
}
