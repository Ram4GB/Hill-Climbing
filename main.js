const { read_file } = require('./read_file')
const { resolve_problem } = require('./resolve_problem')

const main = async () => {
    try {
        await read_file({ type: 'tsp_root' })
        await read_file({ type: 'dist_root' })
        await resolve_problem()
    } catch (error) {
        console.log(error)
    }
}

main()