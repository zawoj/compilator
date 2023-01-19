import { ConditionGenerator } from './generators/conditionGen';
import {
  addGen,
  divGen,
  modGen,
  mulGen,
  subGen,
} from './generators/expressionGen';
import {
  Assign,
  astType,
  commands,
  Condition,
  Expression,
  getVaribleReturnType,
  If,
  ProcCall,
  Procedure,
  Read,
  Repeat,
  While,
  Write,
} from './types/astType';

export class CodeGenerator {
  varibles: Record<string, string> = {};
  variblesIndex: number = 1;
  flatAst: string[] = [];
  procedures = new Map<string, Procedure>();
  labelIndex: number = 0;

  constructor(private readonly ast: astType) {}

  generateCode() {
    // Set program variables registers as normal names
    this.ast.program.variables.forEach((variable) => {
      this.varibles[variable] = this.variblesIndex.toString();
      this.variblesIndex++;
    });

    // Expression varible holder (for help with expressions)
    this.varibles['exv'] = this.variblesIndex.toString();
    this.variblesIndex++;

    //  Set procedure variables registers as special names (procName_arg/var_name)
    if (this.ast.procedures) {
      this.ast.procedures.forEach((procedure) => {
        // Set variables
        procedure.variables.forEach((variable) => {
          this.varibles[`${procedure.head.name}_var_${variable}`] =
            this.variblesIndex.toString();
          this.variblesIndex++;
        });

        // Set arguments
        procedure.head.variables.forEach((arg) => {
          this.varibles[`${procedure.head.name}_arg_${arg}`] =
            this.variblesIndex.toString();
          this.variblesIndex++;
        });

        // Set jump back variable
        procedure.jumpLabel = this.generateUniqueLabel();
        this.procedures.set(procedure.head.name, procedure);
        this.varibles[procedure.head.name + '_back'] =
          this.variblesIndex.toString();
        this.variblesIndex++;
      });
    }

    // console.log(this.varibles);

    // START GENERATION //

    const startLabel = this.generateUniqueLabel();
    this.flatAst.push(`JUMP ${startLabel}`);
    // Genereate procedures
    this.procedures.forEach((proc: Procedure) => {
      // GEN PROC CODE
      this.generateProc(proc);
    });

    // Generate program
    this.flatAst.push(`${startLabel}`);
    this.ast.program.commands.forEach((command) => {
      this.generateCommand(command);
    });
  }

  generateCommand(command: commands, isArg?: boolean, procName?: string) {
    switch (command.type) {
      case 'WHILE':
        this.generateWhile(command, isArg, procName);
        break;
      case 'IF':
        this.generateIf(command, isArg, procName);
        break;
      case 'ASSIGN':
        this.generateAssign(command, isArg, procName);
        break;
      case 'READ':
        this.generateRead(command, isArg, procName);
        break;
      case 'WRITE':
        this.generateWrite(command, isArg, procName);
        break;
      case 'REPEAT':
        this.generateRepeat(command, isArg, procName);
        break;
      case 'EXPRESSION':
        this.generateExpression(command, isArg, procName);
        break;
      case 'PROCCALL':
        this.generateProcCall(command);
      default:
        break;
    }
  }

  generateWhile(command: While, isArg?: boolean, procName?: string) {
    const trueLabel = this.generateUniqueLabel();
    const falseLabel = this.generateUniqueLabel();
    const returnLabel = this.generateUniqueLabel();
    const conditions = new ConditionGenerator(
      command.condition,
      trueLabel,
      falseLabel,
      this
    );
    const conditionCode = conditions.generate(isArg, procName).code;

    this.flatAst.push(`${returnLabel}`);
    conditionCode.forEach((command) => {
      this.flatAst.push(command);
    });
    this.flatAst.push(`${trueLabel}`);
    command.commands.forEach((command: any) => {
      this.generateCommand(command, isArg, procName);
    });
    this.flatAst.push(`JUMP ${returnLabel}`);
    this.flatAst.push(`${falseLabel}`);
  }

