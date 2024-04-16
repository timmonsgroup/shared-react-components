/**
 * This provides a cli for running the build job
 * It will show help when the --help flag is passed
 * It will request the user for version information
 * It will run the build-monorepo.js script
 * It will run tsc --project tsconfig.json
 */

import build from '@date-io/date-fns';
import { execSync } from 'child_process';
import { log } from 'console';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import readline from 'readline';

const parseArgs = (args) => {
    const parsed = {};
    args.forEach((arg, i) => {
        if (arg === '--help') {
            parsed.help = true;
        }
        if (arg === '--version') {
            parsed.version = args[i + 1];
        }
        if (arg === '--ignore-clean') {
            parsed.ignoreClean = true;
        }
    });
    return parsed;
};

const showHelp = () => {
    console.log(`Usage: build-cli [options]
Options:
--help          Show this help
--version       Specify the version to build
`);
}

const getVersion = async () => {
    // Read the package.json file
    const packageJson = JSON.parse(readFileSync(resolve('./package.json')).toString());
    const currentVersion = packageJson.version;
    console.log(`Current version is ${currentVersion}`);

    // Versions have the following format: major.minor.patch-tag.subversion
    const version = {};
    version.major = currentVersion.split('.')[0];
    version.minor = currentVersion.split('.')[1];
    version.patch = currentVersion.split('.')[2].split('-')[0];

    // The patch may or may not have a tag
    const tag = currentVersion.split('-')[1];
    if (tag) {
        version.tag = tag.split('.')[0];
        version.subversion = tag.split('.')[1];
    };

    return version
}

const getNewVersion = async (version) => {

    logVersion(version);


    await promptVersion(version);

    logVersion(version);


    return version;
}

const versionToString = (version) => {
    let versionString = `${version.major}.${version.minor}.${version.patch}`;
    if (version.tag) {
        versionString += `-${version.tag}.${version.subversion}`;
    }
    return versionString;
}

// This will print the version object in the format major.minor.patch-tag.subversion
const logVersion = (version) => {
    let versionString = versionToString(version);
    console.log(`Version is ${versionString}`);

    console.log("\tMajor", version.major);
    console.log("\tMinor", version.minor);
    console.log("\tPatch", version.patch);
    console.log("\tTag", version.tag);
    console.log("\tSubversion", version.subversion);
}

// This will prompt the user for the version information
// We will ask the user which part of the version they want to change
// We will then ask the user for the new value

const promptVersion = async (version) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    doTheQuestion(rl, version);

    let prom = new Promise((resolve, reject) => {
        rl.on('close', () => {
            resolve();
        });
    });

    await prom;

    return version;

}

const doTheQuestion = (rl, version) => {
    rl.question(`Which part of the version would you like to increment?
    1. Major\t\t - Select this if the build includes breaking changes
    2. Minor\t\t - Select this if the build includes new features
    3. Patch\t\t - Select this if the build includes bug fixes
    4. Tag\t\t - Select this if the build includes a tag
    5. Subversion\t - Select this if the build includes a subversion
    6. Done
    `, part => {
        switch (part) {
            case '1':
                // Confirm the user wants to increment the major version
                rl.question('Are you sure you want to increment the major version? Does this build include breaking changes? (y/n)', answer => {
                    if (answer === 'y') {
                        version.major++;
                        version.minor = 0;
                        version.patch = 0;
                        version.tag = null;
                        version.subversion = 0;
                        logVersion(version);
                        doTheQuestion(rl, version);
                    }
                    else {
                        doTheQuestion(rl, version);
                    }
                });

                break;
            case '2':
                // Confirm the user wants to increment the minor version
                rl.question('Are you sure you want to increment the minor version? Does this build include new features? (y/n)', answer => {
                    if (answer === 'y') {
                        version.minor++;
                        version.patch = 0;
                        version.tag = null;
                        version.subversion = 0;
                        logVersion(version);
                        doTheQuestion(rl, version);
                    }
                    else {
                        doTheQuestion(rl, version);
                    }
                });

                break;
            case '3':
                // Confirm the user wants to increment the patch version
                rl.question('Are you sure you want to increment the patch version? Does this build include bug fixes? (y/n)', answer => {
                    if (answer === 'y') {
                        version.patch++;
                        version.tag = null;
                        version.subversion = 0;
                        logVersion(version);
                        doTheQuestion(rl, version);
                    }
                    else {
                        doTheQuestion(rl, version);
                    }
                });
                doTheQuestion(rl, version);

                break;
            case '4':
                rl.question('Enter the new tag: ', tag => {
                    version.tag = tag;
                    logVersion(version);
                    doTheQuestion(rl, version);
                });

                break;
            case '5':
                version.subversion++;
                logVersion(version);
                doTheQuestion(rl, version);

                break;
            case '6':
                rl.close();
                break;
            default:
                console.log('Invalid option');
        }
    });
}

