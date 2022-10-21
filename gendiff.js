import { Command } from 'commander';
import _ from 'lodash';
import fs from 'fs';

const program = new Command();


program.name('gendiff')
    .description('Compares two configuration files and shows a difference.')
    .argument('<filepath1> <filepath2>')
    .option('-V, --version', 'output the version number')
    .option('-f, --format <type>', 'output format')
    .action(function (first, second, options) {
       genDiff(options.rawArgs[2], options.rawArgs[3])
    })


const genDiff = (firstFile, secondFile) => {
    const first = Object.fromEntries(_.sortBy(Object.entries(JSON.parse(fs.readFileSync(firstFile, 'utf-8')))));
    const second = Object.fromEntries(_.sortBy(Object.entries(JSON.parse(fs.readFileSync(secondFile, 'utf-8')))));
    
    const result = {};
    for (let key in first) {
        if (second[key]) {
            if (first[key] === second[key]) result[` ${key}`] = first[key];
            if (first[key] !== second[key]) {
                result[`- ${key}`] = first[key];
                result[`+ ${key}`] = second[key];
            }
        } else if (!second[key]){
            result[`- ${key}`] = first[key];
        }
    }

    for (let key in second) {
        if (!first[key]) result[`+ ${key}`] = second[key];
    }
    console.log(result);
};


program.parse();