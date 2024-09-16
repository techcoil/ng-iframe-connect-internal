#!/usr/bin/env bash

script=$(echo $(cat << JS
    console.log('export const environment = ' + JSON.stringify({
        production: process.env.NODE_ENV === 'production',
        parentOrigin: process.env.PARENT_ORIGIN || 'http://example.com',
    },null, 2));
JS
))

node -e "$script" > src/environment/environment.ts

echo "Building with environment: $(cat src/environment/environment.ts)"

yarn install --frozen-lockfile --non-interactive --production=false
yarn build