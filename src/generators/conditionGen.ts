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
    isArg?: boolean,
    procName?: string
  ): {
    code: string[];
  } {
    switch (this.conditon.operator) {
      case '=':
        this.equal(isArg, procName);
        break;
      case '!=':
        this.notEqual(isArg, procName);
        break;
      case '>':
        this.greaterThan(isArg, procName);
        break;
      case '<':
        this.lessThan(isArg, procName);
        break;
      case '>=':
        this.greaterThanOrEqual(isArg, procName);
        break;
      case '<=':
        this.lessThanOrEqual(isArg, procName);
        break;
      default:
        break;
    }

    return {
      code: this.code,
    };
  }
  equal(isArg?: boolean, procName?: string) {
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
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);

      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);
      this.code.push(`JUMP ${this.trueLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      const variableIndex = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);

      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);
      this.code.push(`JUMP ${this.trueLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      const variableIndex = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);

      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.falseLabelJump}`);
      this.code.push(`JUMP ${this.trueLabelJump}`);
    }
  }

  notEqual(isArg?: boolean, procName?: string) {
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
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);

      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      const variableIndex = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);

      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      const variableIndex = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);

      this.code.push(`LOAD ${variableIndex}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }

  lessThan(isArg?: boolean, procName?: string) {
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
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
  greaterThan(isArg?: boolean, procName?: string) {
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
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      // console.log(variableIndex1);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JPOS ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
  greaterThanOrEqual(isArg?: boolean, procName?: string) {
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
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
  lessThanOrEqual(isArg?: boolean, procName?: string) {
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
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'IDENTIFIER' &&
      this.conditon.right.type === 'VALUE'
    ) {
      const variableIndex1 = this.codeGen.getVarible(
        this.conditon.left.name,
        isArg,
        procName
      );
      this.code.push(`SET ${this.conditon.right.value}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`LOAD ${variableIndex1}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    } else if (
      this.conditon.left.type === 'VALUE' &&
      this.conditon.right.type === 'IDENTIFIER'
    ) {
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.right.name,
        isArg,
        procName
      );
      this.code.push(`LOAD ${variableIndex2}`);
      this.code.push(`STORE ${this.codeGen.varibles['exv']}`);
      this.code.push(`SET ${this.conditon.left.value}`);
      this.code.push(`SUB ${this.codeGen.varibles['exv']}`);
      this.code.push(`JZERO ${this.trueLabelJump}`);
      this.code.push(`JUMP ${this.falseLabelJump}`);
    }
  }
}
