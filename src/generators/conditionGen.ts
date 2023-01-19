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

  generate(procName?: string): {
    code: string[];
  } {
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
  }
  equal(procName?: string) {
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
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
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

  notEqual(procName?: string) {
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
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
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

  lessThan(procName?: string) {
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
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
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
  greaterThan(procName?: string) {
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
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
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
  greaterThanOrEqual(procName?: string) {
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
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
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
  lessThanOrEqual(procName?: string) {
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
        procName
      );
      const variableIndex2 = this.codeGen.getVarible(
        this.conditon.left.name,
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
