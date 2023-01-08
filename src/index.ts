import AstValidation from './astValidation';
import { CodeGenerator } from './codeGenerator';
const Parser = require('jison').Parser;
const jison = require('jison');
const fs = require('fs');

// const args = process.argv.slice(2);

// // Read grammar file and create parser
// Parser.logs = false;
// const bnf = fs.readFileSync('grammar.jison', 'utf8');
// const parser = new Parser(bnf);

// // Pare file ex3.imp and print the AST
// const source = fs.readFileSync(args[0], 'utf8');
// const ast = parser.parse(source);

// fs.writeFileSync(args[1], JSON.stringify(ast, null, 2));

// Turn off logging
jison.print = function () {};

const bnf = fs.readFileSync('grammar.jison', 'utf8');
const parser = new Parser(bnf);

// Pare file ex3.imp and print the AST
const source = fs.readFileSync('ex3.imp', 'utf8');
const ast = parser.parse(source);
fs.writeFileSync('ast.json', JSON.stringify(ast, null, 2));

const astValidation = new AstValidation(ast);
// console.log(astValidation.errors);

const codeGenerator = new CodeGenerator(ast);
codeGenerator.generateCode();
codeGenerator.astLabelCleaner();
fs.writeFileSync('result.asm', codeGenerator.getFlatAst().join('\r\n'));

module.exports = parser;