const doTheversionThing = async () => {
    let ver = await getVersion();

    const oldVersion = JSON.parse(JSON.stringify(ver));

    ver = await getNewVersion(ver);

    // If the version is the same then ask the user if they want to continue
    if (versionToString(ver) === versionToString(oldVersion)) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('The version is the same. Are you sure you want to continue? (y/n)', answer => {
            if (answer === 'y') {
                rl.close();
            }
            else {
                rl.close();
                console.log('Aborting build');
                process.exit(1);
            }
        });

        let prom = new Promise((resolve, reject) => {
            rl.on('close', () => {
                resolve();
            });
        });

        await prom;
    }
    else {


        let versionString = versionToString(ver);

        // Prompt the user to confirm the version
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(`Are you sure you want to build version ${versionString}? (y/n)`, answer => {
            if (answer === 'y') {
                execSync(`npm version ${versionString}`, { stdio: 'inherit' });
                rl.close();
            }
            else {
                rl.close();
                console.log('Aborting build');
                process.exit(1);
            }

        });

        let prom = new Promise((resolve, reject) => {
            rl.on('close', () => {
                resolve();
            });
        });

        await prom;
    }

    return versionToString(ver);
}

const ensureGitClean = async () => {
    const status = execSync('git status --porcelain').toString();
    if (status) {
        console.log('Git status is not clean');
        console.log('Please commit your changes before running the build');
        console.log("When the sattus is not clean npm version will not work. You need to have a clean git status to run the build");
        process.exit(1);
    }
}

const ensureGitTag = async (version) => {
    const tags = execSync('git tag').toString().split('\n');
    if (tags.includes(version)) {
        console.log('Tag already exists');
        console.log('Please increment the version before running the build');
        process.exit(1);
    }
}

const publish = async () => {
    // We have different publish methods. We need to ask the user which one they want to do
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let script = null;

    rl.question(`How would you like to publish?
    1. Publish alpha
    2. Publish beta
    3. Publish gamma
    4. Publish latest
    5. Skip publishing
    `, answer => {
        switch (answer) {
            case '1':
                script = 'publishAlpha.sh';
                rl.close();
                break;
            case '2':
                script = 'publishBeta.sh';
                rl.close();
                break;
            case '3':
                script = 'publishGamma.sh';
                rl.close();
                break;
            case '4':
                script = 'publish.sh';
                rl.close();
                break;
            default:
                console.log('Invalid option');
                rl.close();
        }
    });

    let prom = new Promise((resolve, reject) => {
        rl.on('close', () => {
            resolve();
        });
    });

    await prom;

    if (!script) {
        console.log('Skipping publishing');
        return;
    }

    execSync(`./${script}`, { stdio: 'inherit' });

}

const tag = async (version) => {
    // Ask the suer if they want to apply the tag to the repo on git
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Would you like to apply the tag to the repo? (y/n)', answer => {
        if (answer === 'y') {
            execSync(`git tag ${version}`, { stdio: 'inherit' });
            execSync('git push --tags', { stdio: 'inherit' });
            rl.close();
        }
        else {
            rl.close();
        }
    });

    let prom = new Promise((resolve, reject) => {
        rl.on('close', () => {
            resolve();
        });
    });

    await prom;
}

const main = async (args) => {
    const parsedArgs = parseArgs(args);
    if (parsedArgs.help) {
        showHelp();
        return;
    }

    if(!parsedArgs.ignoreClean)
        await ensureGitClean();

    let version;
    if (parsedArgs.version) {
        version = parsedArgs.version;
        console.log(`Building version ${version}`);
        execSync(`npm version ${version}`, { stdio: 'inherit' });
    } else {
        version = await doTheversionThing();
    }

    await ensureGitTag(version);

    // Run the build-monorepo.js script
    execSync('npm run build-new', { stdio: 'inherit' });

    // Run tsc
    execSync('npm run tsx', { stdio: 'inherit' });

    await tag(version);

    await publish();
}

await main(process.argv.slice(2));