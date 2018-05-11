#!/bin/bash

container="mqtt2kafka"
cmd="docker-compose build $container && docker-compose up -d $container"

#cd ..
eval $cmd

#for installing watchman, do "brew install watchman"
watchman-make -p '**/*' --run "$cmd"
