mkdir -p build
rm -rf build/*
cp index.html build/
cp project.json build/
cp fbapp-config.json build/
cp -rf assets build/
cp -rf dist build/
sed -i -e 's/development/production/g' build/src/config.js
sed -i -e 's/app.js/app.min.js/g' build/index.html
sed -i -e 's/vendor.js/vendor.min.js/g' build/index.html
rm build/dist/app.js
rm build/dist/vendor.js
rm -rf build/assets/vendor
zip -r project-direct.zip build
