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
    codeGen.flatAst.push(`LOAD ${codeGen.varibles[left.name]}`);
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
    codeGen.flatAst.push(`STORE ${codeGen.varibles['exv']}`);
    codeGen.flatAst.push(`LOAD ${codeGen.varibles[left.name]}`);
    codeGen.flatAst.push(`SUB ${codeGen.varibles['exv']}`);
  }

  if (left.type === 'IDENTIFIER' && right.type === 'IDENTIFIER') {
    codeGen.flatAst.push(`STORE ${codeGen.varibles[left.name]}`);
    codeGen.flatAst.push(`SUB ${codeGen.varibles[right.name]}`);
  }
};

// PROCEDURE mul(a, b) IS
export const mulGen = (
  codeGen: CodeGenerator,
  left: Identifier | Value,
  right: Identifier | Value
) => {
  // VAR x, y, z c
  // Generate unique vars on each function call
  const x = codeGen.generateUniqueVar();
  const y = codeGen.generateUniqueVar();
  const z = codeGen.generateUniqueVar();
  const c = codeGen.generateUniqueVar();

  //   IF a > b THEN
  // x:=b;
  // y:=a;
  // ELSE
  // x:=a;
  // y:=b;

  codeGen.generateIf({
    type: 'IF',
    condition: {
      left: left,
      type: 'CONDITION',
      right: right,
      operator: '>',
    },
    commands: [
      {
        type: 'ASSIGN',
        identifier: x,
        value: right,
      },
      {
        type: 'ASSIGN',
        identifier: y,
        value: left,
      },
    ],
    elseCommands: [
      {
        type: 'ASSIGN',
        identifier: x,
        value: left,
      },
      {
        type: 'ASSIGN',
        identifier: y,
        value: right,
      },
    ],
  });

  // c:=0;
  codeGen.generateAssign({
    type: 'ASSIGN',
    identifier: c,
    value: {
      type: 'VALUE',
      value: '0',
    },
  });

  // WHILE x>0 DO
  // z:=x;
  // z:=z/2;
  // z:=z+z;
  // IF z=x THEN
  // x:=x/2;
  // y:=y+y;
  // ELSE
  codeGen.generateWhile({
    type: 'WHILE',
    condition: {
      left: {
        type: 'IDENTIFIER',
        name: x,
      },
      type: 'CONDITION',
      right: {
        type: 'VALUE',
        value: '0',
      },
      operator: '>',
    },
    commands: [
      {
        type: 'ASSIGN',
        identifier: z,
        value: {
          type: 'IDENTIFIER',
          name: x,
        },
      },
      {
        type: 'ASSIGN',
        identifier: z,
        value: {
          type: 'EXPRESSION',
          left: {
            type: 'IDENTIFIER',
            name: z,
          },
          right: {
            type: 'VALUE',
            value: '2',
          },
          operator: '/',
        },
      },
      {
        type: 'ASSIGN',
        identifier: z,
        value: {
          type: 'EXPRESSION',
          left: {
            type: 'IDENTIFIER',
            name: z,
          },
          right: {
            type: 'IDENTIFIER',
            name: z,
          },
          operator: '+',
        },
      },
      {
        type: 'IF',
        condition: {
          left: {
            type: 'IDENTIFIER',
            name: z,
          },
          type: 'CONDITION',
          right: {
            type: 'IDENTIFIER',
            name: x,
          },
          operator: '=',
        },
        commands: [
          {
            type: 'ASSIGN',
            identifier: x,
            value: {
              type: 'EXPRESSION',
              left: {
                type: 'IDENTIFIER',
                name: x,
              },
              right: {
                type: 'VALUE',
                value: '2',
              },
              operator: '/',
            },
          },
          {
            type: 'ASSIGN',
            identifier: y,
            value: {
              type: 'EXPRESSION',
              left: {
                type: 'IDENTIFIER',
                name: y,
              },
              right: {
                type: 'IDENTIFIER',
                name: y,
              },
              operator: '+',
            },
          },
        ],
        elseCommands: [
          {
            type: 'ASSIGN',
            identifier: x,
            value: {
              type: 'EXPRESSION',
              left: {
                type: 'IDENTIFIER',
                name: x,
              },
              right: {
                type: 'VALUE',
                value: '1',
              },
              operator: '-',
            },
          },
          {
            type: 'ASSIGN',
            identifier: c,
            value: {
              type: 'EXPRESSION',
              left: {
                type: 'IDENTIFIER',
                name: c,
              },
              right: {
                type: 'IDENTIFIER',
                name: y,
              },
              operator: '+',
            },
          },
        ],
      },
    ],
  });
  // Save result in p0
  codeGen.flatAst.push('LOAD ' + codeGen.varibles[c]);
};

