import { astType, commands, Identifier, ProcCall } from './types/astType';

export default class AstValidation {
  private _errors: string[];
  ast: astType;
  rawAst: any;
  constructor(ast: astType, source: string) {
    this._errors = [];
    this.ast = ast;
    this.rawAst = source;
  }

  runValidation() {
    // console.log(this.rawAst);
    this.nameConflictCheck();
    this.checkUseNotDeclared();
    this.checkIfVarWasInitialized();
    this.checkIfProcedureIsDefined();
    this.printErrors();
  }

  nameConflictCheck() {
    // Check main procedure variables for name conflicts
    const programVariables = this.ast.program.variables;
    const duplicateElementa = this.tofindDuplicates(programVariables);
    if (duplicateElementa.length > 0) {
      this._errors.push(
        `Error: Duplicate variable name conflict in main procedure: ${duplicateElementa}`
      );
    }

    // Check main procedure statements for name conflicts
    this.ast.procedures.forEach((proc) => {
      let error = false;
      // Check procedure arguments for name conflicts
      const duplicateArgs = this.tofindDuplicates(proc.head.variables);
      if (duplicateArgs.length > 0) {
        this._errors.push(
          `Error: Duplicate argument name conflict in procedure ${proc.head.name}: ${duplicateArgs}`
        );
        error = true;
      }

      // Check procedure variables for name conflicts
      const duplicateVars = this.tofindDuplicates(proc.variables);
      if (duplicateVars.length > 0) {
        this._errors.push(
          `Error: Duplicate variable name conflict in procedure ${proc.head.name}: ${duplicateVars}`
        );
        error = true;
      }

      const varAndArgs = proc.head.variables.concat(proc.variables);
      const duplicateVarAndArgs = this.tofindDuplicates(varAndArgs);
      if (duplicateVarAndArgs.length > 0 && !error) {
        this._errors.push(
          `Error: Duplicate variable and argument name conflict in procedure ${proc.head.name}: ${duplicateVarAndArgs}`
        );
      }
    });
  }

  checkUseNotDeclared() {
    // Find all commands that are type IDENTIFIER in recursive function
    const progIdentifiers = this.findIdentifiers(this.ast.program.commands);
    progIdentifiers.forEach((identifier) => {
      if (!this.ast.program.variables.includes(identifier.name)) {
        this._errors.push(
          `Error: Variable ${identifier.name} is not declared in main procedure`
        );
      }
    });
    this.ast.procedures.forEach((proc) => {
      const procIdentifiers = this.findIdentifiers(proc.commands);
      const varsAndArgs = proc.head.variables.concat(proc.variables);
      procIdentifiers.forEach((identifier) => {
        if (!varsAndArgs.includes(identifier.name)) {
          this._errors.push(
            `Error: Variable ${identifier.name} is not declared in procedure ${proc.head.name}`
          );
        }
      });
    });
  }

  checkIfDeclared(cmd: Identifier) {
    // Check if variable is declared in main procedure
    const programVariables = this.ast.program.variables;
    if (programVariables.includes(cmd.name)) {
      return true;
    }

    // Check if variable is declared in procedure
    this.ast.procedures.forEach((proc) => {
      const procVariables = proc.variables;
      if (procVariables.includes(cmd.name)) {
        return true;
      }
    });

    return false;
  }

  checkIfProcedureIsDefined() {
    // Check if procedure is defined
    const procCalls = this.findProcCalls(this.ast.program.commands);
    const procNames = this.ast.procedures.map((proc) => proc.head.name);
    procCalls.forEach((procCall) => {
      if (!procNames.includes(procCall.name)) {
        this._errors.push(`Error: Procedure ${procCall.name} is not defined`);
      }
    });
  }

  checkIfVarWasInitialized() {
    this.varInitializedCheckerHelper(this.ast.program.commands);
    // this.ast.procedures.forEach((proc) => {
    //   this.varInitializedCheckerHelper(proc.commands);
    // });
  }

