import { CodeGenerator } from '../codeGenerator';
import { Identifier, Value } from '../types/astType';

export const addGen = (
  codeGen: CodeGenerator,
  left: Identifier | Value,
  right: Identifier | Value
) => {
  if (left.type === 'VALUE' && right.type === 'VALUE') {
    codeGen.flatAst.push(`SET ${left.value}`); // p0 = 2
    codeGen.flatAst.push(`LOAD ${codeGen.varibles['exv']}`); // p0 = p[exv]   // 2
    codeGen.flatAst.push(`SET ${right.value}`); // p0 = 3
    codeGen.flatAst.push(`ADD ${codeGen.varibles['exv']}`); // p0 = p0 + p[exv]  // 5
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
    codeGen.flatAst.push(`STORE ${codeGen.varibles[left.name]}`);
    codeGen.flatAst.push(`ADD ${codeGen.varibles[right.name]}`);
  }
};

export const subGen = (
  codeGen: CodeGenerator,
  left: Identifier | Value,
  right: Identifier | Value
) => {
  if (left.type === 'VALUE' && right.type === 'VALUE') {
    codeGen.flatAst.push(`SET ${left.value}`);
    codeGen.flatAst.push(`LOAD ${codeGen.varibles['exv']}`);
    codeGen.flatAst.push(`SET ${right.value}`);
    codeGen.flatAst.push(`SUB ${codeGen.varibles['exv']}`);
  }

  if (left.type === 'VALUE' && right.type === 'IDENTIFIER') {
    codeGen.flatAst.push(`SET ${left.value}`);
    codeGen.flatAst.push(`SUB ${codeGen.varibles[right.name]}`);
  }

  if (left.type === 'IDENTIFIER' && right.type === 'VALUE') {
    codeGen.flatAst.push(`SET ${right.value}`);
    codeGen.flatAst.push(`SUB ${codeGen.varibles[left.name]}`);
  }

  if (left.type === 'IDENTIFIER' && right.type === 'IDENTIFIER') {
    codeGen.flatAst.push(`STORE ${codeGen.varibles[left.name]}`);
    codeGen.flatAst.push(`SUB ${codeGen.varibles[right.name]}`);
  }
};
