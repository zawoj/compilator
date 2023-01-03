%option noyywrap
%{
#include <string>
#include <iostream>

#include "src/variable/Variable.h"
#include "src/CodeGenerator.h"
#include "parser.tab.hpp"

int yylex();
%}

%s COMMENT
%%

<INITIAL>{
"DECLARE"           { return DECLARE; }
"BEGIN"             { return _BEGIN; }
"END"               { return END; }

"READ"              { return READ; }
"WRITE"             { return WRITE; }

"IF"                { return IF; }
"THEN"              { return THEN; }
"ELSE"              { return ELSE; }
"ENDIF"             { return ENDIF; }

"WHILE"             { return WHILE; }
"DO"                { return DO; }
"ENDWHILE"          { return ENDWHILE; }

"REPEAT"            { return REPEAT; }
"UNTIL"             { return UNTIL; }

"FOR"               { return FOR; }
"FROM"              { return FROM; }
"TO"                { return TO; }
"DOWNTO"            { return DOWNTO; }
"ENDFOR"            { return ENDFOR; }

"+"                 { return PLUS; }
"-"                 { return MINUS; }
"*"                 { return MULTIPLY; }
"/"                 { return DIVIDE; }
"%"                 { return MODULO; }

":="                { return ASSIGN; }

"="                 { return EQ; }
"!="                { return NE; }
"<"                 { return LT; }
">"                 { return GT; }
"<="                { return LE; }
">="                { return GE; }

"("                 { return LBRACKET; }
")"                 { return RBRACKET; }
";"                 { return SEMICOLON; }
":"                 { return COLON; }
","                 { return COMMA; }

"["                 { BEGIN(COMMENT); }

[0-9]+              { yylval.num = std::stoll(yytext); return NUM; }
[_a-z]+             { yylval.str = new std::string(yytext); return PIDENTIFIER; }

[ \r\t\n]           ;
.                   { return INVALIDCHAR; }
}

<COMMENT>{
[^\]]               ;
"]"                 { BEGIN(INITIAL); }
<<EOF>>             { return INFCOMMENT; }
}

%%
