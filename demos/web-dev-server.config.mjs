import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  open: 'demos',
  nodeResolve: true,
  watch: true,
  port: 8080,
  appIndex: 'demos/index.html',
  plugins: [
    esbuildPlugin({
      ts: true,
    }),
  ],
};
