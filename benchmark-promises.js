'use-strict';

const common = require('./common.js');

module.exports = {
	benchmark: benchmarkPromises,
};

function benchmarkPromises(count, callback) {
	if (typeof count !== 'number' || count < 1) {
		throw 'Must specify count';
	}

	const times = {
		track: 0,
		start: undefined,
		end: undefined,
		elapsed: 0,
	};
	common.resetDoLater();
	times.start = process.hrtime();
	function getPromiseStep() {
		if (count > 0) {
			--count;
			return common.promiseAction()
				.then((asyncValue) => {
					// console.log({
					// 	asyncValue,
					// });
					times.track = times.track + asyncValue;
					return getPromiseStep();
				});
		}
	}
	const promise = getPromiseStep()
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
	benchmarkPromises(count, (err, times) => {
		out = !times ? undefined : {
			elapsed: times.elapsed,
			track: times.track,
		};
		console.log('benchmarkPromises', err, out);
	});
}
