rm -rf dist/
gulp
#find . -name '*.css' | cpio -pdm dist/
#find . -name '*.js' | cpio -pdm dist/
#find . -name '*.html' | cpio -pdm dist/
rm -rf ~/Sites/dist
cp -R dist ~/Sites/dist
