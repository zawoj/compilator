"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionGenerator = void 0;
var ConditionGenerator = /** @class */ (function () {
    function ConditionGenerator(conditon, trueLabelJump, falseLabelJump, codeGen) {
        this.code = [];
        this.trueLabelJump = trueLabelJump;
        this.falseLabelJump = falseLabelJump;
        this.codeGen = codeGen;
        this.conditon = conditon;
    }
    ConditionGenerator.prototype.generate = function (procName) {
        switch (this.conditon.operator) {
            case '=':
                this.equal(procName);
                break;
            case '!=':
                this.notEqual(procName);
                break;
            case '>':
                this.greaterThan(procName);
                break;
            case '<':
                this.lessThan(procName);
                break;
            case '>=':
                this.greaterThanOrEqual(procName);
                break;
            case '<=':
                this.lessThanOrEqual(procName);
                break;
            default:
                break;
        }
        return {
            code: this.code,
        };
    };
    ConditionGenerator.prototype.equal = function (procName) {
        if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'VALUE') {
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("JUMP ".concat(this.trueLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var variableIndex2 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD1 = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            var LOAD2 = variableIndex2.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("JUMP ".concat(this.trueLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'VALUE') {
            var variableIndex = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD = variableIndex.isArg ? 'LOADI' : 'LOAD';
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("JUMP ".concat(this.trueLabelJump));
        }
        else if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex = this.codeGen.getVarible(this.conditon.right.name, procName);
            var LOAD = variableIndex.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.falseLabelJump));
            this.code.push("JUMP ".concat(this.trueLabelJump));
        }
    };
    ConditionGenerator.prototype.notEqual = function (procName) {
        console.log(this.conditon.left);
        console.log(this.conditon.right);
        if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'VALUE') {
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var variableIndex2 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD1 = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            var LOAD2 = variableIndex2.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'VALUE') {
            var variableIndex = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD = variableIndex.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex = this.codeGen.getVarible(this.conditon.right.name, procName);
            var LOAD = variableIndex.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD, " ").concat(variableIndex.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
    };
    ConditionGenerator.prototype.lessThan = function (procName) {
        if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'VALUE') {
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var variableIndex2 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD1 = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            var LOAD2 = variableIndex2.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'VALUE') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
    };
    ConditionGenerator.prototype.greaterThan = function (procName) {
        if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'VALUE') {
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var variableIndex2 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD1 = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            var LOAD2 = variableIndex2.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'VALUE') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JPOS ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
    };
    ConditionGenerator.prototype.greaterThanOrEqual = function (procName) {
        if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'VALUE') {
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var variableIndex2 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD1 = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            var LOAD2 = variableIndex2.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'VALUE') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
    };
    ConditionGenerator.prototype.lessThanOrEqual = function (procName) {
        if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'VALUE') {
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var variableIndex2 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD1 = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            var LOAD2 = variableIndex2.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD1, " ").concat(variableIndex1.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD2, " ").concat(variableIndex2.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'IDENTIFIER' &&
            this.conditon.right.type === 'VALUE') {
            var variableIndex1 = this.codeGen.getVarible(this.conditon.left.name, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            this.code.push("SET ".concat(this.conditon.right.value));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
        else if (this.conditon.left.type === 'VALUE' &&
            this.conditon.right.type === 'IDENTIFIER') {
            var variableIndex2 = this.codeGen.getVarible(this.conditon.right.name, procName);
            var LOAD = variableIndex2.isArg ? 'LOADI' : 'LOAD';
            this.code.push("".concat(LOAD, " ").concat(variableIndex2.index));
            this.code.push("STORE ".concat(this.codeGen.varibles['exv']));
            this.code.push("SET ".concat(this.conditon.left.value));
            this.code.push("SUB ".concat(this.codeGen.varibles['exv']));
            this.code.push("JZERO ".concat(this.trueLabelJump));
            this.code.push("JUMP ".concat(this.falseLabelJump));
        }
    };
    return ConditionGenerator;
}());
exports.ConditionGenerator = ConditionGenerator;
