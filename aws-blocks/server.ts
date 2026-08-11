import { startDevServer } from '@aws-blocks/blocks/scripts';
import { resolve } from 'node:path';

await startDevServer({
  port: 3001,
  backendPath: resolve('aws-blocks/index.ts'),
});
