import { program } from 'commander'

program
    .option('-d, --debug', 'variable para debug', false)
    .option('-m, --mode <mode>', 'ambiente a trabajar', 'dev')
    .option('-p, --port <number>', 'puerto a trabajar', 4000)
    .parse(process.argv)

//console.log(+program.opts().port)

export default program