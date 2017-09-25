#!/bin/sh

npm run build
rm -Rf ../ionic2-demo/node_modules/ext-ionic/*
rsync -a --exclude-from=deploy-debug-ignore  ../ext-ionic/  ../ionic2-demo/node_modules/ext-ionic
