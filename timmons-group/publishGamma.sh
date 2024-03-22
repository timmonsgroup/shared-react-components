# This will publish all the packages in the build folder to npm

# Exit on error
set -e

# Patch our @timmons-group package to a new pre-release version
npm version premajor --preid gamma
# Publish all packages in the build folder
cd build
for dir in */; do
  cd $dir
  npm publish --tag gamma
  cd ..
done