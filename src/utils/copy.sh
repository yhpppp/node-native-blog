#! /bin/sh
cd /Users/yhpp/codo/node-native-blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log