// This file builds the packages in the mono repo
// The packages are in the src directory
// For each package we will need to run rollup to build the package

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import copy from 'rollup-plugin-copy';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

import * as packageJSON from './package.json' with { type: "json" };

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
    return version;
}

const mainVersion = getMainVersion(packageJSON.default);
console.log('mainVersion', mainVersion);

//  If we are not in the timmons-group folder cd into it
if (!process.cwd().endsWith('timmons-group')) {
    process.chdir('timmons-group');
}

// Log our CWD
console.log('CWD:', process.cwd());

const packageJsonTransform = (contents, id) => {
    let code = contents;
    if (id.endsWith('package.json')) {
        const packageJson = JSON.parse(code);
        for (const [key, value] of Object.entries(packageJson.dependencies || {})) {
            if (key.startsWith('@timmons-group/')) {
                packageJson.dependencies[key] = `${mainVersion}`;
            }
        }
        for (const [key, value] of Object.entries(packageJson.peerDependencies || {})) {
            if (key.startsWith('@timmons-group/')) {
                packageJson.dependencies[key] = `${mainVersion}`;
            }
        }

        // Now set the version to the main version
        packageJson.version = mainVersion;

        // And add a module field with the value being the main file with the .mjs extension
        packageJson.module = packageJson.main.replace(/\..*$/, '.mjs');

        return JSON.stringify(packageJson, null, 2);
    }
}

