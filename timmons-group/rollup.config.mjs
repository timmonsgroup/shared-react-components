// This is our configuration to build our modules for @timmons-group/
// We have the following modules available:
// shared-auth-config
// shared-react-auth

import { fileURLToPath } from 'node:url';
import glob from 'glob';
import path from 'path';

// JSX plugin
import jsx from 'rollup-plugin-jsx'

// Needed for common things like a?.b?.c
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

// Needed for esbuild
import esbuild from 'rollup-plugin-esbuild';


// This plugin converts jsdoc types to typescript types
import { dts } from 'rollup-plugin-dts';

// And for typescript
import typescript from '@rollup/plugin-typescript';

import copy from 'rollup-plugin-copy';

// THe command line to output the .d.ts files is:
// npx -p typescript tsc shared-auth-config/*.mjs --declaration --allowJs --emitDeclarationOnly --outDir types

// This is for rollup
export default {
  // input: {
  //   'shared-auth-config': './src/shared-auth-config/authConfig.mjs',
  //   'shared-react-auth': './src/shared-react-auth/index.jsx'
  // },
  input: Object.fromEntries(
		glob
      .sync('src/**/*')
      // Only include files ending with .js, .jsx, .ts, and .tsx
      .filter(file => /\.(js|jsx|ts|tsx|mjs)$/.test(file))
    .map(file => [
			// This remove `src/` as well as the file extension from each
			// file, so e.g. src/nested/foo.js becomes nested/foo
			path.relative(
				'src',
				file.slice(0, file.length - path.extname(file).length)
			),
			// This expands the relative paths to absolute paths, so e.g.
			// src/nested/foo becomes /project/src/nested/foo.js
			fileURLToPath(new URL(file, import.meta.url))
		])
	),
  // We want to output each module to a subdirectory of dist/
  output: {
    dir: 'build',
    format: 'esm',
    // We want to keep the directory structure of the source code
    // Also the file names should be the same as the source code
    // entryFileNames: '[name]/index.mjs',
    // chunkFileNames: '[name]/index.js',
    // sourcemap: true,
    // preserveModules: true,

  },
  plugins: [
    typescript(),
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'esnext', // default, or 'es20XX', 'esnext'
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
        '.ts': 'tsx',
      },
    }),
    commonjs(),
    resolve(),
    copy({
      targets: [
        { src: 'src/shared-auth-config/package.json', dest: 'build/shared-auth-config' },
        { src: 'src/shared-auth-config/README.md', dest: 'build/shared-auth-config' },
        { src: 'src/shared-react-auth/package.json', dest: 'build/shared-react-auth' },
        { src: 'src/shared-react-auth/README.md', dest: 'build/shared-react-auth' },
      ],
    }),

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
