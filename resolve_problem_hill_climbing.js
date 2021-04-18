const { getDistanceFromSolution, hillClimbing, createTSPMap } = require('./index')

// sử dụng thuật toán hill_climbing để giải bài toán tsp

async function main() {
    // const tsp = await createTSPMap('./data/dist/gr17_d.d.txt')
    const tsp = await createTSPMap('./data/dist/st70.d.txt')
    // const pathLength = 17
    // const pathLength = 280
    // const exceedTime = 30
    // console.log(hillClimbing({ tsp, pathLength, exceedTime, type: 1 }))
    // console.log(tsp)
    console.log(getDistanceFromSolution(tsp, [
        1,
        36,
        29,
        13,
        70,
        35,
        31,
        69,
        38,
        59,
        22,
        66,
        63,
        57,
        15,
        24,
        19,
        7,
        2,
        4,
        18,
        42,
        32,
        3,
        8,
        26,
        55,
        49,
        28,
        14,
        20,
        30,
        44,
        68,
        27,
        46,
        25,
        45,
        39,
        61,
        40,
        9,
        17,
        43,
        41,
        6,
        53,
        5,
        10,
        52,
        60,
        12,
        34,
        21,
        33,
        62,
        54,
        48,
        67,
        11,
        64,
        65,
        56,
        51,
        50,
        58,
        37,
        47,
        16,
        23,                                                                                                                       
        1                             
    ].map(i => (i - 1))))
}

main()

module.exports = {
    resolve_problem_hill_climbing: main
}

// const tsp = [
//     [0.0, 3.0, 4.0, 2.0, 7.0],
//     [3.0, 0.0, 4.0, 6.0, 3.0],
//     [4.0, 4.0, 0.0, 5.0, 8.0],
//     [2.0, 6.0, 5.0, 0.0, 6.0],
//     [7.0, 3.0, 8.0, 6.0, 0.0],
// ]

// const tsp = [
//     [0, 20, 42, 31, 6, 24],
//     [10, 0, 17, 6, 35, 18],
//     [25, 5, 0, 27, 14, 9],
//     [12, 9, 24, 0, 30, 12],
//     [14, 7, 21, 15, 0, 38],
//     [40, 15, 16, 5, 20, 0],
// ];

// generateNeighborSolutionUsingReserve
// generateNeighborSolutionUsingInsertCity
// generateNeighborSolutionUsingPumatationTwoCity
// console.log(getDistanceFromSolution(tsp, [1, 4, 3, 2, 0, 1]))
// console.log(getDistanceFromSolution(tsp, [1, 2, 4, 3, 0, 1]))