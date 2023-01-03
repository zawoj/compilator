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
  int64_t ival;
}

%token <ival> num;

%token PROCEDURE  "PROCEDURE"
%token IS         "IS"
%token VAR        "VAR"
%token BEGIN      "BEGIN"
%token END        "END"
%token IF         "IF"

