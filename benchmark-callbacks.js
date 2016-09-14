'use-strict';

const righto = require('righto');

const common = require('./common.js');

module.exports = {
	benchmark: benchmarkCallbacks,
};

function benchmarkCallbacks(count, callback) {
	if (typeof count !== 'number' || count < 1) {
		throw 'Must specify count';
	}

	const times = {
		track: 0,
		start: 0,
		end: 0,
		elapsed: 0,
	};
	common.resetDoLater();
	times.start = process.hrtime();
	righto.iterate(function* (reject) {
		while (count > 0) {
			--count;
			const asyncValueArgs = yield righto.surely(common.errbackAction);
			// console.log({
			// 	asyncValueArgs,
			// });
			if (asyncValueArgs[0]) {
				reject(asyncValueArgs[0]);
				return;
			}
			times.track = times.track + asyncValueArgs[1];
		}
	})((err, result) => {
		times.end = process.hrtime();
		times.elapsed = common.calculateElapsedTime(times);
		callback(err, times);
	});
}

if (process.env.RUN) {
	const count = +(process.argv[2]);
	benchmarkCallbacks(count, (err, times) => {
		out = !times ? undefined : {
			elapsed: times.elapsed,
			track: times.track,
		};
		console.log('benchmarkCallbacks', err, out);
	});
}
