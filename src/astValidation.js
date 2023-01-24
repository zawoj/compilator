"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var AstValidation = /** @class */ (function () {
    function AstValidation(ast, source) {
        this._errors = [];
        this.ast = ast;
        this.rawAst = source;
    }
    AstValidation.prototype.runValidation = function () {
        this.nameConflictCheck();
        this.checkUseNotDeclared();
        this.checkIfVarWasInitialized();
        this.checkIfProcedureIsDefined();
        this.printErrors();
    };
    AstValidation.prototype.nameConflictCheck = function () {
        var _this = this;
        // Check main procedure variables for name conflicts
        var programVariables = this.ast.program.variables;
        var duplicateElementa = this.tofindDuplicates(programVariables);
        if (duplicateElementa.length > 0) {
            this._errors.push("Error: Duplicate variable name conflict in main procedure: ".concat(duplicateElementa));
        }
        // Check main procedure statements for name conflicts
        if (this.ast.procedures) {
            this.ast.procedures.forEach(function (proc) {
                var error = false;
                // Check procedure arguments for name conflicts
                var duplicateArgs = _this.tofindDuplicates(proc.head.variables);
                if (duplicateArgs.length > 0) {
                    _this._errors.push("Error: Duplicate argument name conflict in procedure ".concat(proc.head.name, ": ").concat(duplicateArgs));
                    error = true;
                }
                // Check procedure variables for name conflicts
                var duplicateVars = _this.tofindDuplicates(proc.variables);
                if (duplicateVars.length > 0) {
                    _this._errors.push("Error: Duplicate variable name conflict in procedure ".concat(proc.head.name, ": ").concat(duplicateVars));
                    error = true;
                }
                var varAndArgs = proc.head.variables.concat(proc.variables);
                var duplicateVarAndArgs = _this.tofindDuplicates(varAndArgs);
                if (duplicateVarAndArgs.length > 0 && !error) {
                    _this._errors.push("Error: Duplicate variable and argument name conflict in procedure ".concat(proc.head.name, ": ").concat(duplicateVarAndArgs));
                }
            });
        }
    };
    AstValidation.prototype.checkUseNotDeclared = function () {
        var _this = this;
        // Find all commands that are type IDENTIFIER in recursive function
        var progIdentifiers = this.findIdentifiers(this.ast.program.commands);
        progIdentifiers.forEach(function (identifier) {
            if (!_this.ast.program.variables.includes(identifier.name)) {
                _this._errors.push("Error: Variable ".concat(identifier.name, " is not declared in main procedure"));
            }
        });
        if (this.ast.procedures) {
            this.ast.procedures.forEach(function (proc) {
                var procIdentifiers = _this.findIdentifiers(proc.commands);
                var varsAndArgs = proc.head.variables.concat(proc.variables);
                procIdentifiers.forEach(function (identifier) {
                    if (!varsAndArgs.includes(identifier.name)) {
                        _this._errors.push("Error: Variable ".concat(identifier.name, " is not declared in procedure ").concat(proc.head.name));
                    }
                });
            });
        }
    };
    AstValidation.prototype.checkIfDeclared = function (cmd) {
        // Check if variable is declared in main procedure
        var programVariables = this.ast.program.variables;
        if (programVariables.includes(cmd.name)) {
            return true;
        }
        // Check if variable is declared in procedure
        if (this.ast.procedures) {
            this.ast.procedures.forEach(function (proc) {
                var procVariables = proc.variables;
                if (procVariables.includes(cmd.name)) {
                    return true;
                }
            });
        }
        return false;
    };
    AstValidation.prototype.checkIfProcedureIsDefined = function () {
        var _this = this;
        // Check if procedure is defined
        var procCalls = this.findProcCalls(this.ast.program.commands);
        if (this.ast.procedures) {
            var procNames_1 = this.ast.procedures.map(function (proc) { return proc.head.name; });
            procCalls.forEach(function (procCall) {
                if (!procNames_1.includes(procCall.name)) {
                    _this._errors.push("Error: Procedure ".concat(procCall.name, " is not defined"));
                }
            });
        }
    };
    AstValidation.prototype.checkIfVarWasInitialized = function () {
        this.varInitializedCheckerHelper(this.ast.program.commands);
    };
    AstValidation.prototype.varInitializedCheckerHelper = function (cmd, currentValuesVars, procName) {
        var _this = this;
        if (currentValuesVars === void 0) { currentValuesVars = []; }
        var varsWithValue = __spreadArray([], currentValuesVars, true);
        // Just assing and read commands can initialize a variable
        cmd.forEach(function (cmd) {
            switch (cmd.type) {
                case 'ASSIGN':
                    varsWithValue.push(cmd.identifier);
                    if (cmd.value.type === 'IDENTIFIER' &&
                        varsWithValue.indexOf(cmd.value.name) === -1) {
                        if (procName) {
                            _this._errors.push("Error: Variable ".concat(cmd.value.name, " is not initialized in procedure ").concat(procName));
                        }
                        else {
                            _this._errors.push("Error: Variable ".concat(cmd.value.name, " is not initialized"));
                        }
                    }
                    if (cmd.value.type === 'EXPRESSION') {
                        if (cmd.value.left.type === 'IDENTIFIER' &&
                            varsWithValue.indexOf(cmd.value.left.name) === -1) {
                            if (procName) {
                                _this._errors.push("Error: Variable ".concat(cmd.value.left.name, " is not initialized in procedure ").concat(procName));
                            }
                            else {
                                _this._errors.push("Error: Variable ".concat(cmd.value.left.name, " is not initialized"));
                            }
                        }
                        if (cmd.value.right.type === 'IDENTIFIER' &&
                            varsWithValue.indexOf(cmd.value.right.name) === -1) {
                            if (procName) {
                                _this._errors.push("Error: Variable ".concat(cmd.value.right.name, " is not initialized in procedure ").concat(procName));
                            }
                            else {
                                _this._errors.push("Error: Variable ".concat(cmd.value.right.name, " is not initialized"));
                            }
                        }
                    }
                    break;
                case 'WRITE':
                    if (cmd.value.type === 'IDENTIFIER' &&
                        varsWithValue.indexOf(cmd.value.name) === -1) {
                        if (procName) {
                            _this._errors.push("Error: Variable ".concat(cmd.value.name, " is not initialized in procedure ").concat(procName));
                        }
                        else {
                            _this._errors.push("Error: Variable ".concat(cmd.value.name, " is not initialized"));
                        }
                    }
                    break;
                case 'READ':
                    varsWithValue.push(cmd.value);
                    break;
                case 'IF':
                    _this.varInitializedCheckerHelper(cmd.commands, varsWithValue);
                    break;
                case 'WHILE':
                    _this.varInitializedCheckerHelper(cmd.commands, varsWithValue);
                    break;
                case 'REPEAT':
                    _this.varInitializedCheckerHelper(cmd.commands, varsWithValue);
                    break;
                case 'PROCCALL':
                    var proc = _this.ast.procedures.find(function (proc) { return proc.head.name === cmd.name; });
                    if (proc) {
                        if (cmd.variables)
                            cmd.variables.forEach(function (varName) {
                                varsWithValue.push(varName);
                            });
                        if (proc.variables)
                            proc.variables.forEach(function (varName) {
                                varsWithValue.push(varName);
                            });
                        if (proc.head.variables)
                            proc.head.variables.forEach(function (varName) {
                                varsWithValue.push(varName);
                            });
                        // console.log(varsWithValue);
                        _this.varInitializedCheckerHelper(proc === null || proc === void 0 ? void 0 : proc.commands, varsWithValue, cmd.name);
                    }
                    break;
            }
        });
        return varsWithValue;
    };
    // FINDERS //
    AstValidation.prototype.findIdentifiers = function (commands) {
        var _this = this;
        var identifiers = [];
        commands.forEach(function (cmd) {
            if (cmd.type === 'IDENTIFIER') {
                identifiers.push(cmd);
            }
            else {
                if (cmd.type === 'IF' ||
                    cmd.type === 'WHILE' ||
                    cmd.type === 'REPEAT') {
                    identifiers.push.apply(identifiers, _this.findIdentifiers(cmd.commands));
                    // Get identifiers from condition
                    if (cmd.condition.type === 'CONDITION') {
                        if (cmd.condition.left.type === 'IDENTIFIER') {
                            identifiers.push(cmd.condition.left);
                        }
                        if (cmd.condition.right.type === 'IDENTIFIER') {
                            identifiers.push(cmd.condition.right);
                        }
                    }
                }
                else if (cmd.type === 'ASSIGN') {
                    if (cmd.value.type === 'IDENTIFIER') {
                        identifiers.push(cmd.value);
                    }
                    else {
                        if (cmd.value.type === 'EXPRESSION') {
                            if (cmd.value.left.type === 'IDENTIFIER') {
                                identifiers.push(cmd.value.left);
                            }
                            if (cmd.value.right.type === 'IDENTIFIER') {
                                identifiers.push(cmd.value.right);
                            }
                        }
                    }
                }
                else if (cmd.type === 'WRITE') {
                    if (cmd.value.type === 'IDENTIFIER') {
                        identifiers.push(cmd.value);
                    }
                }
                else if (cmd.type === 'EXPRESSION') {
                    if (cmd.left.type === 'IDENTIFIER') {
                        identifiers.push(cmd.left);
                    }
                    if (cmd.right.type === 'IDENTIFIER') {
                        identifiers.push(cmd.right);
                    }
                }
            }
        });
        return identifiers;
    };
    AstValidation.prototype.findProcCalls = function (commands) {
        var _this = this;
        var procCalls = [];
        commands.forEach(function (cmd) {
            if (cmd.type === 'PROCCALL') {
                procCalls.push(cmd);
            }
            else {
                if (cmd.type === 'IF' ||
                    cmd.type === 'WHILE' ||
                    cmd.type === 'REPEAT') {
                    procCalls.push.apply(procCalls, _this.findProcCalls(cmd.commands));
                }
            }
        });
        return procCalls;
    };
    AstValidation.prototype.tofindDuplicates = function (arr) {
        if (arr)
            return arr.filter(function (item, index) { return arr.indexOf(item) !== index; });
        else
            return [];
    };
    // PRINTERS //
    AstValidation.prototype.printErrors = function () {
        this._errors.forEach(function (error) { return console.error(error); });
    };
    return AstValidation;
}());
exports.default = AstValidation;
