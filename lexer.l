%option noyywrap
%{
#include <string>
#include <iostream>

#include "parser.tab.h"

int yylex();
%}

%s COMMENT
%%
<INITIAL>{
"PROCEDURE"     {return PROCEDURE;}
"PROGRAM"       {return PROGRAM;}
"VAR"           {return VAR;}
"IS"            {return IS;}
"BEGIN"         {return PBEGIN;}
"END"           {return END;}
"IF"            {return IF;}
"THEN"          {return THEN;}
"ELSE"          {return ELSE;}
"ENDIF"         {return ENDIF;}
"WHILE"         {return WHILE;}
"DO"            {return DO;}
"ENDWHILE"      {return ENDWHILE;}
"READ"          {return READ;}
"WRITE"         {return WRITE;}
"+"             {return PLUS;}
"-"             {return MINUS;}
"*"             {return MULT;}
"/"             {return DIV;}
"%"             {return MOD;}
":="            {return ASSIGN;}
"="             {return EQUAL;}
"!="            {return NOTEQUAL;}
"<"             {return LESS;}
"<="            {return LESSEQUAL;}
">"             {return GREATER;}
">="            {return GREATEREQUAL;}
"("             {return LPAREN;}
")"             {return RPAREN;}
";"             {return SEMICOLON;}
","             {return COMMA;}
":"             {return COLON;}
"["             {BEGIN(COMMENT);}
[_a-z]+         {yylval.str = new std::string(yytext); return PIDENTIFIER;}
[0-9]+          {yylval.intval = atoll(yytext); return NUM;}
\r              ;
\n              ;
.               {return INVALIDCHAR;}
}

<COMMENT>{
[^\]]        ;
"["             {BEGIN(INITIAL);}
}

%%