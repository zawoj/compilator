"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var astValidation_1 = __importDefault(require("./astValidation"));
var codeGenerator_1 = require("./codeGenerator");
var Parser = require('jison').Parser;
var jison = require('jison');
var fs = require('fs');
var path_1 = __importDefault(require("path"));
var args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage:');
    console.log('node index.js <input> [output] [-force]');
    process.exit(1);
}
jison.print = function () { };
// get relative path to grammar file which is in src folder
var bnf = fs.readFileSync(path_1.default.resolve(__dirname, 'grammar.jison'), 'utf8');
var parser = new Parser(bnf);
// Pare file ex3.imp and print the AST
var source = fs.readFileSync(args[0], 'utf8');
var ast = parser.parse(source);
var findForceFlag = args.find(function (arg) { return arg === '-force'; });
if (!findForceFlag) {
    var astValidation = new astValidation_1.default(ast, source);
    astValidation.runValidation();
}
var codeGenerator = new codeGenerator_1.CodeGenerator(ast);
codeGenerator.generateCode();
codeGenerator.endProgram();
codeGenerator.astLabelCleaner();
if (!findForceFlag) {
    fs.writeFileSync(args[1] !== undefined ? args[1] : 'out.asm', codeGenerator.getFlatAst().join('\r\n'));
}
else if (findForceFlag) {
    var findOutPutFile = args.find(function (arg, index) { return arg !== '-force' && index > 0; });
    fs.writeFileSync(findOutPutFile !== undefined ? findOutPutFile : 'out.asm', codeGenerator.getFlatAst().join('\r\n'));
}
module.exports = parser;