export const divGen = (
  codeGen: CodeGenerator,
  left: Identifier | Value,
  right: Identifier | Value
) => {
  let isHalf: boolean = false;
  if (
    right.type === 'VALUE' &&
    right.value === '2' &&
    left.type === 'IDENTIFIER'
  ) {
    codeGen.flatAst.push(`LOAD ${codeGen.varibles[left.name]}`);
    codeGen.flatAst.push(`HALF`);
    isHalf = true;
  } else if (
    right.type === 'VALUE' &&
    right.value === '2' &&
    left.type === 'VALUE'
  ) {
    codeGen.flatAst.push(`SET ${left.value}`);
    codeGen.flatAst.push(`HALF`);
    isHalf = true;
  }

  const ra = codeGen.generateUniqueVar();
  const rb = codeGen.generateUniqueVar();
  const rc = codeGen.generateUniqueVar();
  const rd = codeGen.generateUniqueVar();
  const re = codeGen.generateUniqueVar();

  if (!isHalf) {
    codeGen.generateAssign({
      type: 'ASSIGN',
      identifier: rc,
      value: {
        type: 'VALUE',
        value: '0',
      },
    });
    codeGen.generateIf({
      type: 'IF',
      condition: {
        left: {
          type: 'VALUE',
          value: '0',
        },
        type: 'CONDITION',
        right: right,
        operator: '<',
      },
      commands: [
        {
          type: 'ASSIGN',
          identifier: rb,
          value: right,
        },
        {
          type: 'ASSIGN',
          identifier: ra,
          value: left,
        },
        {
          type: 'WHILE',
          condition: {
            left: {
              type: 'IDENTIFIER',
              name: rb,
            },
            type: 'CONDITION',
            right: {
              type: 'IDENTIFIER',
              name: ra,
            },
            operator: '<',
          },
          commands: [
            {
              type: 'ASSIGN',
              identifier: rd,
              value: {
                type: 'VALUE',
                value: '1',
              },
            },
            {
              type: 'ASSIGN',
              identifier: re,
              value: {
                type: 'IDENTIFIER',
                name: rb,
              },
            },
            {
              type: 'WHILE',
              condition: {
                left: {
                  type: 'IDENTIFIER',
                  name: re,
                },
                type: 'CONDITION',
                right: {
                  type: 'IDENTIFIER',
                  name: ra,
                },
                operator: '<=',
              },
              commands: [
                {
                  type: 'ASSIGN',
                  identifier: re,
                  value: {
                    type: 'EXPRESSION',
                    left: {
                      type: 'IDENTIFIER',
                      name: re,
                    },
                    right: {
                      type: 'IDENTIFIER',
                      name: re,
                    },
                    operator: '+',
                  },
                },
                {
                  type: 'ASSIGN',
                  identifier: rd,
                  value: {
                    type: 'EXPRESSION',
                    left: {
                      type: 'IDENTIFIER',
                      name: rd,
                    },
                    right: {
                      type: 'IDENTIFIER',
                      name: rd,
                    },
                    operator: '+',
                  },
                },
              ],
            },
            {
              type: 'ASSIGN',
              identifier: rd,
              value: {
                type: 'EXPRESSION',
                left: {
                  type: 'IDENTIFIER',
                  name: rd,
                },
                right: {
                  type: 'VALUE',
                  value: '2',
                },
                operator: '/',
              },
            },
            {
              type: 'ASSIGN',
              identifier: re,
              value: {
                type: 'EXPRESSION',
                left: {
                  type: 'IDENTIFIER',
                  name: re,
                },
                right: {
                  type: 'VALUE',
                  value: '2',
                },
                operator: '/',
              },
            },
            {
              type: 'ASSIGN',
              identifier: rc,
              value: {
                type: 'EXPRESSION',
                left: {
                  type: 'IDENTIFIER',
                  name: rc,
                },
                right: {
                  type: 'IDENTIFIER',
                  name: rd,
                },
                operator: '+',
              },
            },
            {
              type: 'ASSIGN',
              identifier: ra,
              value: {
                type: 'EXPRESSION',
                left: {
                  type: 'IDENTIFIER',
                  name: ra,
                },
                right: {
                  type: 'IDENTIFIER',
                  name: re,
                },
                operator: '-',
              },
            },
          ],
        },
      ],
      elseCommands: [],
    });
    codeGen.flatAst.push(`LOAD ${codeGen.varibles[rc]}`);
  }
};

