const { performance } = require('perf_hooks');
const fs = require('fs')
const LineByLineReader = require('line-by-line')

function randomPath(pathLength) {
	let array = Array.from({length: pathLength}).map((i, index) =>  index)
	let result = []
	for(let i = 0 ; i < pathLength ; i++) {
		let index = Math.floor(Math.random() * array.length)
		result.push(array[index])
		array = [
			...array.slice(0, index),
			...array.slice(index + 1)
		]
	}
	result.push(result[0])
	return result
}

function getDistanceFromSolution(tsp, solution) {
    let cost = 0;
    // 0 1 2 3 4 0
    // 0 -> 1
    // 1 -> 2
    // 2 -> 3
    // 3 -> 4
    for (let i = 0; i < solution.length - 1; i++) {
		// console.log(solution[i], solution[i + 1], tsp[solution[i]][solution[i + 1]])
        cost += tsp[solution[i]][solution[i + 1]];
    }
    return cost;
}

// test hàm
// console.log(getDistanceFromSolution(tsp, [0, 4, 1, 3, 5, 2, 0]));  // 72
// console.log(getDistanceFromSolution(tsp, [2, 1, 3, 0, 4, 5, 2])); // 83
// console.log(getDistanceFromSolution(tsp, [ 4, 2, 1, 3, 0, 4 ])); // 50

// 1 2 3 4 5
// result
// 2 1 3 4 5
// 3 2 1 4 5
// 4 2 3 1 5
// 5 2 3 4 1
// 1 3 2 4 5
// 1 4 3 2 5
// 1 5 3 4 2
// 1 2 4 3 5
// 1 2 5 4 3
// Độ phức tạp của thuật toán O(n^2)
// hàm này sẽ sinh ra tất cả neighbor của solution từ việc hoán vị 2 đầu mút với nhau
function generateAllNeighborSolutionUsingPermuation(solution) {
	let neighbors = []
	for(let i = 0 ; i < solution.length; i++) {
		for(let j = i + 1; j < solution.length - 1; j++) {
			let neighbor = [...solution]
			neighbor[i] = solution[j]
			neighbor[j] = solution[i]
			neighbor[solution.length - 1] = neighbor[0]
			neighbors.push(neighbor)
		}
	}
	return neighbors
}

function findBestNeighborSolution(neighbors) {
	if(neighbors.length === 0) return null

	let bestSolution = neighbors[0]
	let bestSolutionRouteLength = getDistanceFromSolution(tsp, neighbors[0])
	for(let i = 1 ; i < neighbors.length; i++) {
		let currentSolutionRouteLength = getDistanceFromSolution(tsp, neighbors[i])
		if(currentSolutionRouteLength < bestSolutionRouteLength) {
			bestSolution = neighbors[i]
			bestSolutionRouteLength = currentSolutionRouteLength
		}
	}
	return {
		bestSolution,
		bestSolutionRouteLength
	}
}

// hàm này sẽ lấy 2 đầu mút và đảo chuỗi con của chúng
// 1 2 3 4 5 6 1
// 
function generateNeighborSolutionUsingReserve(solution) {
	let left = 0
	let right = 0
	while(left == right || (right - left - 2) <= 1) {
		left = Math.floor(Math.random() * solution.length);
		right = Math.floor(Math.random() * solution.length);
		if(left > right) {
			t  = left
			left = right
			right = t
		}
	}

	let subArray = [
		...solution.slice(left + 1,right)
	]

	// console.log(left, right)
	reverseArray = subArray.reverse()
	let result  = [
		...solution.slice(0, left + 1),
		...reverseArray,
		...solution.slice(right)
	]
	return result
}
// test hàm
// console.log(generateNeighborSolutionUsingReserve([0, 1, 2, 3, 4, 5, 0]))

function generateNeighborSolutionUsingInsertCity(solution) {
	let indexCity = 0
	let newIndex = 0
	let result = []
	while (indexCity == newIndex) {
		indexCity = Math.floor(Math.random() * (solution.length - 2) ) + 1;
		newIndex = Math.floor(Math.random() * (solution.length - 2) ) + 1;
	}
	for(let i = 0 ; i < solution.length; i++) {
		if(i === indexCity) {
			continue
		} else if(i === newIndex) {
			result.push(solution[indexCity], solution[i])
		} else {
			result.push(solution[i])
		}
	}

	return result
}
// console.log(generateNeighborSolutionUsingInsertCity([0, 1, 2, 3, 4, 5, 0]))


