const fs = require('fs')
const { shotgunHillClimbing, createPath, createTSPMap, findMinItemsInArray } = require('./index')
const _ = require('lodash')

const problems = [
    {
        pathLength: 5,
        exceedTime: 5000,
        pathData: './result/5cities/index.txt',
        pathRootFolder: './result/5cities',
        link: 'https://people.sc.fsu.edu/~jburkardt/datasets/tsp/tsp.html'
    },
    {
        pathLength: 15,
        exceedTime: 5000,
        pathData: './result/15cities/index.txt',
        pathRootFolder: './result/15cities',
        link: 'https://people.sc.fsu.edu/~jburkardt/datasets/tsp/tsp.html'
    },
    {
        pathLength: 17,
        exceedTime: 5000,
        pathData: './result/17cities/index.txt',
        pathRootFolder: './result/17cities',
        link: 'https://people.sc.fsu.edu/~jburkardt/datasets/tsp/tsp.html'
    },
    {
        pathLength: 26,
        exceedTime: 5000,
        pathData: './result/26cities/index.txt',
        pathRootFolder: './result/26cities',
        link: 'https://people.sc.fsu.edu/~jburkardt/datasets/tsp/tsp.html'
    },
    {
        pathLength: 42,
        exceedTime: 5000,
        pathData: './result/42cities/index.txt',
        pathRootFolder: './result/42cities',
        link: 'https://people.sc.fsu.edu/~jburkardt/datasets/tsp/tsp.html'
    },
    {
        pathLength: 48,
        exceedTime: 5000,
        pathData: './result/48cities/index.txt',
        pathRootFolder: './result/48cities',
        link: 'https://people.sc.fsu.edu/~jburkardt/datasets/tsp/tsp.html'
    },
    {
        pathLength: 6,
        exceedTime: 5000,
        pathData: './result/demo/index.txt',
        pathRootFolder: './result/demo'
    },
]

async function main() {
    let time = new Date().toDateString()
    for(let i = 0 ; i < problems.length; i++) {
        try {
            const amountOfRandom = 5000
            const tsp = await createTSPMap(problems[i].pathData)
            const pathLength = problems[i].pathLength
            const exceedTime = problems[i].exceedTime
            if (!fs.existsSync(problems[i].pathRootFolder + "/" + time)){
                fs.mkdirSync(problems[i].pathRootFolder + "/" + time);
            }
            let pathRoot = problems[i].pathRootFolder + "/" + time + "/"
            // chạy 1->3 chiến lược
            for(let j = 1; j <= 3; j++) {
                const pathResource = createPath(pathRoot + "hillclimbing" + "_" + problems[i].pathLength + "_", j)
                let result = shotgunHillClimbing({tsp, exceedTime, type: j, path: pathResource, pathLength, isTracking: true, isSaveFile: true, amountOfRandom})
                if(fs.existsSync(problems[i].pathRootFolder + '/statistics.json')) {
                    let value = fs.readFileSync(problems[i].pathRootFolder + '/statistics.json', { encoding:'utf-8' })
                    value = JSON.parse(value)
                    let min = value.min
                    let array = value.array
                    if(min == result.bestPathLength) {
                        console.log('Append array min', min)
                        let temp = findMinItemsInArray(result.history, "resultPathLength")
                        temp = temp.result
                        temp = _.uniqWith([...temp, ...array], function(arrVal, othVal){
                            return arrVal.result.toString() === othVal.result.toString();
                        })
                        array.push(...temp)
                    } else if(min > result.bestPathLength) {
                        console.log('Update new min', min)
                        let temp = findMinItemsInArray(result.history, "resultPathLength")
                        temp = temp.result
                        temp = _.uniqWith(temp, function(arrVal, othVal){
                            return arrVal.result.toString() === othVal.result.toString();
                        })
                        min = result.bestPathLength
                        array = [...temp]
                    }
                    fs.writeFileSync(problems[i].pathRootFolder + '/statistics.json', JSON.stringify({min, array}), { encoding:'utf-8', flag: 'w' })
                } else {
                    let min = 0
                    let array = []
                    min = result.bestPathLength
                    console.log('Init min ', min)
                    let temp = findMinItemsInArray(result.history, "resultPathLength")
                    temp = temp.result
                    temp = _.uniqWith(temp, function(arrVal, othVal){
                        return arrVal.result.toString() === othVal.result.toString();
                    })
                    array = [...temp]
                    fs.writeFileSync(problems[i].pathRootFolder + '/statistics.json', JSON.stringify({min, array}), { encoding:'utf-8', flag: 'w' })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

main()