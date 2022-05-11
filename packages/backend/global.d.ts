import { User as AppUser } from '@next-chat/types';

declare global {
  namespace Express {
    interface User {
      ID: AppUser['ID'];
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      APP_URL: string;
      FRONTEND_DOMAIN: string;
      SESSION_SECRET: string;
    }
  }
}
