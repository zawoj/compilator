"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
var conditionGen_1 = require("./generators/conditionGen");
var expressionGen_1 = require("./generators/expressionGen");
var CodeGenerator = /** @class */ (function () {
    function CodeGenerator(ast) {
        this.ast = ast;
        this.varibles = {};
        this.variblesIndex = 1;
        this.flatAst = [];
        this.procedures = new Map();
        this.labelIndex = 0;
    }
    CodeGenerator.prototype.generateCode = function () {
        var _this = this;
        // Set program variables registers as normal names
        this.ast.program.variables.forEach(function (variable) {
            _this.varibles[variable] = _this.variblesIndex.toString();
            _this.variblesIndex++;
        });
        // Expression varible holder (for help with expressions)
        this.varibles['exv'] = this.variblesIndex.toString();
        this.variblesIndex++;
        //  Set procedure variables registers as special names (procName_arg/var_name)
        if (this.ast.procedures) {
            this.ast.procedures.forEach(function (procedure) {
                if (procedure.variables) {
                    // Set variables
                    procedure.variables.forEach(function (variable) {
                        _this.varibles["".concat(procedure.head.name, "_var_").concat(variable)] =
                            _this.variblesIndex.toString();
                        _this.variblesIndex++;
                    });
                }
                if (procedure.head.variables) {
                    // Set arguments
                    procedure.head.variables.forEach(function (arg) {
                        _this.varibles["".concat(procedure.head.name, "_arg_").concat(arg)] =
                            _this.variblesIndex.toString();
                        _this.variblesIndex++;
                    });
                }
                // Set jump back variable
                procedure.jumpLabel = _this.generateUniqueLabel();
                _this.procedures.set(procedure.head.name, procedure);
                _this.varibles[procedure.head.name + '_back'] =
                    _this.variblesIndex.toString();
                _this.variblesIndex++;
            });
        }
        // START GENERATION //
        var startLabel = this.generateUniqueLabel();
        this.flatAst.push("JUMP ".concat(startLabel));
        // Genereate procedures
        this.procedures.forEach(function (proc) {
            // GEN PROC CODE
            _this.generateProc(proc);
        });
        // Generate program
        this.flatAst.push("".concat(startLabel));
        this.ast.program.commands.forEach(function (command) {
            _this.generateCommand(command);
        });
    };
    CodeGenerator.prototype.generateCommand = function (command, procName) {
        switch (command.type) {
            case 'WHILE':
                this.generateWhile(command, procName);
                break;
            case 'IF':
                this.generateIf(command, procName);
                break;
            case 'ASSIGN':
                this.generateAssign(command, procName);
                break;
            case 'READ':
                this.generateRead(command, procName);
                break;
            case 'WRITE':
                this.generateWrite(command, procName);
                break;
            case 'REPEAT':
                this.generateRepeat(command, procName);
                break;
            case 'EXPRESSION':
                this.generateExpression(command, procName);
                break;
            case 'PROCCALL':
                this.generateProcCall(command, procName);
            default:
                break;
        }
    };
    CodeGenerator.prototype.generateWhile = function (command, procName) {
        var _this = this;
        var trueLabel = this.generateUniqueLabel();
        var falseLabel = this.generateUniqueLabel();
        var returnLabel = this.generateUniqueLabel();
        var conditions = new conditionGen_1.ConditionGenerator(command.condition, trueLabel, falseLabel, this);
        var conditionCode = conditions.generate(procName).code;
        this.flatAst.push("".concat(returnLabel));
        conditionCode.forEach(function (command) {
            _this.flatAst.push(command);
        });
        this.flatAst.push("".concat(trueLabel));
        command.commands.forEach(function (command) {
            _this.generateCommand(command, procName);
        });
        this.flatAst.push("JUMP ".concat(returnLabel));
        this.flatAst.push("".concat(falseLabel));
    };
    CodeGenerator.prototype.generateIf = function (command, procName) {
        var _this = this;
        var trueLabel = this.generateUniqueLabel();
        var falseLabel = this.generateUniqueLabel();
        var label3 = this.generateUniqueLabel();
        var conditions = new conditionGen_1.ConditionGenerator(command.condition, trueLabel, falseLabel, this);
        var conditionCode = conditions.generate(procName).code;
        conditionCode.forEach(function (command) {
            _this.flatAst.push(command);
        });
        // IF COMMANDS
        this.flatAst.push("".concat(trueLabel));
        command.commands.forEach(function (command) {
            _this.generateCommand(command, procName);
        });
        if (command.elseCommands.length > 0) {
            this.flatAst.push("JUMP ".concat(label3));
            this.flatAst.push("".concat(falseLabel));
            // ELSE COMMENDS
            command.elseCommands.forEach(function (command) {
                _this.generateCommand(command, procName);
            });
            this.flatAst.push("".concat(label3));
        }
        else {
            this.flatAst.push("".concat(falseLabel));
        }
    };
    CodeGenerator.prototype.generateAssign = function (command, procName) {
        // Generate asm code for ASSIGN command and get the varible from the varibles map
        // Check if the value is a number or a variable
        if (command.value.type === 'VALUE') {
            var variableIndex = this.getVarible(command.identifier, procName);
            var STORE = variableIndex.isArg ? 'STOREI' : 'STORE';
            this.flatAst.push("SET ".concat(command.value.value));
            this.flatAst.push("".concat(STORE, " ").concat(variableIndex.index));
        }
        else if (command.value.type === 'IDENTIFIER') {
            var variableIndex1 = this.getVarible(command.value.name, procName);
            var variableIndex2 = this.getVarible(command.identifier, procName);
            var LOAD = variableIndex1.isArg ? 'LOADI' : 'LOAD';
            var STORE = variableIndex2.isArg ? 'STOREI' : 'STORE';
            this.flatAst.push("".concat(LOAD, " ").concat(variableIndex1.index));
            this.flatAst.push("".concat(STORE, " ").concat(variableIndex2.index));
        }
        else {
            this.generateExpression(command.value, procName);
            var variableIndex = this.getVarible(command.identifier, procName);
            var STORE = variableIndex.isArg ? 'STOREI' : 'STORE';
            this.flatAst.push("".concat(STORE, " ").concat(variableIndex.index));
        }
    };
    CodeGenerator.prototype.generateRead = function (command, procName) {
        // Generate asm code for READ command and get the varible from the varibles map
        // Read the value and habe to save in register
        var variableIndex = this.getVarible(command.value, procName);
        this.flatAst.push("GET ".concat(variableIndex.index));
    };
    CodeGenerator.prototype.generateWrite = function (command, procName) {
        // Generate asm code for WRITE command and get the varible from the varibles map
        // Write the value from register
        // Check if the value is a number or a variable
        if (command.value.type === 'VALUE') {
            this.flatAst.push("SET ".concat(command.value.value));
            this.flatAst.push("PUT 0");
        }
        else {
            var variableIndex = this.getVarible(command.value.name, procName);
            if (variableIndex.isArg) {
                this.flatAst.push("LOADI ".concat(variableIndex.index));
            }
            else {
                this.flatAst.push("LOAD ".concat(variableIndex.index));
            }
            this.flatAst.push("PUT 0");
        }
    };
    CodeGenerator.prototype.generateRepeat = function (command, procName) {
        var _this = this;
        var trueLabel = this.generateUniqueLabel();
        var falseLabel = this.generateUniqueLabel();
        var conditions = new conditionGen_1.ConditionGenerator(command.condition, trueLabel, falseLabel, this);
        var conditionCode = conditions.generate(procName).code;
        this.flatAst.push("".concat(falseLabel));
        command.commands.forEach(function (command) {
            _this.generateCommand(command, procName);
        });
        conditionCode.forEach(function (command) {
            _this.flatAst.push(command);
        });
        this.flatAst.push("".concat(trueLabel));
    };
    CodeGenerator.prototype.generateExpression = function (command, procName) {
        // Generate asm code for EXPRESSION command and get the varible from the varibles map
        // Check if the value is a number or a variable
        switch (command.operator) {
            case '+':
                (0, expressionGen_1.addGen)(this, command.left, command.right, procName);
                break;
            case '-':
                (0, expressionGen_1.subGen)(this, command.left, command.right, procName);
                break;
            case '*':
                (0, expressionGen_1.mulGen)(this, command.left, command.right, procName);
                break;
            case '/':
                (0, expressionGen_1.divGen)(this, command.left, command.right, procName);
                break;
            case '%':
                (0, expressionGen_1.modGen)(this, command.left, command.right, procName);
                break;
            default:
                break;
        }
    };
    // PROCEDURES //
    CodeGenerator.prototype.generateProcCall = function (procCall, procName) {
        var _this = this;
        var thisProc = this.procedures.get(procCall.name);
        // Set the arguments
        if (procCall.variables.length > 0) {
            // If call procedure inside procedure
            if (procName) {
                procCall.variables.forEach(function (variable, index) {
                    var propValue = _this.getVarible(variable, procName);
                    if (propValue.isArg) {
                        _this.flatAst.push("LOAD ".concat(propValue.index));
                        _this.flatAst.push("STORE ".concat(_this.varibles["".concat(procCall.name, "_arg_").concat(thisProc === null || thisProc === void 0 ? void 0 : thisProc.head.variables[index])]));
                    }
                    else {
                        _this.flatAst.push("SET ".concat(propValue.index));
                        _this.flatAst.push("STORE ".concat(_this.varibles["".concat(procCall.name, "_arg_").concat(thisProc === null || thisProc === void 0 ? void 0 : thisProc.head.variables[index])]));
                    }
                });
            }
            // If call procedure inside main
            else {
                procCall.variables.forEach(function (variable, index) {
                    // index rejestru argumentu od programu głównego, bedzie troche ciezej gdy bedzie to od innej procedury
                    _this.flatAst.push("SET ".concat(_this.varibles[variable]));
                    // index rejestru zmiennej
                    _this.flatAst.push("STORE ".concat(_this.varibles["".concat(procCall.name, "_arg_").concat(thisProc === null || thisProc === void 0 ? void 0 : thisProc.head.variables[index])]));
                });
            }
        }
        // Set the back label and JUMPS
        var jumpLabel = this.generateUniqueLabel();
        this.flatAst.push("SET ".concat(jumpLabel));
        this.flatAst.push("STORE ".concat(this.varibles[procCall.name + '_back']));
        this.flatAst.push("JUMP ".concat(thisProc === null || thisProc === void 0 ? void 0 : thisProc.jumpLabel));
        this.flatAst.push("".concat(jumpLabel));
    };
    CodeGenerator.prototype.generateProc = function (proc) {
        var _this = this;
        this.flatAst.push("".concat(proc.jumpLabel));
        proc.commands.forEach(function (command) {
            _this.generateCommand(command, proc.head.name);
        });
        this.flatAst.push("JUMPI ".concat(this.varibles[proc.head.name + '_back']));
    };
    // HELPER METHODS //
    CodeGenerator.prototype.generateUniqueLabel = function () {
        return "label".concat(this.labelIndex++);
    };
    CodeGenerator.prototype.getFlatAst = function () {
        return this.flatAst;
    };
    CodeGenerator.prototype.astLabelCleaner = function () {
        var _this = this;
        // Get indexs of labels
        var labelHash = new Map();
        var iterationCorrection = 0;
        this.flatAst.forEach(function (item, index) {
            if (item.includes('label') &&
                !item.includes('JUMP') &&
                !item.includes('JPOS') &&
                !item.includes('JZERO') &&
                !item.includes('JUMPI') &&
                !item.includes('SET')) {
                labelHash.set(item, index - iterationCorrection);
                iterationCorrection++;
            }
        });
        // Replace JUMP label with JUMP index and re
        this.flatAst.forEach(function (item, index) {
            if (item.includes('JUMP') && !item.includes('JUMPI')) {
                var label = item.split(' ')[1];
                _this.flatAst[index] = "JUMP ".concat(labelHash.get(label));
            }
            else if (item.includes('JPOS')) {
                var label = item.split(' ')[1];
                _this.flatAst[index] = "JPOS ".concat(labelHash.get(label));
            }
            else if (item.includes('JZERO')) {
                var label = item.split(' ')[1];
                _this.flatAst[index] = "JZERO ".concat(labelHash.get(label));
            }
            else if (item.includes('JUMPI')) {
                var label = item.split(' ')[1];
                if (label.includes('label')) {
                    _this.flatAst[index] = "JUMPI ".concat(labelHash.get(label));
                }
            }
            else if (item.includes('SET')) {
                var label = item.split(' ')[1];
                if (label.includes('label')) {
                    _this.flatAst[index] = "SET ".concat(labelHash.get(label));
                }
            }
        });
        // Remove labels
        this.flatAst = this.flatAst.filter(function (item) {
            return !item.includes('label');
        });
    };
    CodeGenerator.prototype.getVarible = function (varName, procName) {
        // if we are in procedure
        if (procName) {
            if ("".concat(procName, "_arg_").concat(varName) in this.varibles) {
                return {
                    index: this.varibles["".concat(procName, "_arg_").concat(varName)],
                    isArg: true,
                };
            }
            else if ("".concat(procName, "_var_").concat(varName) in this.varibles) {
                return {
                    index: this.varibles["".concat(procName, "_var_").concat(varName)],
                    isArg: false,
                };
            }
            else {
                return {
                    index: this.varibles["".concat(varName)],
                    isArg: false,
                };
            }
        }
        else {
            return {
                index: this.varibles["".concat(varName)],
                isArg: false,
            };
        }
    };
    // Generate unique varibles and return name
    CodeGenerator.prototype.generateUniqueVar = function () {
        this.variblesIndex++;
        this.varibles["var".concat(this.variblesIndex)] = this.variblesIndex.toString();
        return "var".concat(this.variblesIndex);
    };
    // END PROGRAM
    CodeGenerator.prototype.endProgram = function () {
        this.flatAst.push('HALT');
    };
    return CodeGenerator;
}());
exports.CodeGenerator = CodeGenerator;
