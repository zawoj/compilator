all: compile clean

compile: parser lexer
	g++ -g3 -o compiler lex.yy.c -lfl

lexer:
	flex lexer.l

parser:
	bison -d parser.y

clean:
	rm -f parser.tab.* lex.* *.o