function generateNeighborSolutionUsingPumatationTwoCity(solution) {
	let index1 = 0
	let index2 = 0
	while (index1 == index2) {
		index1 = Math.floor(Math.random() * (solution.length - 2) ) + 1;
		index2 = Math.floor(Math.random() * (solution.length - 2) ) + 1;
	}

	let result = [...solution]
	result[index1] = solution[index2]
	result[index2] = solution[index1]
	return result
}
// console.log(generateNeighborSolutionUsingPumatationTwoCity([0, 1, 2, 3, 4, 5, 0]))

// function generateNeighborSolutionUsingInsertSubcity(solution) {

// }

// hàm này sẽ dùng dạng Steeper Hill Climbing
/**
 * 
 * @param {*} param0 
 * tsp
 * type
 * pathLength
 * exceedTime
 * @returns kết quả
 */
function hillClimbing({tsp, type, pathLength, exceedTime }) {
	let result = randomPath(pathLength)
	let resultPathLength = getDistanceFromSolution(tsp, result)
	let counTotalStepAtCurrent = 0
	// nếu như mà sau counTotalStepAtCurrent không có sự thay đổi thoát khỏi vòng lặp
	// Repeat these steps until a solution is found or current state does not change.
	while(counTotalStepAtCurrent <= exceedTime) {
		// Among the generated neighbour states which are better than current state choose a state randomly
		let neighborRandom = -1
		switch(type) {
			case 1:
				neighborRandom = generateNeighborSolutionUsingReserve(result)
			break
			case 2:
				neighborRandom = generateNeighborSolutionUsingInsertCity(result)
			break
			case 3:
				neighborRandom = generateNeighborSolutionUsingPumatationTwoCity(result)
			break
			default:
				neighborRandom = generateNeighborSolutionUsingReserve(result)
		}
		let neighborRandomPathLength = getDistanceFromSolution(tsp, neighborRandom)
		if(neighborRandomPathLength < resultPathLength) {
			result = [...neighborRandom]
			resultPathLength = neighborRandomPathLength
			// thay đổi vị trí đứng thì reset lại để tìm những neighbor
			counTotalStepAtCurrent = 0
		}
		counTotalStepAtCurrent++
	}

	return {
		result,
		resultPathLength
	}
}

// áp dụng chiến lược gọi nhiều lần
/**
 * 
 * @param {*} param0
 * tsp là ma trận nxn
 * isTracking boolean lưu quá trình để tìm kết quả của 1 đường đi
 * type là loại chiến lược muốn dùng
 * isSaveFile có muốn lưu vào file hay không
 * path đường dẫn để lưu file
 * pathLength tổng số thành phố
 * exceedTime tại 1 current solution nếu mà vượt quá số lần không tìm được kết quả tốt thì sẽ thoát
 * amountOfRandom chạy hill climbing bao nhiêu lần, vd nếu là 3 thì có nghĩa sẽ gọi hillClimbing với 3 initialState khác nhau
 * @returns lưu vào file hoặc là xuất ra màn hình
 */
function shotgunHillClimbing({tsp, isTracking, type, isSaveFile, path, pathLength, exceedTime, amountOfRandom }) {
	if(!tsp) throw new Error("missing tsp")
	if(!isTracking) throw new Error("missing isTracking")
	if(!type) throw new Error("missing type")
	if(!isSaveFile) throw new Error("missing isSaveFile")
	if(!path) throw new Error("missing path")
	if(!pathLength) throw new Error("missing pathLength")
	if(!exceedTime) throw new Error("missing exceedTime")
	if(!amountOfRandom) throw new Error("missing amountOfRandom")
	

	let bestPathLength = Infinity
	let bestSolution = null
	let history = []
	for(let i = 0 ; i < amountOfRandom; i++) {
		let tt = performance.now()
		let h = hillClimbing({tsp, type, pathLength, exceedTime})
		let te = performance.now()
		if(h.resultPathLength < bestPathLength) {
			bestSolution = h
			bestPathLength = h.resultPathLength
		}
		if(isTracking) {
			history.push({ ...h, tt, te, total_time: (te - tt) })
		}
	}

	// kiểm tra điều kiện để xuất ra ngoài
	if(!isSaveFile) {
		return {
			strategyType: type,
			history,
			bestSolution,
			bestPathLength
		}
	} else {
		fs.writeFileSync(`${path}`, JSON.stringify({
			strategyType: type,
			history,
			bestSolution,
			bestPathLength
		}), { flag: 'w' })	
		return {
			strategyType: type,
			history,
			bestSolution,
			bestPathLength
		}	
	}
	
}

/**
 * 
 * @param {*} path Đường dẫn tới source chứa file
 * @param {*} type Loại chiến lược muốn sử dụng
 * @returns trả về đường dẫn string
 */
