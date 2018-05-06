## Publish to NPM
Use this when you need to update the library in NPM. The following command will automatically set the version, create a tag for it, build the package and publish it to NPM
```
git add -A
git commit -m 'version update'
npm run upload
```