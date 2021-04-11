function randomString(answer) {
	let s = ""
	let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
	while(s.length < answer.length) {
		let index = Math.floor(Math.random() * alphabet.length)
		s += alphabet[index]
	}
	return s
}

// function guess() {
// 	let answer = "hello world"
// 	let solution = randomString(answer)
// 	let maxDiff = Infinity
// 	let count = 0

// 	while(true) {
// 		if(diff(solution, answer) === 0) break
// 		let newSolution = generateSolution1(solution)
// 		if(diff(newSolution, answer) < maxDiff) {
// 			maxDiff = diff(newSolution, answer)
// 			solution = newSolution
// 		}
// 		count ++
// 		console.log("Try " + count + " " + solution)
// 	}
// 	console.log(solution)
// }

function guess() {
	let answer = "hello world"
	let solution = randomString(answer)
	let maxDiff = Infinity
	let count = 0

	while(true) {
		if(diff(solution, answer) === 0) break
		// tìm từng cái neighbor tốt nhất của cái solution hiện tại
		let index = 0;
		let newSolution = generateSolution1(solution, index)
		if(diff(newSolution, answer) < maxDiff) {
			maxDiff = diff(newSolution, answer)
			solution = newSolution
		}
		count ++
		console.log("Try " + count + " " + solution)
	}
	console.log(solution)
}

function generateSolution2(solution, index) {

}

function generateSolution1(solution) {
	let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", " ", ""]
	let indexChar = Math.floor(Math.random() * alphabet.length)
	let indexSolution = Math.floor(Math.random() * solution.length)
	let split = solution.split("")
	split[indexSolution] = alphabet[indexChar]
	solution = split.join("")
	return solution
}

function diff(solution, answer) {
	let sum = 0
	for(let i = 0 ; i < answer.length; i++) {
		if(solution[i] !== answer[i]) {
			sum ++
		}
	}
	return sum
}

console.time()
guess()
console.timeEnd()
// console.log(generateSolution("hihi"))