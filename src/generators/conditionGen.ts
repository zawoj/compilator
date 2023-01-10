import { CodeGenerator } from '../codeGenerator';
import { Condition } from '../types/astType';

export class ConditionGenerator {
  code: string[];
  trueLabelJump: string;
  falseLabelJump: string;
  codeGen: CodeGenerator;
  conditon: Condition;
  constructor(
    conditon: Condition,
    trueLabelJump: string,
    falseLabelJump: string,
    codeGen: CodeGenerator
  ) {
    this.code = [];
    this.trueLabelJump = trueLabelJump;
    this.falseLabelJump = falseLabelJump;
    this.codeGen = codeGen;
    this.conditon = conditon;
  }

  generate(
    isArg?: boolean
  ): {
    code: string[];
  } {
    switch (this.conditon.operator) {
      case '=':
        this.equal(isArg);
        break;
      case '!=':
        this.notEqual(isArg);
        break;
      case '>':
        this.greaterThan(isArg);
        break;
      case '<':
        this.lessThan(isArg);
        break;
      case '>=':
        this.greaterThanOrEqual(isArg);
        break;
      case '<=':
        this.lessThanOrEqual(isArg);
        break;
      default:
        break;
    }

    return {
      code: this.code,
    };
  }
  equal( isArg?: boolean) {
    if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);

      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);
      this.code.push(`JUMP ${this.trueLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);

      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);
      this.code.push(`JUMP ${this.trueLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);

      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);
      this.code.push(`JUMP ${this.trueLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);

      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);
      this.code.push(`JUMP ${this.trueLabelJump}`);
    }
  }

  notEqual( isArg?: boolean) {
    if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);

      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);

      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);

      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);

      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }

  lessThan( isArg?: boolean) {
    if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
  greaterThan( isArg?: boolean) {
    if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
  greaterThanOrEqual( isArg?: boolean) {
    if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
  lessThanOrEqual( isArg?: boolean) {
    if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
}
