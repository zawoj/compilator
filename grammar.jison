/* lexical grammar */

%lex
%x comment


%%

"PROCEDURE"     return "PROCEDURE"
"PROGRAM"       return "PROGRAM"
"VAR"           return "VAR"
"IS"            return "IS"
"BEGIN"         return "PBEGIN"
"END"           return "END"
"IF"            return "IF"
"THEN"          return "THEN"
"ELSE"          return "ELSE"
"ENDIF"         return "ENDIF"
"WHILE"         return "WHILE"
"DO"            return "DO"
"ENDWHILE"      return "ENDWHILE"
"REPEAT"        return "REPEAT"
"UNTIL"         return "UNTIL"
"READ"          return "READ"
"WRITE"         return "WRITE"
"+"             return "PLUS"
"-"             return "MINUS"
"*"             return "MULT"
"/"             return "DIV"
"%"             return "MOD"
":="            return "ASSIGN"
"="             return "EQUAL"
"!="            return "NOTEQUAL"
"<"             return "LESS"
"<="            return "LESSEQUAL"
">"             return "GREATER"
">="            return "GREATEREQUAL"
"("             return "LPAREN"
")"             return "RPAREN"
";"             return "SEMICOLON"
","             return "COMMA"
":"             return "COLON"
"["             this.pushState("comment")
[0-9]+          return "NUM"
[_a-z]+         return "PIDENTIFIER"
[ \r\t\n]           /* skip */
.               return "INVALIDCHAR"

<comment>[^\]] {
    /* skip */
}

<comment>\] {
    this.pushState("INITIAL");
}

/lex

%{
   

   class whileBlock {
      constructor(condition, commands) {
         this.type = "WHILE";
         this.condition = condition;
         this.commands = commands;
      }
   }

   class repeatBlock {
      constructor(commands, condition) {
         this.type = "REPEAT";
         this.condition = condition;
         this.commands = commands;
      }
   }

   class writeCommand {
      constructor(value) {
         this.type = "WRITE";
         this.value = value;
      }
   }

   class readCommand {
      constructor(value) {
         this.type = "READ";
         this.value = value;
      }
   }

   class assignCommand {
      constructor(identifier, value) {
         this.type = "ASSIGN";
         this.identifier = identifier;
         this.value = value;
      }
   }

   class ifBlock {
      constructor(condition, commands, elseCommands) {
         this.type = "IF";
         this.condition = condition;
         this.commands = commands;
         this.elseCommands = elseCommands;
      }
   }

   class procedure {
      constructor(head, variables, commands) {
         this.type = "PROCEDURE";
         this.head = head;
         this.variables = variables;
         this.commands = commands;
      }
   }

   class procHead {
      constructor(name, variables) {
         this.type = "PROCHEADER";
         this.name = name;
         this.variables = variables;
      }
   }

   class procCall {
      constructor(name, values) {
         this.type = "PROCCALL";
         this.name = name;
         this.values = values;
      }
   }

   class program {
      constructor(variables, commands) {
         this.type = "PROGRAM";
         this.variables = variables;
         this.commands = commands;
      }
   }

   class value {
      constructor(value) {
         this.type = "VALUE";
         this.value = value;
      }
   }

   class identifier {
      constructor(name) {
         this.type = "IDENTIFIER";
         this.name = name;
      }
   }

   class expression {
      constructor(left, right, operator) {
         this.type = "EXPRESSION";
         this.left = left;
         this.right = right;
         this.operator = operator;
      }
   }

   class condition {
      constructor(left, right, operator) {
         this.left = left;
         this.type = "CONDITION";
         this.right = right;
         this.operator = operator;
      }
   }

   class globalCode {
      constructor(procedures, program) {
         this.type = "GLOBALCODE";
         this.procedures = procedures;
         this.program = program;
      }
   }


   // function getVariableAddress(variableName) {
   //    const variable = globalVariables.find((variable) => variable.name === variableName);
   //    if (!variable) {
   //       throw new Error(`Variable ${variableName} is not defined`);
   //    }
   //    return variable.memoryAddress;
   // }

   // function getVariableName(variableAddress) {
   //    const variable = globalVariables.find((variable) => variable.memoryAddress === variableAddress);
   //    if (!variable) {
   //       throw new Error(`Variable ${variableAddress} is not defined`);
   //    }
   //    return variable.name;
   // }

   // function checkVariable(variableName) {
   //    const variable = globalVariables.find((variableIn) => {
   //       return variableIn.name === variableName;
   //    });
   //    if (variable === undefined) {
   //      return false;
   //    }
   //    return true;
   // }



%}

/* operator associations and precedence */

%token NUM "NUM";

%token PROCEDURE  "PROCEDURE"
%token PROGRAM    "PROGRAM"
%token VAR        "VAR"
%token IS         "IS"

%token PBEGIN     
%token END        "END"

%token IF         "IF"
%token THEN       "THEN"
%token ELSE       "ELSE"
%token ENDIF      "ENDIF"

%token WHILE      "WHILE"
%token DO         "DO"
%token ENDWHILE   "ENDWHILE"

%token READ       "READ"
%token WRITE      "WRITE"

%token PIDENTIFIER "PIDENTIFIER"; 

%token ASSIGN     ":="

%token PLUS       "+"
%token MINUS      "-"
%token MULT       "*"
%token DIV        "/"
%token MOD        "%"

%token EQUAL         "="
%token NOTEQUAL      "!="
%token LESS          "<"
%token LESSEQUAL     "<="
%token GREATER       ">"
%token GREATEREQUAL  ">="

%token LPAREN         "("
%token RPAREN         ")"
%token SEMICOLON      ";"
%token COLON          ":"
%token COMMA          ","
%token INVALIDCHAR    "INVALIDCHAR"