const replaceFileDependencies = () => ({
    name: 'replace-file-dependencies',
    async transform(code, id) {
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

const updateExportsToMJS = () => ({
    name: 'update-exports-to-mjs',
    async transform(code, id) {
        if (id.endsWith('package.json')) {
            const packageJson = JSON.parse(code);
            packageJson.exports = packageJson.exports || {};

            // Get the exports and change anything that ends in .js, .jsx, .ts, .tsx to .mjs
            for (const [key, value] of Object.entries(packageJson.exports)) {
                let newKey = key.replace(/\.(js|jsx|mjs|ts|tsx)$/, '.mjs');
                let newValue = value.replace(/\.(js|jsx|mjs|ts|tsx)$/, '.mjs');
                packageJson.exports[newKey] = newValue;

            }
            return JSON.stringify(packageJson, null, 2);
        }
    }
});

const allTransforms = (contents, id) => {
    let code = contents;
    code = packageJsonTransform(code, id);
    code = updateExportsToMJS().transform(code, id);
    return code;
}

const input = Object.fromEntries(
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

        ])
);

// For each of the packages in the src we need to grab the package.json file so that we can gather the peer dependencies
// and add them to the external list. This is because we are building the packages in the src directory and we want to
// use the local version of the package instead of the version from npm.
const packageJsonFiles = glob.sync('src/**/package.json');

const windowsToUnix = (file) => {
    return file.replace(/\\/g, '/');
}

const buildConfig = (packageJsonPath) => {
    // Get the folder for the packageJsonPath
    const packageFolder = path.dirname(packageJsonPath);

    // Find the entry point for the package
    // For the input we need to use either the entry from the package.json file or the index.something file

    // Read the package.json file
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    let entryFile = packageJson.main;

    // If the main file is not set in the package.json file then we will need to find the index file
    if (!entryFile) {
        const indexFiles = glob.sync(`${packageFolder}/index.*`);
        if (indexFiles.length > 0) {
            entryFile = path.relative(packageFolder, indexFiles[0]);
        }
    } else {
        entryFile = packageFolder + '/' + entryFile;
    }


    // For the output we want to have the files in the same folder as the package.json file without the leading src
    const outputFolder = path.relative('src', packageFolder);

    // In order for rollup to obey the exports field in the package.json file we need to set the output format to es
    // and set preserveModules to true. This will keep the directory structure of the package in the build directory.
    const rootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), packageFolder);

    const all = glob
    .sync(`${rootPath}/**/*`);

    const filtered =  all
    // Only include files ending with .js, .jsx, .ts, and .tsx
    .filter(file => /\.(js|jsx|ts|tsx|mjs)$/.test(file))

    const inFiles = filtered
    .map(file => [
        // This remove `src/` as well as the file extension from each
        // file, so e.g. src/nested/foo.js becomes nested/foo
        path.relative(
            `src/${outputFolder}`,
            file   
        )
        //Remove the extension
        .replace(path.extname(file), ''),
        // This expands the relative paths to absolute paths, so e.g.
        // src/nested/foo becomes /project/src/nested/foo.js
        fileURLToPath(new URL(file, import.meta.url)),
    ])
    .map(windowsToUnix);

    const input = Object.fromEntries(inFiles);

    // We also need to disable treeshaking by setting exports to auto and interop to auto
    // more info here: https://rollupjs.org/guide/en/#outputexports
    let ret = {
        input,
        output:
        {
            dir: `build/${outputFolder}`,
            format: 'es',
            entryFileNames: '[name].mjs',
            chunkFileNames: '[name]-[hash].mjs',
            sourcemap: true,
            assetFileNames: '[name][extname]',
            preserveModules: true,
            exports: 'named',
            interop: 'auto',
        },
        plugins: [
            peerDepsExternal({
                packageJsonPath,
                includeDependencies: true,
            }),
            resolve({
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
                preferBuiltins: true,
                moduleDirectories: ['src', 'node_modules'],
                allowExportsFolderMapping: true,
                rootDir: rootPath,
                preserveModules: true,
                
            }),
            // typescript({
            //     extensions: ['.ts', '.tsx'],
            // }),
            json(),
            esbuild({
                // All options are optional
                include: /\.[jt]sx?$/, // default, inferred from `loaders` option
                exclude: /node_modules/, // default
                sourceMap: true, // default
                minify: false, //process.env.NODE_ENV === 'production',
                target: 'esnext', // default, or 'es20XX', 'esnext'
                jsxFactory: 'React.createElement',
                jsxFragment: 'React.Fragment',
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
                    // And md files should be copied as text
                    '.md': 'text'

                },
            }),
            commonjs(),
            // Transform package.json files to fix dependencies
            replaceFileDependencies(),
            updateExportsToMJS(),
            copy({
                targets: [
                    { src: packageJsonPath, dest: `build/${outputFolder}`, transform: allTransforms },
                ],
            }),


        ],
        external: [
            'react',
            'react/jsx-runtime',
            'prop-types',
            'react-dom',
            'react-router-dom',
            'react-redux',
            'redux',
            'redux-thunk',
            'react-router-redux',
            'jwt-decode',
            'axios',
            "axios-retry",
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
            '@mui/material',
            '@mui/icons-material',
            '@mui/material/styles',
            '@mui/material/CircularProgress',
            '@mui/material/Link',
            '@mui/icons-material/ArrowDropDown',
            '@mui/icons-material/ArrowDropUp',
            '@mui/material/MenuItem',
            '@mui/material/Menu',
            '@mui/material/IconButton',
            '@mui/material/Toolbar',
            '@mui/material/Typography',
            '@mui/material/AppBar',
            '@mui/material/Drawer',
            '@mui/material/List',
            '@mui/material/ListItem',
            '@mui/material/ListItemIcon',
            '@mui/material/ListItemText',
            '@mui/material/CssBaseline',
            '@mui/material/Container',
            '@mui/material/Grid',
            '@mui/material/Box',
            '@mui/material/Avatar',
            '@mui/material/Divider',
            '@mui/material/ListItemIcon',
            '@mui/material/ListItemText',
            '@mui/material/Button',
            "@mui/x-data-grid",

            "@mui/x-date-pickers",
            "@mui/x-date-pickers/TimePicker",
            "@mui/x-date-pickers/PickersDay",
            "@mui/x-date-pickers/MobileDatePicker",
            "@mui/x-date-pickers/AdapterDateFns",
            "@mui/x-date-pickers/MobileTimePicker",
            "@mui/x-date-pickers/DateField",
            "@mui/x-date-pickers/StaticDatePicker",
            "@mui/x-date-pickers/node",
            "@mui/x-date-pickers/AdapterMoment",
            "@mui/x-date-pickers/StaticDateTimePicker",
            "@mui/x-date-pickers/LocalizationProvider",
            "@mui/x-date-pickers/modern",
            "@mui/x-date-pickers/AdapterDayjs",
            "@mui/x-date-pickers/CalendarPicker",
            "@mui/x-date-pickers/MonthPicker",
            "@mui/x-date-pickers/locales",
            "@mui/x-date-pickers/MobileDateTimePicker",
            "@mui/x-date-pickers/DatePicker",
            "@mui/x-date-pickers/internals",
            "@mui/x-date-pickers/DesktopTimePicker",
            "@mui/x-date-pickers/internals-fields",
            "@mui/x-date-pickers/DesktopDateTimePicker",
            "@mui/x-date-pickers/node_modules",
            "@mui/x-date-pickers/PickersActionBar",
            "@mui/x-date-pickers/legacy",
            "@mui/x-date-pickers/CalendarPickerSkeleton",
            "@mui/x-date-pickers/StaticTimePicker",
            "@mui/x-date-pickers/ClockPicker",
            "@mui/x-date-pickers/DesktopDatePicker",
            "@mui/x-date-pickers/themeAugmentation",
            "@mui/x-date-pickers/YearPicker",
            "@mui/x-date-pickers/DateTimePicker",
            "@mui/x-date-pickers/AdapterLuxon",

            "@date-io",
            "@date-io/dayjs",
            "@date-io/luxon",
            "@date-io/moment",
            "@date-io/date-fns",
            "@date-io/core",

            "date-fns",
            "@mui/material/Unstable_Grid2",
            "@mui/icons-material/InfoOutlined",
            '@emotion/styled',
            'jsx-runtime',
            "@timmons-group/shared-auth-config",
            "@timmons-group/shared-react-auth",
            "@timmons-group/shared-react-permission-filter",
            "@timmons-group/shared-react-app-bar",
            "@emotion/styled",
            "yup",
            "@hookform/resolvers/yup",
            "notistack",
            "react-hook-form",
            "@testing-library/react",
            "jest",
            "@testing-library/jest-dom",
            /\.(css|less|scss)$/
        ],
    };

    return ret;
}



const build = (config) => {
    rollup(config).then((bundle) => {
        return bundle.write(config.output);
    }).catch((error) => {
        console.error(error);
    });
}

const configs = packageJsonFiles.map(buildConfig);

for (const config of configs) {
    build(config);
}