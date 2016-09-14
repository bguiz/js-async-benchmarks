'use-strict';

const co = require('co');

const common = require('./common.js');

module.exports = {
	benchmark: benchmarkGeneratorPromises,
};

function benchmarkGeneratorPromises(count, callback) {
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
	co(function* () {
		while (count > 0) {
			--count;
			const asyncValue = yield common.promiseAction();
			// console.log({
			// 	asyncValue,
			// });
			times.track = times.track + asyncValue;
		}
	})
	.then(() => {
		times.end = process.hrtime();
		times.elapsed = common.calculateElapsedTime(times);
		callback(undefined, times);
	})
	.catch((err) => {
		callback(err, times);
	});
}

if (process.env.RUN) {
	const count = +(process.argv[2]);
	benchmarkGeneratorPromises(count, (err, times) => {
		out = !times ? undefined : {
			elapsed: times.elapsed,
			track: times.track,
		};
		console.log('benchmarkGeneratorPromises', err, out);
	});
}
