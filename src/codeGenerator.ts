import { ConditionGenerator } from './generators/conditionGen';
import { addGen, subGen } from './generators/expressionGen';
import {
  Assign,
  astType,
  Condition,
  Expression,
  If,
  Procedure,
  Read,
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
    // Generate asm code based on the ast.program and ast.procedures

    // Generate variables
    this.ast.program.variables.forEach((variable) => {
      this.varibles[variable] = this.variblesIndex.toString();
      this.variblesIndex++;
    });

    // Expression value holder
    this.varibles['exv'] = this.variblesIndex.toString();
    this.variblesIndex++;

    if (this.ast.procedures) {
      this.ast.procedures.forEach((procedure) => {
        this.procedures.set(procedure.name, procedure);
      });
    }

    this.ast.program.commands.forEach((command) => {
      this.generateCommand(command);
    });
  }

  generateCommand(command: any) {
    switch (command.type) {
      case 'WHILE':
        this.generateWhile(command);
        break;
      case 'IF':
        this.generateIf(command);
        break;
      case 'ASSIGN':
        this.generateAssign(command);
        break;
      case 'READ':
        this.generateRead(command);
        break;
      case 'WRITE':
        this.generateWrite(command);
        break;
      case 'REPEAT':
        this.generateRepeat(command);
        break;
      case 'EXPRESSION':
        this.generateExpression(command);
        break;
      case 'IDENTIFIER':
        this.generateIdentifier(command);
        break;
      default:
        break;
    }
  }

  generateWhile(command: any) {
    this.flatAst.push(
      `WHILE ${command.condition.type} ${command.condition.value}`
    );
    command.commands.forEach((command: any) => {
      this.generateCommand(command);
    });
  }

  generateIf(command: If) {
    const label = this.generateUniqueLabel();
    const label2 = this.generateUniqueLabel();
    const conditions = new ConditionGenerator(
      command.condition,
      label,
      label2,
      this
    );
    const conditionCode = conditions.generate().code;

    // IF
    conditionCode.forEach((command) => {
      this.flatAst.push(command);
    });
    command.commands.forEach((command: any) => {
      this.generateCommand(command);
    });

    this.flatAst.push(`JUMP ${label2}`);
    this.flatAst.push(`${label}`);
    command.elseCommands.forEach((command: any) => {
      this.generateCommand(command);
    });
    this.flatAst.push(`${label2}`);
  }

  generateAssign(command: Assign) {
    // Generate asm code for ASSIGN command and get the varible from the varibles map
    // Check if the value is a number or a variable
    if (command.value.type === 'VALUE') {
      this.flatAst.push(`SET ${command.value.value}`);
      this.flatAst.push(`STORE ${this.varibles[command.identifier]}`);
    } else if (command.value.type === 'IDENTIFIER') {
      this.flatAst.push(`LOAD ${this.varibles[command.value.name]}`);
      this.flatAst.push(`STORE ${this.varibles[command.identifier]}`);
    } else {
      this.generateExpression(command.value);
      this.flatAst.push(`STORE ${this.varibles[command.identifier]}`);
    }
  }

  generateRead(command: Read) {
    // Generate asm code for READ command and get the varible from the varibles map
    // Read the value and habe to save in register
    this.flatAst.push(`GET ${this.varibles[command.value]}`);
  }

  generateWrite(command: Write) {
    // Generate asm code for WRITE command and get the varible from the varibles map
    // Write the value from register
    // Check if the value is a number or a variable
    if (command.value.type === 'VALUE') {
      this.flatAst.push(`SET ${command.value.value}`);
      this.flatAst.push(`PUT 0`);
    } else {
      this.flatAst.push(`PUT ${this.varibles[command.value.name]}`);
    }
  }

  generateRepeat(command: any) {
    let repeatIndex = this.flatAst.length + 1;
    this.flatAst.push(`REPEAT`);
    command.commands.forEach((command: any) => {
      this.generateCommand(command);
    });
    this.flatAst.push(
      `UNTIL ${command.condition.type} ${command.condition.value} jump to ${repeatIndex}`
    );
  }

  generateExpression(command: Expression) {
    // Generate asm code for EXPRESSION command and get the varible from the varibles map
    // Check if the value is a number or a variable
    switch (command.operator) {
      case '+':
        addGen(this, command.left, command.right);
        break;
      case '-':
        subGen(this, command.left, command.right);
        break;
      case '*':
        this.flatAst.push(`MUL`);
        break;
      case '/':
        this.flatAst.push(`DIV`);
        break;
      default:
        break;
    }
  }

  generateIdentifier(command: any) {
    this.flatAst.push(`IDENTIFIER ${command.value}`);
  }

  generateUniqueLabel(): string {
    return `label${this.labelIndex++}`;
  }

  getFlatAst() {
    return this.flatAst;
  }

  astLabelCleaner() {
    // Get indexs of labels
    const labelHash = new Map();
    this.flatAst.forEach((item, index) => {
      if (
        item.includes('label') &&
        !item.includes('JUMP') &&
        !item.includes('JPOS') &&
        !item.includes('JZERO') &&
        !item.includes('JUMPI')
      ) {
        labelHash.set(item, index);
      }
    });

    // Replace JUMP label with JUMP index and re
    this.flatAst.forEach((item, index) => {
      if (item.includes('JUMP')) {
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
        this.flatAst[index] = `JUMPI ${labelHash.get(label)}`;
      }
    });

    // Remove labels
    this.flatAst = this.flatAst.filter((item) => {
      return !item.includes('label');
    });
  }

  getProcedures() {
    return this.procedures;
  }
}
