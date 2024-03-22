# This will publish all the packages in the build folder to npm

# Exit on error
set -e

# Publish all packages in the build folder
npm version premajor --preid alpha
cd build
for dir in */; do
  cd $dir
  npm publish --tag alpha
  cd ..
done