%left '-' '+'
%left '*' '/' '%'

%start program_all

%% /* language grammar */
program_all : procedures main { 
   const newGlobalCode = new globalCode($procedures, $main)
   return newGlobalCode
 }
;

procedures : 
   procedures PROCEDURE proc_head IS VAR declarations PBEGIN commands END { 
      const newProcedureVar = new procedure($proc_head, $7, $commands)
      $$ = newProcedureVar
   }
|  procedures PROCEDURE proc_head IS PBEGIN commands END {
      const newProcedure = new procedure($proc_head, null, $commands)
      if($procedures !== undefined){
         $procedures.push(newProcedure)
         $$ = $procedures
      } else {
         $$ = [newProcedure]
      }
   }
| { }
;

main : 
   PROGRAM IS VAR declarations PBEGIN commands END { 
      const newProgramVar = new program($4, $6)
      $$ = newProgramVar
   }
| PROGRAM IS PBEGIN commands END {
      const newProgram = new program(null, $4)
      $$ = newProgram
 }
;

expression : 
   value { 
      // BCS is a value not an expression
      $$ = $1
    }
|  value PLUS value {  
      const newExpressionPlus = new expression($1, $3, $2)
      $$ = newExpressionPlus
 }
|  value MINUS value { 
      const newExpressionMinus = new expression($1, $3, $2)
      $$ = newExpressionMinus
  }
|  value MULT value { 
      const newExpressionMult = new expression($1, $3, $2)
      $$ = newExpressionMult
 }
|  value DIV value { 
      const newExpressionDiv = new expression($1, $3, $2)
      $$ = newExpressionDiv
 }
|  value MOD value { 
      const newExpressionMod = new expression($1, $3, $2)
      $$ = newExpressionMod
 }
;

condition : 
   value EQUAL value {  
      const newConditionEqual = new condition($1, $3, $2)
      $$ = newConditionEqual
    }
|  value NOTEQUAL value { 
      const newConditionNotequal = new condition($1, $3, $2)
      $$ = newConditionNotequal
  }
|  value LESS value { 
      const newConditionLess = new condition($1, $3, $2)
      $$ = newConditionLess
  }
|  value LESSEQUAL value {  
      const newConditionLessequal = new condition($1, $3, $2)
      $$ = newConditionLessequal
 }
|  value GREATER value { 
      const newConditionGreater = new condition($1, $3, $2)
      $$ = newConditionGreater
 }
|  value GREATEREQUAL value { 
      const newConditionGreaterEqual = new condition($1, $3, $2)
      $$ = newConditionGreaterEqual
  }
;

value : 
   NUM { 
      const newValue = new value($1)
      $$ = newValue
    }
|  identifier { 
      const newIdentifier = new identifier($1)
      $$ = newIdentifier
 }
;

commands : 
   commands command { 
   $$ = [...$1, $2]
   }
| command { 
            $$ = [$1]
          }
;

command : 
   identifier ASSIGN expression SEMICOLON { 
      const newAssign = new assignCommand($1, $3)
      $$ = newAssign
     }
|  IF condition THEN commands ELSE commands ENDIF {  
      const newIfElse = new ifBlock($2, $4, $6)
      $$ = newIfElse
 }
|  IF condition THEN commands ENDIF { 
      const newIf = new ifBlock($2, $4, [])
      $$ = newIf
  }
|  WHILE condition DO commands ENDWHILE { 
      const newWhile = new whileBlock($2, $4)
      $$ = newWhile
  }
|  proc_call SEMICOLON { 
      const newProcCall = new procCall($1)
      $$ = newProcCall
  }
|  READ identifier SEMICOLON { 
       const newRead = new readCommand($2)
       $$ = newRead
   }
|  WRITE value SEMICOLON { 
     const newWrite = new writeCommand($2)
     $$ = newWrite
   }
| REPEAT commands UNTIL condition SEMICOLON { 
     const newRepeat = new repeatBlock($2, $4)
     $$ = newRepeat
   }
| { }
;
// console.log(`READ ${$2}, line_number: ${yylineno + 1}`)
//  console.log(`WRITE ${$2}, line_number: ${yylineno + 1}`)

proc_head : 
   identifier LPAREN declarations_proc RPAREN {  
      const newProcHead = new procHead($1, $3)
      $$ = newProcHead
    }
;

declarations_proc : 
declarations_proc COMMA identifier {
   $$ = [...$1, $3]
 }
| identifier {  
     $$ = [$1]
   }
;
// console.log(`in proc: ${$3}`) 
// console.log(`in proc: ${$1}`)
proc_call : 
   identifier LPAREN proc_args RPAREN { 
      const newProcCallIN = new procCall($1, $3)
      $$ = newProcCallIN
     }
;

proc_args : 
   proc_args COMMA identifier { 
      $$ = [...$1, $3]
   }
   | identifier {  
      $$ = [$1]
   }
;

// Declarations
// console.log(`in proc call: ${$3}`)
// console.log(`in proc call: ${$1}`)
declarations : 
   declarations COMMA identifier_dec {
      $$ = [...$1, $3]
   }
|  identifier_dec { 
      $$ = [$1]
   }
;
identifier_dec : PIDENTIFIER { 
   // if (!checkVariable($1)) {
   //    console.log(`Error: ${$1} is already declared, line_number: ${yylineno + 1}`)
   //    process.exit(1)
   // } else {
   // }
      $$ = $1
 };


// console.log(`in declar: ${$3}`)
// console.log(`in declar: ${$1}`)
identifier : PIDENTIFIER { 
      $$ = $1
   // if (checkVariable($1)) {
   // } else {
   //    console.log(`Error: ${$1} is not declared, line_number: ${yylineno + 1}`)
   //    process.exit(1)
   // }
};