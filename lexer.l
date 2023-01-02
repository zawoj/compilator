%option noyywrap
%{
#include <string>
#include <iostream>

// Here will go other includes connected to Codegenerator and other parts of compiler

int yylex();
%}

%s COMMENT
%%

  <INITIAL>{
    "PROCEDURE"     {return PROCEDURE;}
    "PROGRAM"       {return PROGRAM;}
    "VAR"           {return VAR;}
    "IS"            {return IS;}

    "BEGIN"         {return BEGIN;}
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

    [0-9]+          {return yylval.sum = std::stoll(yytext); return NUMBER;}
    [_a-z]+         {return yylval.str = new std::string(yytext); return PIDENTIFIER;}

    [ \r\t\n]       ;

    .               {return INVALIDCHAR;}
  }
  
<COMMENT>{
  [^\]]               ;
  "]"                 { BEGIN(INITIAL); }
  <<EOF>>             { return INFCOMMENT; }
}

%%