export const modGen = (
  codeGen: CodeGenerator,
  left: Identifier | Value,
  right: Identifier | Value
) => {
  const ra = codeGen.generateUniqueVar();
  const rb = codeGen.generateUniqueVar();
  const rc = codeGen.generateUniqueVar();
  const rd = codeGen.generateUniqueVar();
  const re = codeGen.generateUniqueVar();
  codeGen.generateAssign({
    type: 'ASSIGN',
    identifier: ra,
    value: left,
  });
  codeGen.generateAssign({
    type: 'ASSIGN',
    identifier: rd,
    value: {
      type: 'VALUE',
      value: '0',
    },
  });
  codeGen.generateWhile({
    type: 'WHILE',
    condition: {
      left: right,
      type: 'CONDITION',
      right: {
        type: 'IDENTIFIER',
        name: ra,
      },
      operator: '<=',
    },
    commands: [
      {
        type: 'ASSIGN',
        identifier: rc,
        value: right,
      },
      {
        type: 'WHILE',
        condition: {
          left: {
            type: 'IDENTIFIER',
            name: rc,
          },
          type: 'CONDITION',
          right: {
            type: 'IDENTIFIER',
            name: ra,
          },
          operator: '<=',
        },
        commands: [
          {
            type: 'ASSIGN',
            identifier: rc,
            value: {
              type: 'EXPRESSION',
              left: {
                type: 'IDENTIFIER',
                name: rc,
              },
              right: {
                type: 'IDENTIFIER',
                name: rc,
              },
              operator: '+',
            },
          },
        ],
      },
      {
        type: 'ASSIGN',
        identifier: rc,
        value: {
          type: 'EXPRESSION',
          left: {
            type: 'IDENTIFIER',
            name: rc,
          },
          right: {
            type: 'VALUE',
            value: '2',
          },
          operator: '/',
        },
      },
      {
        type: 'ASSIGN',
        identifier: ra,
        value: {
          type: 'EXPRESSION',
          left: {
            type: 'IDENTIFIER',
            name: ra,
          },
          right: {
            type: 'IDENTIFIER',
            name: rc,
          },
          operator: '-',
        },
      },
      {
        type: 'ASSIGN',
        identifier: rd,
        value: {
          type: 'EXPRESSION',
          left: {
            type: 'IDENTIFIER',
            name: rd,
          },
          right: {
            type: 'IDENTIFIER',
            name: rc,
          },
          operator: '+',
        },
      },
    ],
  });
  if (left.type === 'IDENTIFIER') {
    codeGen.flatAst.push(`LOAD ${codeGen.varibles[left.name]}`);
  } else {
    codeGen.flatAst.push(`LOAD ${left.value}`);
  }
  codeGen.flatAst.push(`SUB ${codeGen.varibles[rd]}`);
};
