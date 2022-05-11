import { dirname } from 'node:path';

// @ts-ignore
export const getProjectRootDir = () => dirname(require.main.filename);