  generateIf(command: If, isArg?: boolean, procName?: string) {
    const trueLabel = this.generateUniqueLabel();
    const falseLabel = this.generateUniqueLabel();
    const label3 = this.generateUniqueLabel();

    const conditions = new ConditionGenerator(
      command.condition,
      trueLabel,
      falseLabel,
      this
    );
    const conditionCode = conditions.generate(isArg, procName).code;

    conditionCode.forEach((command) => {
      this.flatAst.push(command);
    });
    // IF COMMANDS
    this.flatAst.push(`${trueLabel}`);
    command.commands.forEach((command: any) => {
      this.generateCommand(command, isArg, procName);
    });

    if (command.elseCommands.length > 0) {
      this.flatAst.push(`JUMP ${label3}`);
      this.flatAst.push(`${falseLabel}`);
      // ELSE COMMENDS
      command.elseCommands.forEach((command: any) => {
        this.generateCommand(command, isArg, procName);
      });
      this.flatAst.push(`${label3}`);
    } else {
      this.flatAst.push(`${falseLabel}`);
    }
  }

  generateAssign(command: Assign, isArg?: boolean, procName?: string) {
    // Generate asm code for ASSIGN command and get the varible from the varibles map
    // Check if the value is a number or a variable

    if (command.value.type === 'VALUE') {
      const variableIndex = this.getVarible(
        command.identifier,
        isArg,
        procName
      );
      this.flatAst.push(`SET ${command.value.value}`);
      this.flatAst.push(`STORE ${variableIndex}`);
    } else if (command.value.type === 'IDENTIFIER') {
      // console.log(command.value.name);
      // console.log(isArg);
      const variableIndex1 = this.getVarible(
        command.value.name,
        isArg,
        procName
      );
      const variableIndex2 = this.getVarible(
        command.identifier,
        isArg,
        procName
      );
      this.flatAst.push(`LOAD ${variableIndex1}`);
      this.flatAst.push(`STORE ${variableIndex2}`);
    } else {
      this.generateExpression(command.value, isArg, procName);
      const variableIndex = this.getVarible(
        command.identifier,
        isArg,
        procName
      );
      this.flatAst.push(`STORE ${variableIndex}`);
    }
  }

  generateRead(command: Read, isArg?: boolean, procName?: string) {
    // Generate asm code for READ command and get the varible from the varibles map
    // Read the value and habe to save in register
    const variableIndex = this.getVarible(command.value, isArg, procName);
    this.flatAst.push(`GET ${variableIndex}`);
  }

  generateWrite(command: Write, isArg?: boolean, procName?: string) {
    // Generate asm code for WRITE command and get the varible from the varibles map
    // Write the value from register
    // Check if the value is a number or a variable
    if (command.value.type === 'VALUE') {
      this.flatAst.push(`SET ${command.value.value}`);
      this.flatAst.push(`PUT 0`);
    } else {
      const variableIndex = this.getVarible(
        command.value.name,
        isArg,
        procName
      );
      this.flatAst.push(`PUT ${variableIndex}`);
    }
  }

  generateRepeat(command: Repeat, isArg?: boolean, procName?: string) {
    const trueLabel = this.generateUniqueLabel();
    const falseLabel = this.generateUniqueLabel();
    const conditions = new ConditionGenerator(
      command.condition,
      trueLabel,
      falseLabel,
      this
    );
    const conditionCode = conditions.generate(isArg, procName).code;

    this.flatAst.push(`${falseLabel}`);
    command.commands.forEach((command: any) => {
      this.generateCommand(command, isArg, procName);
    });
    conditionCode.forEach((command) => {
      this.flatAst.push(command);
    });
    this.flatAst.push(`${trueLabel}`);
  }

  generateExpression(command: Expression, isArg?: boolean, procName?: string) {
    // Generate asm code for EXPRESSION command and get the varible from the varibles map
    // Check if the value is a number or a variable
    switch (command.operator) {
      case '+':
        addGen(this, command.left, command.right, isArg, procName);
        break;
      case '-':
        subGen(this, command.left, command.right, isArg, procName);
        break;
      case '*':
        mulGen(this, command.left, command.right, isArg, procName);
        break;
      case '/':
        divGen(this, command.left, command.right, isArg, procName);
        break;
      case '%':
        modGen(this, command.left, command.right, isArg, procName);
        break;
      default:
        break;
    }
  }

