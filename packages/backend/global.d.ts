import { User as AppUser } from '@next-chat/types';

declare global {
  namespace Express {
    export interface User {
      ID: AppUser['ID']
    }
  }
}