  varInitializedCheckerHelper(
    cmd: commands[],
    currentValuesVars: string[] = [],
    procName?: string
  ) {
    let varsWithValue: string[] = [...currentValuesVars];
    // Just assing and read commands can initialize a variable
    cmd.forEach((cmd) => {
      console.log(cmd.type);
      switch (cmd.type) {
        case 'ASSIGN':
          varsWithValue.push(cmd.identifier);
          if (
            cmd.value.type === 'IDENTIFIER' &&
            varsWithValue.indexOf(cmd.value.name) === -1
          ) {
            if (procName) {
              this._errors.push(
                `Error: Variable ${cmd.value.name} is not initialized in procedure ${procName}`
              );
            } else {
              this._errors.push(
                `Error: Variable ${cmd.value.name} is not initialized`
              );
            }
          }
          if (cmd.value.type === 'EXPRESSION') {
            if (
              cmd.value.left.type === 'IDENTIFIER' &&
              varsWithValue.indexOf(cmd.value.left.name) === -1
            ) {
              if (procName) {
                this._errors.push(
                  `Error: Variable ${cmd.value.left.name} is not initialized in procedure ${procName}`
                );
              } else {
                this._errors.push(
                  `Error: Variable ${cmd.value.left.name} is not initialized`
                );
              }
            }
            if (
              cmd.value.right.type === 'IDENTIFIER' &&
              varsWithValue.indexOf(cmd.value.right.name) === -1
            ) {
              if (procName) {
                this._errors.push(
                  `Error: Variable ${cmd.value.right.name} is not initialized in procedure ${procName}`
                );
              } else {
                this._errors.push(
                  `Error: Variable ${cmd.value.right.name} is not initialized`
                );
              }
            }
          }
          break;
        case 'WRITE':
          if (
            cmd.value.type === 'IDENTIFIER' &&
            varsWithValue.indexOf(cmd.value.name) === -1
          ) {
            if (procName) {
              this._errors.push(
                `Error: Variable ${cmd.value.name} is not initialized in procedure ${procName}`
              );
            } else {
              this._errors.push(
                `Error: Variable ${cmd.value.name} is not initialized`
              );
            }
          }
          break;
        case 'READ':
          varsWithValue.push(cmd.value);
          break;
        case 'IF':
          this.varInitializedCheckerHelper(cmd.commands);
          break;
        case 'WHILE':
          this.varInitializedCheckerHelper(cmd.commands);
          break;
        case 'REPEAT':
          this.varInitializedCheckerHelper(cmd.commands);
          break;
        case 'PROCCALL':
          const proc = this.ast.procedures.find(
            (proc) => proc.head.name === cmd.name
          );
          if (proc) {
            cmd.variables.forEach((varName) => {
              varsWithValue.push(varName);
            });

            proc.head.variables.forEach((varName) => {
              varsWithValue.push(varName);
            });

            this.varInitializedCheckerHelper(
              proc?.commands,
              varsWithValue,
              cmd.name
            );
          }

          break;
      }
    });

    return varsWithValue;
  }

  // FINDERS //
  findIdentifiers(commands: commands[]) {
    let identifiers: Identifier[] = [];
    commands.forEach((cmd) => {
      if (cmd.type === 'IDENTIFIER') {
        identifiers.push(cmd);
      } else {
        if (
          cmd.type === 'IF' ||
          cmd.type === 'WHILE' ||
          cmd.type === 'REPEAT'
        ) {
          identifiers.push(...this.findIdentifiers(cmd.commands));
          // Get identifiers from condition
          if (cmd.condition.type === 'CONDITION') {
            if (cmd.condition.left.type === 'IDENTIFIER') {
              identifiers.push(cmd.condition.left);
            }
            if (cmd.condition.right.type === 'IDENTIFIER') {
              identifiers.push(cmd.condition.right);
            }
          }
        } else if (cmd.type === 'ASSIGN') {
          if (cmd.value.type === 'IDENTIFIER') {
            identifiers.push(cmd.value);
          } else {
            if (cmd.value.type === 'EXPRESSION') {
              if (cmd.value.left.type === 'IDENTIFIER') {
                identifiers.push(cmd.value.left);
              }
              if (cmd.value.right.type === 'IDENTIFIER') {
                identifiers.push(cmd.value.right);
              }
            }
          }
        } else if (cmd.type === 'WRITE') {
          if (cmd.value.type === 'IDENTIFIER') {
            identifiers.push(cmd.value);
          }
        } else if (cmd.type === 'EXPRESSION') {
          console.log(cmd);
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
  }

  findProcCalls(commands: commands[]) {
    let procCalls: ProcCall[] = [];
    commands.forEach((cmd) => {
      if (cmd.type === 'PROCCALL') {
        procCalls.push(cmd);
      } else {
        if (
          cmd.type === 'IF' ||
          cmd.type === 'WHILE' ||
          cmd.type === 'REPEAT'
        ) {
          procCalls.push(...this.findProcCalls(cmd.commands));
        }
      }
    });

    return procCalls;
  }

  tofindDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) !== index);
  }

  // PRINTERS //
  printErrors() {
    this._errors.forEach((error) => console.error(error));
    // process.exit(1);
  }
}
