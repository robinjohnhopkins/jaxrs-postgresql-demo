#!/bin/bash

echo build js and css then add to java static content
echo this static content then is served by wildfly thus NO XSS attacks.
echo - it is checked into git. There is no npm build done as part of java build step of s2i.

cd reactui
REACT_APP_PUBLIC_URL='/jaxrs-postgresql-demo' npm run build
cp -R  build/* ../src/main/webapp/
cd ..