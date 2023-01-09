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

  generate(): {
    code: string[];
  } {
    switch (this.conditon.operator) {
      case '=':
        this.equal();
        break;
      case '!=':
        this.notEqual();
        break;
      case '>':
        this.greaterThan();
        break;
      case '<':
        this.lessThan();
        break;
      case '>=':
        this.greaterThanOrEqual();
        break;
      case '<=':
        this.lessThanOrEqual();
        break;
      default:
        break;
    }

    return {
      code: this.code,
    };
  }
  // ???
  equal() {
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

      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.right.name]}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${this.codeGen.varibles[this.conditon.left.name]}`);
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

  notEqual() {
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

  lessThan() {
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
  greaterThan() {
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
  greaterThanOrEqual() {
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
  lessThanOrEqual() {
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
