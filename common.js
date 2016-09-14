'use strict';

module.exports = {
	errbackAction,
	promiseAction,
	calculateElapsedTime,
	resetDoLater,
}

const maxWaitValue = 16;
const numLaterValues = maxWaitValue * 4; //Should be whole multipl of maxWaitValue only
const laterValues = [];
for (let i = 0; i < numLaterValues; ++i) {
	laterValues.push(i);
}
shuffleInPlaceArrayFisherYates(laterValues);
let laterIndex = -1;
resetDoLater();

function shuffleInPlaceArrayFisherYates(array) {
	let lastIndex = array.length;
	while (lastIndex > 0) {
		let randomIndex = Math.floor(Math.random() * lastIndex);
		--lastIndex;
		let temp = array[lastIndex];
		array[lastIndex] = array[randomIndex];
		array[randomIndex] = temp;
	}
	return array;
}

function doLater(func) {
	laterIndex = (++laterIndex % numLaterValues);
	const laterValue = laterValues[laterIndex];
	const waitDuration = (laterValue % maxWaitValue);
	// console.log({
	// 	laterIndex,
	// 	laterValue,
	// 	waitDuration,
	// });
	setTimeout(() => {
		func(undefined, laterValue);
	}, waitDuration);
}
function resetDoLater() {
	laterIndex = -1;
}

function errbackAction(errback) {
	doLater(errback);
}

function promiseAction() {
	return new Promise((resolve, reject) => {
		doLater((err, result) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(result);
		});
	});
}

function calculateElapsedTime(times) {
	return ((times.end[0] - times.start[0]) * 1000) + // seconds -> milliseconds
		((times.end[1] - times.start[1]) / 1000000); // nanoseconds -> milliseconds
}
