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

import * as packageJSON from './package.json' with { type: "json" };

import rollupJson from '@rollup/plugin-json';


// This function is used as a rollup plugin to transform package.json files
// to fix dependencies. Dependencies for the internal packages start with
// @timmons-group/. We want to update the version of the dependency to
// Match the version of the package we are building. We also want to change
// the dependency to a file dependency. This is because we are building
// all of the packages at the same time and we want to use the local
// version of the package instead of the version from npm.

// Read the package.json in the build directory and update the dependencies
const getMainVersion = (packageJson) => {
  const version = packageJson.version;
  const versionParts = version.split('.');
  return `${versionParts[0]}.${versionParts[1]}.${versionParts[2]}`;
}

const mainVersion = getMainVersion(packageJSON.default);
console.log('mainVersion', mainVersion);

const packageJsonTransform = (contents, id) => {
  let code = contents;
  console.log('id', id);
  if (id.endsWith('package.json')) {
    const packageJson = JSON.parse(code);
    for (const [key, value] of Object.entries(packageJson.dependencies)) {
      if (key.startsWith('@timmons-group/')) {
        packageJson.dependencies[key] = `${mainVersion}`;
      }
    }

    // Now set the version to the main version
    packageJson.version = mainVersion;
    
    return JSON.stringify(packageJson, null, 2);
  }
}

const replaceFileDependencies = () => ({
  name: 'replace-file-dependencies',
  async transform(code, id) {
    console.log('id', id);
    if (id.endsWith('package.json')) {
      const packageJson = JSON.parse(code);
      for (const [key, value] of Object.entries(packageJson.dependencies)) {
        if (key.startsWith('@timmons-group/')) {
          packageJson.dependencies[key] = `${mainVersion}`;
        }
      }
      return JSON.stringify(packageJson, null, 2);
    }
  }
});



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
			fileURLToPath(new URL(file, import.meta.url)),
      // We dont want to transform the package.json files

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
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
      preferBuiltins: false,
      moduleDirectories: ['src','node_modules'],
    }),
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
    copy({
      targets: [
        { src: 'src/shared-auth-config/package.json', dest: 'build/shared-auth-config', transform: packageJsonTransform },
        { src: 'src/shared-auth-config/README.md', dest: 'build/shared-auth-config' },
        { src: 'src/shared-react-auth/package.json', dest: 'build/shared-react-auth', transform: packageJsonTransform },
        { src: 'src/shared-react-auth/README.md', dest: 'build/shared-react-auth' },
      ],
    }),
    // Transform package.json files to fix dependencies
    replaceFileDependencies(),

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
