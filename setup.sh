#!/bin/bash

if [[ $# > 0 ]]; then
    alias=$1
else
    echo "Specify an envirionment. (ex: ./setup.sh dev1)"
    exit 1
fi

echo "Setting up environment variables for" $alias

rm .env
if [[ $alias == "dev1" ]]; then
    echo NEXT_PUBLIC_ENV_NAME=$alias >> .env
    echo NEXT_PUBLIC_POOL_ID="us-west-2_vmYBF62RS" >> .env
    echo NEXT_PUBLIC_POOL_CLIENT="6hg3bojm7m6l8gkimlenf6uie5" >> .env
elif [[ $alias == "dev2" ]]; then
    echo NEXT_PUBLIC_ENV_NAME=$alias >> .env
    echo NEXT_PUBLIC_POOL_ID="us-west-2_hVHLFhUlD" >> .env
    echo NEXT_PUBLIC_POOL_CLIENT="4i9e2bdma2hrtr7u28kh9uaj1" >> .env
else
    echo "Unknown envirionment"
    exit 1
fi

echo "Successfully completed"