function createPath(path , type) {
	// ./result/17cities/hill_climbing_result_type_
	return path + type + "_" + '.json'
}

/**
 * 
 * @param {*} arrayString ['1 2,3', '4 5 6', '7 8 9']
 * @returns trả về ma trận nxn
 */
function convertStringToArray(arrayString) {
	let array = []
	for(let i = 0 ; i < arrayString.length; i++) {
		let temp = arrayString[i].split(" ").join(";")
		while(temp.indexOf(";;") !== -1) {
			temp = temp.split(";;").join(";")
		}
		temp = temp.split(";").filter(item => item !== "")
		array.push(temp.map((i, index) => i === index ? Infinity : parseInt(i)))
	}
	return array
}

// thực hiện test chương trình với 17 cities
// let arrayString = ["0 633 257  91 412 150  80 134 259 505 353 324  70 211 268 246 121","633   0 390 661 227 488 572 530 555 289 282 638 567 466 420 745 518","257 390   0 228 169 112 196 154 372 262 110 437 191  74  53 472 142","91 661 228   0 383 120  77 105 175 476 324 240  27 182 239 237  84","412 227 169 383   0 267 351 309 338 196  61 421 346 243 199 528 297","150 488 112 120 267   0  63  34 264 360 208 329  83 105 123 364  35","80 572 196  77 351  63   0  29 232 444 292 297  47 150 207 332  29","134 530 154 105 309  34  29   0 249 402 250 314  68 108 165 349  36","259 555 372 175 338 264 232 249   0 495 352  95 189 326 383 202 236","505 289 262 476 196 360 444 402 495   0 154 578 439 336 240 685 390","353 282 110 324  61 208 292 250 352 154   0 435 287 184 140 542 238","324 638 437 240 421 329 297 314  95 578 435   0 254 391 448 157 301","70 567 191  27 346  83  47  68 189 439 287 254   0 145 202 289  55","211 466  74 182 243 105 150 108 326 336 184 391 145   0  57 426  96","268 420  53 239 199 123 207 165 383 240 140 448 202  57   0 483 153","246 745 472 237 528 364 332 349 202 685 542 157 289 426 483   0 336","121 518 142  84 297  35  29  36 236 390 238 301  55  96 153 336   0"]
// const tsp = convertStringToArray(arrayString);
// const pathLength = 17
// const exceedTime = 300
// const pathResource = './result/17cities/hill_climbing_result_type_'

// for(let i = 1; i <= 3; i++) {
// 	shotgunHillClimbing({tsp, exceedTime, type: i, path: createPath(pathResource, i), pathLength, isTracking: true, isSaveFile: true, amountOfRandom: 50})
// }

// ===================================================================================

/**
 * 
 * @param {*} pathData 
 * @returns mảng tsp nxn
 */
function createTSPMap(pathData) {
	return new Promise((resolve, reject) => {
		let lr = new LineByLineReader(pathData)
		
		let result = []
		lr.on('line', function (line) {
			result.push(line)
		});

		lr.on('end', function() {
			let tsp = convertStringToArray(result)
			// console.log(tsp)
			resolve(tsp)
			console.log("=> Done Convert To TSP")
		})

		lr.on('error', function (error) {
			reject(error)
		});
	})
}

// createTSPMap('./result/17cities/gr17_d.txt')

/**
 * 
 * @param {*} array array mảng object
 * @param {*} key tìm min theo key nào
 * @returns giá trị nhỏ nhất theo key đó
 */
function findMinValueInArray(array, key) {
	if(!array) throw new Error("Missing array")
	if(!key) throw new Error("Missing key")
	if(array.length === 0) throw new Error("Array is empty")

	let min = Infinity
	for(let i = 1 ; i < array.length; i++) {
		if(min > array[i][key]) {
			min =  array[i][key]
		}
	}
	return min
}

/**
 * 
 * @param {*} array mảng object
 * @param key tìm nhỏ theo key nào
 * @returns 
 * nhỏ là gía trị nào
 * result là những giá object có giá trị nhỏ theo key đó
 */
function findMinItemsInArray(array, key) {
	if(!array) throw new Error("Missing array")
	if(!key) throw new Error("Missing key")
	if(array.length === 0) throw new Error("Array is empty")

	let min = findMinValueInArray(array, key)

	let result = []
	for(let i = 0 ; i < array.length; i++) {
		if(min === array[i][key]) {
			result.push(array[i])
		}
	}
	return {
		min,
		result
	}
}

module.exports = {
	shotgunHillClimbing,
	createPath,
	convertStringToArray,
	createTSPMap,
	findMinItemsInArray,
	findMinValueInArray,
	getDistanceFromSolution,
	hillClimbing
}
