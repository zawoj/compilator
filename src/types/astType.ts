export type astType = {
  type: string;
  procedures: Procedure[];
  program: Program;
};

export type Procedure = {
  name: string;
  parameters: any[];
  body: any;
};

export type Program = {
  type: string;
  variables: string[];
  commands: commands[];
};

export type commands =
  | While
  | If
  | Assign
  | Read
  | Write
  | Repeat
  | Expression
  | Identifier;

export type While = {
  type: 'WHILE';
  condition: Condition;
  commands: commands[];
};

export type Repeat = {
  type: 'REPEAT';
  condition: Condition;
  commands: commands[];
};

export type If = {
  type: 'IF';
  condition: Condition;
  commands: commands[];
  elseCommands: commands[];
};

export type Assign = {
  type: 'ASSIGN';
  identifier: string;
  value: Value | Expression | Identifier;
};

export type Read = {
  type: 'READ';
  value: string;
};

export type Write = {
  type: 'WRITE';
  value: Value | Identifier;
};

export type Condition = {
  type: 'CONDITION';
  left: Value | Identifier;
  operator: '>' | '<' | '>=' | '<=' | '=' | '!=';
  right: Value | Identifier;
};

export type Expression = {
  type: 'EXPRESSION';
  left: Value | Identifier;
  operator: '+' | '-' | '*' | '/';
  right: Value | Identifier;
};

export type Identifier = {
  type: 'IDENTIFIER';
  name: string;
};

export type Value = {
  type: 'VALUE';
  value: string | number;
};
