#!/bin/bash

if [ -f "./.env" ]; then
  echo ".env already exists, aborting setup"
else
  cp "./.env.default" "./.env"
  printf "SECRET=\"$(tr -dc A-Za-z0-9 </dev/urandom | head -c 32)\"\n" >> .env
fi
