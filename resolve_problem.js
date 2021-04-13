const fs = require('fs')
const { shotgunHillClimbing, createPath, createTSPMap, findMinItemsInArray } = require('./index')
const _ = require('lodash')
const resultPath = './result'
const amountOfRandom = 2000

async function main() {
    let problems
    if(fs.existsSync('./data/problems.json')) {
        problems = require('./data/problems.json')
    }

    if(!problems) throw new Error("missing file problems.json")

    // tính theo ngày hiện tại
    let time = new Date().toDateString()
    for(let i = 0 ; i < problems.length; i++) {
        try {
            // tạo folder cho từng problem
            if(!fs.existsSync('./result/' + problems[i].name)) {
                fs.mkdirSync('./result/' + problems[i].name)
            } 

            const tsp = await createTSPMap('./data/dist/' + problems[i].name + '.d.txt')
            if(tsp.length > 50) {
                console.log('=======> Skip file ' + tsp.length)
                continue
            }
            const pathLength = tsp.length
            const exceedTime = problems[i].exceedTime

            // lưu folder theo ngày
            if (!fs.existsSync(resultPath + "/" + problems[i].name + "/" + time)){
                fs.mkdirSync(resultPath + "/" + problems[i].name + "/" + time);
            }

            let pathRoot = resultPath + "/" + problems[i].name + "/" + time
            // chạy 1->3 chiến lược
            for(let j = 1; j <= 3; j++) {
                const pathResource = createPath(pathRoot + "/" + "hillclimbing" + "_" + pathLength + "_", j)
                let result = shotgunHillClimbing({tsp, exceedTime, type: j, path: pathResource, pathLength, isTracking: true, isSaveFile: true, amountOfRandom})
                if(fs.existsSync(resultPath + "/" + problems[i].name + '/statistics.json')) {
                    let value = fs.readFileSync(resultPath + "/" + problems[i].name + '/statistics.json', { encoding:'utf-8' })
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
                    fs.writeFileSync(resultPath + "/" + problems[i].name + '/statistics.json', JSON.stringify({min, array}), { encoding:'utf-8', flag: 'w' })
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
                    fs.writeFileSync(resultPath + "/" + problems[i].name + '/statistics.json', JSON.stringify({min, array}), { encoding:'utf-8', flag: 'w' })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

// main()

module.exports = {
    resolve_problem: main
}