#!/bin/bash

export RUN=1
export COUNT=${1}
if [[ $COUNT =~ ^[-+]?[0-9]+$ ]] ; then
	echo "count=${COUNT}"
else
	echo "must provide count as first argument"
	exit 1
fi

. ~/.nvm/nvm.sh # get the `nvm` alias
nvm use 4
node ./print-version.js
node ./benchmark-promises.js ${COUNT}
node ./benchmark-callbacks.js ${COUNT}
node ./benchmark-generator-promises.js ${COUNT}
node ./benchmark-generator-callbacks.js ${COUNT}
nvm use 6
node ./print-version.js
node ./benchmark-promises.js ${COUNT}
node ./benchmark-callbacks.js ${COUNT}
node ./benchmark-generator-promises.js ${COUNT}
node ./benchmark-generator-callbacks.js ${COUNT}
