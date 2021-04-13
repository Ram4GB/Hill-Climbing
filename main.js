const { read_file, remove_file_in_folder } = require('./read_file')
const { resolve_problem } = require('./resolve_problem')
const fs = require('fs')

const main = async () => {
    try {
        await init()
        await read_file({ type: 'tsp_root' })
        await read_file({ type: 'dist_root' })
        console.log('Resolve start...')
        await resolve_problem()
    } catch (error) {
        console.log(error)
    }
}

async function init() {
    await remove_file_in_folder('coordinate')
    await remove_file_in_folder('dist')
    
    if(fs.existsSync('./data/problems.json')) {
        fs.unlinkSync('./data/problems.json')
    }

    await new Promise((resolve) => {
        setTimeout(() => {
            console.log('Wait for 3s to continue')
            resolve()
        }, 3000)   
    })
}

main()