'use-strict';

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
		start: undefined,
		end: undefined,
		elapsed: 0,
	};
	common.resetDoLater();
	times.start = process.hrtime();
	function getCallbackStep() {
		if (count > 0) {
			--count;
			return common.errbackAction((err, asyncValue) => {
				if (err) {
					callback(err, asyncValue);
					return;
				}
				// console.log({
				// 	asyncValue,
				// });
				times.track = times.track + asyncValue;
				getCallbackStep();
			});
		} else {
			times.end = process.hrtime();
			times.elapsed = common.calculateElapsedTime(times);
			callback(undefined, times);
		}
	}
	getCallbackStep();
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
