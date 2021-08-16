#!/bin/bash

if [ -f "./.env" ]; then
  echo ".env already exists, aborting setup"
else
  cp "./.env.default" "./.env"
  printf "PREVIEW_SECRET=\"$(tr -dc A-Za-z0-9 </dev/urandom | head -c 13)\"\n" >> .env
fi
