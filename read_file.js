const LineByLine = require('line-by-line')
const fs = require('fs')
const pathData = './data'

async function readFileInFolderAsync() {
    try {
        let arrayFiles = []
        arrayFiles = await new Promise((resolve, reject) => {
            fs.readdir('./data/tsp', function(err, filenames) {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(filenames)
            })
        })

        if(!fs.existsSync(pathData + '/problems.json')) {
            fs.writeFileSync(pathData + '/problems.json', JSON.stringify([]), { flag:'w', encoding: 'utf-8' })
        }

        for(let i = 0 ; i < arrayFiles.length; i++) {
            await readSingleFileAsync(arrayFiles[i])
            console.log('========> Done read file ', arrayFiles[i])
        }
    } catch (error) {
        console.log(error)
    }
}

function readSingleFileAsync(fileName) {
    return new Promise((resolve, reject) => {
        let split = fileName.split('.')
        let name = split[0]
        let lr = new LineByLine(pathData + '/tsp/' + fileName)

        lr.on('error', function(error) {
            console.log(error)
            reject(error)
        })

        // ghi file từ line thứ 6 và đẩy vào mảng json
        let count = 0
        let s = ''
        lr.on('line', function(line) {
            if(count >= 6 && line != "EOF") {
                s += line + '\n'
            }
            count++
        })

        let out = pathData + '/coordinate/' + name + '.coordinate.txt'
        lr.on('end', function() {
            fs.writeFileSync(out, s, { flag: 'w', encoding: 'utf-8' })
            resolve()
        })
    })
}

async function calculateDistanceAsync() {
    try {
        let arrayFiles = []
        arrayFiles = await new Promise((resolve, reject) => {
            fs.readdir('./data/tsp', function(err, filenames) {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(filenames)
            })
        })

        for(let i = 0 ; i < arrayFiles.length; i++) {
            await calculateSingleFileAsync(arrayFiles[i])
            console.log('========> Done calculate distance file ', arrayFiles[i])
        }
    } catch (error) {
        console.log(error)
    }
}

function calculateSingleFileAsync(fileName) {
    return new Promise((resolve, reject) => {
        let split = fileName.split('.')
        let name = split[0]
        let lr = new LineByLine(pathData + '/coordinate/' + name + '.coordinate.txt')

        lr.on('error', function(error) {
            reject(error)
        })

        let arrayDistance = []
        lr.on('line', function(line) {
            let temp = line.split(" ").join(";")
            while(temp.indexOf(";;") !== -1) {
                temp = temp.split(";;").join(";")
            }
            temp = temp.split(";").filter(item => item !== "")
            arrayDistance.push(temp)
        })

        lr.on('end', function() {
            let problems = fs.readFileSync(pathData + '/problems.json', { encoding: 'utf-8' })
            problems = JSON.parse(problems)
            
            let index = problems.filter(item => item.name === name)
            if(index) {
                problems.push({
                    exceedTime: 1000,
                    name: name
                })
            }

            let matrix = ''
            for(let i = 0 ; i < arrayDistance.length; i++) {
                let row = ''
                for(let j = 0 ; j < arrayDistance.length; j++) {
                    if(i != j) {
                        row += eclideanDistace(arrayDistance[i][1], arrayDistance[i][2], arrayDistance[j][1], arrayDistance[j][2]) + " "
                    } else {
                        row += "0" + " "
                    }
                }
                matrix += row + '\n'
            }

            fs.writeFileSync(pathData + '/problems.json', JSON.stringify(problems) ,{ flag: 'w', encoding: 'utf-8'})
            fs.writeFileSync(pathData + '/dist/' + name + '.d.txt', matrix ,{ flag: 'w', encoding: 'utf-8'})
            resolve()
        })
        
    })
}

function eclideanDistace(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2 , 2))
}

async function handleFolderDistanceDownload() {
    let arrayFiles = []
    arrayFiles = await new Promise((resolve, reject) => {
        fs.readdir('./data/dist_download', function(err, filenames) {
            if (err) {
                reject(err)
                return;
            }
            resolve(filenames)
        })
    })
    arrayFiles.forEach((fileName) => {
        let split = fileName.split('.')
        let name = split[0]

        if(!fs.existsSync(pathData + '/problems.json')) {
            fs.writeFileSync(pathData + '/problems.json', JSON.stringify([]), { flag:'w', encoding: 'utf-8' })
        }

        let problems = fs.readFileSync(pathData + '/problems.json', { encoding: 'utf-8' })
        problems = JSON.parse(problems)
        
        let index = problems.filter(item => item.name === name)
        if(index) {
            fs.copyFileSync(pathData + '/' + 'dist_download/' + fileName, pathData + '/' + 'dist/' + fileName)
            problems.push({
                exceedTime: 1000,
                name: name
            })
        }
        fs.writeFileSync(pathData + '/problems.json', JSON.stringify(problems) ,{ flag: 'w', encoding: 'utf-8'})
        console.log('========> Done read file ' + fileName)
    })
}

async function main({ type }) {
    switch(type) {
        case 'tsp_root':
            // đọc file từ folder tsp và lấy dữ liệu x,y sang folder coordinate
            // do file tsp có nhiều dữ liệu hỗn tạp nên là phải chuyển sang file có cấu trúc
            await readFileInFolderAsync()
            // đọc file từ folder coordinate và chuyển tính toán khoảng cách lưu vào file distace
            // tính khoảng cách giữa các điểm và ghi vào file dist
            await calculateDistanceAsync()
        break
        case 'dist_root':
            // nếu như chúng ta có sẵn file dist rồi thì giờ chỉ cần append vào mảng problems
            await handleFolderDistanceDownload()
        break
        default:
            console.log('No option default')
    }
}

// main()

module.exports = {
    read_file: main
}