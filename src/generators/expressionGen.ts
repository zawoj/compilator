import { CodeGenerator } from '../codeGenerator';

export const addGen = (
  codeGen: CodeGenerator,
  left: any,
  right: any
): string => {
  if (left.type === 'VALUE' && right.type === 'VALUE') {
    codeGen.flatAst.push(`SET ${left.value}`);
    codeGen.flatAst.push(`STORE ${codeGen.varibles['exv']}`);
    codeGen.flatAst.push(`SET ${right.value}`);
    codeGen.flatAst.push(`ADD ${codeGen.varibles['exv']}`);
    return codeGen.varibles['exv'];
  }

  return '';
};
