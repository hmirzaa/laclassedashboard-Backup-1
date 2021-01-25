#!/usr/bin/env bash
echo "Serving laclasse-dashboard!"
npm install -g serve
serve -l 8050 -s build
