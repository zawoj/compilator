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

  constructor(private readonly ast: astType) {}

  generateCode() {
    // Generate asm code based on the ast.program and ast.procedures

    // Generate variables
    this.ast.program.variables.forEach((variable) => {
      this.varibles[variable] = this.variblesIndex.toString();
      this.variblesIndex++;
    });

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
    // Generate asm code for IF command and get the varible from the varibles map

    this.flatAst.push(`IF`);
    this.generateCondition(command.condition);

    command.commands.forEach((command: any) => {
      this.generateCommand(command);
    });

    this.flatAst.push(`ELSE`);

    command.elseCommands.forEach((command: any) => {
      this.generateCommand(command);
    });
  }

  generateAssign(command: Assign) {
    // Generate asm code for ASSIGN command and get the varible from the varibles map
    // Check if the value is a number or a variable
    if (command.value.type === 'VALUE') {
      this.flatAst.push(`SET ${command.value.value}`);
      this.flatAst.push(`STORE ${this.varibles[command.identifier]}`);
    } else {
      this.flatAst.push(`LOAD ${this.generateExpression(command.value)}`);
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
      this.flatAst.push(`LOAD ${this.varibles[command.value.name]}`);
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
    if (command.left.type === 'VALUE') {
      this.flatAst.push(`SET ${command.left.value}`);
    } else {
      this.flatAst.push(`LOAD ${this.varibles[command.left.name]}`);
    }

    if (command.left.type === 'IDENTIFIER') {
      this.flatAst.push(`STORE ${this.varibles[command.left.name]}`);
    }

    if (command.right.type === 'VALUE') {
      this.flatAst.push(`SET ${command.right.value}`);
    } else {
      this.flatAst.push(`LOAD ${this.varibles[command.right.name]}`);
    }

    if (command.right.type === 'IDENTIFIER') {
      this.flatAst.push(`STORE ${this.varibles[command.right.name]}`);
    }

    switch (command.operator) {
      case '+':
        this.flatAst.push(`ADD`);
        break;
      case '-':
        this.flatAst.push(`SUB`);
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

  generateCondition(command: Condition) {
    this.flatAst.push(
      `${
        command.left.type === 'IDENTIFIER'
          ? command.left.name
          : command.left.value
      } ${command.operator} ${
        command.right.type === 'IDENTIFIER'
          ? command.right.name
          : command.right.value
      }`
    );
  }

  getFlatAst() {
    return this.flatAst;
  }

  getProcedures() {
    return this.procedures;
  }
}
