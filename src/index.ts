const Parser = require('jison').Parser;

const fs = require('fs');

const bnf = fs.readFileSync('grammar.jison', 'utf8');
const parser = new Parser(bnf);

// Pare file ex3.imp and print the AST
const source = fs.readFileSync('ex3.imp', 'utf8');
const ast = parser.parse(source);
// Display whole AST
// console.log(JSON.stringify(ast, null, 2));
// Write AST to file
fs.writeFileSync('ast.json', JSON.stringify(ast, null, 2));

module.exports = parser;
