import { CodeGenerator } from '../codeGenerator';
import { Identifier, Value } from '../types/astType';

export const addGen = (
  codeGen: CodeGenerator,
  left: Identifier | Value,
  right: Identifier | Value
) => {
  if (left.type === 'VALUE' && right.type === 'VALUE') {
    codeGen.flatAst.push(`SET ${left.value}`);
    codeGen.flatAst.push(`STORE ${codeGen.varibles['exv']}`);
    codeGen.flatAst.push(`SET ${right.value}`);
    codeGen.flatAst.push(`ADD ${codeGen.varibles['exv']}`);
  }

  if (left.type === 'VALUE' && right.type === 'IDENTIFIER') {
    codeGen.flatAst.push(`SET ${left.value}`);
    codeGen.flatAst.push(`ADD ${codeGen.varibles[right.name]}`);
  }

  if (left.type === 'IDENTIFIER' && right.type === 'VALUE') {
    codeGen.flatAst.push(`SET ${right.value}`);
    codeGen.flatAst.push(`ADD ${codeGen.varibles[left.name]}`);
  }

  if (left.type === 'IDENTIFIER' && right.type === 'IDENTIFIER') {
    codeGen.flatAst.push(`LOAD ${codeGen.varibles[left.name]}`);
    codeGen.flatAst.push(`ADD ${codeGen.varibles[right.name]}`);
  }
};
