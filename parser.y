%{
  // C++ code
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>
    #include <inttypes.h>
    #include <stack>
    #include <memory>
    #include <iostream>
  
  // My code includes

  extern int yylex();
  extern void yyerror(const char *s);
%}


%union {
   uint64_t intval;
   std::string* str;
}

%token <intval> num;

%token PROCEDURE  "PROCEDURE"
%token PROGRAM    "PROGRAM"
%token VAR        "VAR"
%token IS         "IS"

%token BEGIN      "BEGIN"
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

%token <str> PIDENTIFIER; 

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

%left '-' '+'
%left '*' '/' '%'

%%
program_all : procedures main { std::cout << "program_all" << std::endl; }
;

procedures : procedures PROCEDURE proc_head IS VAR declarations BEGIN commands END { std::cout << "procedures" << std::endl; }
           | procedures PROCEDURE proc_head IS BEGIN commands END { std::cout << "procedures" << std::endl; }
           | { std::cout << "procedures" << std::endl; }
;

main : PROGRAM IS VAR declarations BEGIN commands END { std::cout << "main" << std::endl; }
     | PROGRAM IS BEGIN commands END { std::cout << "main" << std::endl; }
;

expression : 
   value { std::cout << "expression value" << std::endl; }
|  value PLUS value { std::cout << "expression PLUS" << std::endl; }
|  value MINUS value { std::cout << "expression MINUS" << std::endl; }
|  value MULT value { std::cout << "expression MULT" << std::endl; }
|  value DIV value { std::cout << "expression DIV" << std::endl; }
|  value MOD value { std::cout << "expression MOD" << std::endl; }
;

condition : 
   value EQUAL value { std::cout << "condition EQUAL" << std::endl; }
|  value NOTEQUAL value { std::cout << "condition NOTEQUAL" << std::endl; }
|  value LESS value { std::cout << "condition LESS" << std::endl; }
|  value LESSEQUAL value { std::cout << "condition LESSEQUAL" << std::endl; }
|  value GREATER value { std::cout << "condition GREATER" << std::endl; }
|  value GREATEREQUAL value { std::cout << "condition GREATEREQUAL" << std::endl; }
;

value : 
   num { std::cout << "value num" << std::endl; }
|  identifier { std::cout << "value identifier" << std::endl; }
;

commands : commands command { std::cout << "commands" << std::endl; }
         | command { std::cout << "commands" << std::endl; }
;

command : 
   identifier ASSIGN expression SEMICOLON { std::cout << "command ASSIGN" << std::endl; }
|  IF condition THEN commands ELSE commands ENDIF { std::cout << "command IF" << std::endl; }
|  IF condition THEN commands ENDIF { std::cout << "command IF" << std::endl; }
|  WHILE condition DO commands ENDWHILE { std::cout << "command WHILE" << std::endl; }
|  proc_head SEMICOLON { std::cout << "command proc_head" << std::endl; }
|  READ identifier SEMICOLON { std::cout << "command READ" << std::endl; }
|  WRITE value SEMICOLON { std::cout << "command WRITE" << std::endl; }
;

proc_head : 
   identifier LPAREN declarations RPAREN { std::cout << "proc_head" << std::endl; }
;

declarations : declarations COMMA identifier { std::cout << "declarations" << std::endl; }
             | identifier { std::cout << "declarations" << std::endl; }
;

identifier : PIDENTIFIER { std::cout << "identifier" << std::endl; }

%%


void yyerror(std::string error) {
    printf("%s\n", error.c_str());
    exit(1);
}


int main(int argc, char** argv) {
   
    try {
        yyparse();
    } catch(std::string error) {
        yyerror(error);
    }


    return 0;
}