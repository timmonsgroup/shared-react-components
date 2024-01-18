// This is our configuration to build our modules for @timmons-group/
// We have the following modules available:
// shared-auth-config
// shared-react-auth

import { fileURLToPath } from 'node:url';

// JSX plugin
import jsx from 'rollup-plugin-jsx'

// Needed for common things like a?.b?.c
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

// Needed for esbuild
import esbuild from 'rollup-plugin-esbuild';



// This is for rollup
export default {
  input: {
    'shared-auth-config': './shared-auth-config/authConfig.mjs',
    'shared-react-auth': './shared-react-auth/index.jsx'
  },
  // We want to output each module to a subdirectory of dist/
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: '[name]/index.js',
    sourcemap: true,

  },
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es2017', // default, or 'es20XX', 'esnext'
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Like @rollup/plugin-replace
      define: {
        __VERSION__: '"x.y.z"'
      },
      // Add extra loaders
      loaders: {
        // Add .json files support
        // require @rollup/plugin-commonjs
        '.json': 'json',
        // Enable JSX in .js files too
        '.js': 'jsx',
      },
    }),
    // Needed for esbuild
    // esbuild(),
    // Needed for common things like a?.b?.c
    commonjs(),    
    resolve(),
    // Add JSX support
    //jsx({factory: 'React.createElement'}),

  ],
  external: [
    'react',
    'react-dom',
    'react-router-dom',
    'react-redux',
    'redux',
    'redux-thunk',
    'react-router-redux',
    'jwt-decode',
    'axios',
    'js-cookie',
    'query-string',
    'reselect',
    'redux-saga',
    'redux-saga/effects',
    'redux-devtools-extension',
    'redux-devtools-extension/logOnlyInProduction',
    'react-redux-loading-bar',
    'react-redux-loading-bar/progress',
    'react-redux-loading-bar/reducer',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'react-redux-loading-bar/constants',
    'react-redux-loading-bar/actions',
    'react-redux-loading-bar/styles',
    'query-string',
    'query-string',
    'jwt-decode',
    'jwt-decode',
    'js-cookie',
    'js-cookie',
  ],
};
