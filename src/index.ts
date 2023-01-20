import AstValidation from './astValidation';
import { CodeGenerator } from './codeGenerator';
const Parser = require('jison').Parser;
const jison = require('jison');
const fs = require('fs');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage:');
  console.log('node index.js <input> [output] [-force]');
  process.exit(1);
}

jison.print = function () {};

const bnf = fs.readFileSync('grammar.jison', 'utf8');
const parser = new Parser(bnf);

// Pare file ex3.imp and print the AST
const source = fs.readFileSync(args[0], 'utf8');
const ast = parser.parse(source);

if (args[2] !== '-force' && args[1] !== '-force') {
  const astValidation = new AstValidation(ast, source);
  astValidation.runValidation();
}

const codeGenerator = new CodeGenerator(ast);
codeGenerator.generateCode();
codeGenerator.endProgram();
codeGenerator.astLabelCleaner();
fs.writeFileSync(
  args[1] !== undefined && args[1] !== '-force' ? args[1] : 'out.asm',
  codeGenerator.getFlatAst().join('\r\n')
);

module.exports = parser;
