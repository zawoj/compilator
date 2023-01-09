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

const astValidation = new AstValidation(ast);
// console.log(astValidation.errors);

const codeGenerator = new CodeGenerator(ast);
codeGenerator.generateCode();
codeGenerator.endProgram();
codeGenerator.astLabelCleaner();
fs.writeFileSync('ast.json', JSON.stringify(ast, null, 2));
fs.writeFileSync('result.asm', codeGenerator.getFlatAst().join('\r\n'));

module.exports = parser;
// function div(m: number, n: number) {
//   // q is a temporary n, sum is the quotient
//   let q,
//     sum = 0;
//   let i;

//   while (m > n) {
//     i = 0;
//     q = n;

//     // double q until it's larger than m and record the exponent
//     while (q <= m) {
//       q <<= 1;
//       ++i;
//     }

//     i--;
//     q >>= 1; // q is one factor of 2 too large
//     sum += 1 << i; // add one bit of the quotient
//     m -= q; // new numerator
//   }

//   return sum;
// }

// console.log(div(9, 3));
