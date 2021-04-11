// Dạng 1


// Dạng 2
// function hillClimbing() {
// 	// tạo một đường ngẫu nhiên
// 	// let result = [0, 1, 2, 3, 4, 5]
// 	let result = randomPath()
// 	let resultPathLength = getDistanceFromSolution(tsp, result)
// 	// tạo đường đi ngẫu nhiên từ result
// 	let neighbors = generateAllNeighborSolutionUsingPermuation(result)
// 	// tìm neighbor tốt nhất trong tất cả neighbor đó
// 	let bestNeighborResult = findBestNeighborSolution(neighbors)
// 	while(bestNeighborResult.bestSolutionRouteLength < resultPathLength) {
// 		result = bestNeighborResult.bestSolution
// 		resultPathLength = bestNeighborResult.bestSolutionRouteLength
// 		neighbors = generateAllNeighborSolutionUsingPermuation(result)
// 		bestNeighborResult = findBestNeighborSolution(neighbors)
// 	}

// 	return {
// 		result,
// 		resultPathLength
// 	}
// }

// Dạng 3
// Đảo chuỗi con
function hillClimbing() {
	let result = randomPath()
	let resultPathLength = getDistanceFromSolution(tsp, result)
	let counTotalStepAtCurrent = 0
	// Repeat these steps until current state does not change.
	while(counTotalStepAtCurrent <= 100) {
		// Among the generated neighbour states which are better than current state choose a state randomly
		let neighborRandom = generateNeighborSolutionUsingReserve(result)
		let neighborRandomPathLength = getDistanceFromSolution(tsp, neighborRandom)
		if(neighborRandomPathLength < resultPathLength) {
			result = [...neighborRandom]
			resultPathLength = neighborRandomPathLength
			counTotalStepAtCurrent = 0
		}
		counTotalStepAtCurrent++
		console.log(counTotalStepAtCurrent, result, resultPathLength)
	}
	return {
		result,
		resultPathLength
	}
}