  // PROCEDURES //
  generateProcCall(procCall: ProcCall, procName?: string) {
    const thisProc = this.procedures.get(procCall.name);
    console.log(this.varibles);
    // Set the arguments
    if (procCall.variables.length > 0) {
      // If call procedure inside procedure
      if (procName) {
        // console.log(procName);
      }
      // If call procedure inside main
      else {
        // console.log(procCall);
        procCall.variables.forEach((variable: any, index: number) => {
          // index rejestru argumentu od programu głównego, bedzie troche ciezej gdy bedzie to od innej procedury
          this.flatAst.push(`SET ${this.varibles[variable]}`);

          // index rejestru zmiennej
          this.flatAst.push(
            `STORE ${
              this.varibles[
                `${procCall.name}_arg_${thisProc?.head.variables[index]}`
              ]
            }`
          );
        });
      }
    }

    // Set the back label and JUMPS
    const jumpLabel = this.generateUniqueLabel();
    this.flatAst.push(`SET ${jumpLabel}`);
    this.flatAst.push(`STORE ${this.varibles[procCall.name + '_back']}`);
    this.flatAst.push(`JUMP ${thisProc?.jumpLabel}`);
    this.flatAst.push(`${jumpLabel}`);
  }

  generateProc(proc: Procedure) {
    this.flatAst.push(`${proc.jumpLabel}`);
    // console.log(proc.head.name, proc.variables);
    // if (proc.variables) {
    //   proc.variables.forEach((name: string) => {
    //     this.varibles[proc.head.name + name] = this.variblesIndex.toString();
    //     this.variblesIndex++;
    //   });
    // }

    proc.commands.forEach((command: any) => {
      this.generateCommand(command, true, proc.head.name);
    });
    this.flatAst.push(`JUMPI ${this.varibles[proc.head.name + '_back']}`);
  }

  // HELPER METHODS //

  generateUniqueLabel(): string {
    return `label${this.labelIndex++}`;
  }

  getFlatAst() {
    return this.flatAst;
  }

  astLabelCleaner() {
    // Get indexs of labels
    const labelHash = new Map();
    let iterationCorrection: number = 0;
    this.flatAst.forEach((item, index) => {
      if (
        item.includes('label') &&
        !item.includes('JUMP') &&
        !item.includes('JPOS') &&
        !item.includes('JZERO') &&
        !item.includes('JUMPI') &&
        !item.includes('SET')
      ) {
        labelHash.set(item, index - iterationCorrection);
        iterationCorrection++;
      }
    });

    // Replace JUMP label with JUMP index and re
    this.flatAst.forEach((item, index) => {
      if (item.includes('JUMP') && !item.includes('JUMPI')) {
        const label = item.split(' ')[1];
        this.flatAst[index] = `JUMP ${labelHash.get(label)}`;
      } else if (item.includes('JPOS')) {
        const label = item.split(' ')[1];
        this.flatAst[index] = `JPOS ${labelHash.get(label)}`;
      } else if (item.includes('JZERO')) {
        const label = item.split(' ')[1];
        this.flatAst[index] = `JZERO ${labelHash.get(label)}`;
      } else if (item.includes('JUMPI')) {
        const label = item.split(' ')[1];
        if (label.includes('label')) {
          this.flatAst[index] = `JUMPI ${labelHash.get(label)}`;
        }
      } else if (item.includes('SET')) {
        const label = item.split(' ')[1];
        if (label.includes('label')) {
          this.flatAst[index] = `SET ${labelHash.get(label)}`;
        }
      }
    });

    // Remove labels
    this.flatAst = this.flatAst.filter((item) => {
      return !item.includes('label');
    });
  }

  getVarible(
    varName: string,
    isArg?: boolean,
    procName?: string
  ): getVaribleReturnType {
    // if we are in procedure
    if (procName) {
      if (`${procName}_arg_${varName}` in this.varibles) {
        return {
          index: this.varibles[`${procName}_arg_${varName}`],
          isArg: true,
        };
      }
      // (`${procName}_var_${command}` in this.varibles)
      else {
        return {
          index: this.varibles[`${procName}_var_${varName}`],
          isArg: false,
        };
      }
    } else {
      return {
        index: this.varibles[`${varName}`],
        isArg: false,
      };
    }
  }

  // Generate unique varibles and return name
  generateUniqueVar() {
    this.variblesIndex++;
    this.varibles[`var${this.variblesIndex}`] = this.variblesIndex.toString();
    return `var${this.variblesIndex}`;
  }

  // END PROGRAM
  endProgram() {
    this.flatAst.push('HALT');
  }
}
