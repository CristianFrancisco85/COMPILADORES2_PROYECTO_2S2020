/* Cristian Meoño - 201801397 */

%lex

%options lex case-sensitive yylineno


%% 

\s+							        /* Ignorar Espacios */
"//".*	                            /* Comentario Simple */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/] /* Comentario Multiple */

"string"                    return 'STRING';
"number"	                return 'NUMBER';
"boolean"                   return 'BOOLEAN';
"void"                      return 'VOID';
"type"                      return 'TYPE';

"let"                       return 'LET';
"const"                     return 'CONST';

"++"                        return 'INCREMENTO';
"--"                        return 'DECREMENTO';
"/"                         return 'OPDIV';
"*"                         return 'OPMULTI';
"%"                         return 'OPMOD';
"-"                         return 'OPMENOS';
"+"                         return 'OPMAS';
"^"                         return 'OPCIRCU';

"("                         return 'PARIZQ';
")"                         return 'PARDER';
"{"                         return 'LLAVIZQ';
"}"                         return 'LLAVDER';

">="                        return 'MAYORIG';
"<="                        return 'MENORIG';
">"                         return 'MENOR';
"<"                         return 'MAYOR';
"=="                        return 'DIGUAL';
"="                         return 'IGUAL';
"!="                        return 'NIGUAL';

"."                         return 'PUNTO';
";"                         return 'PUNTOYCOMA';
","                         return 'COMA';
":"                         return 'DOSPUNTOS';
"?"                         return 'TERNARIO';

"&&"                        return 'AND';
"||"                        return 'OR';
"!"                         return 'NOT';

"if"                        return 'IF';
"else"                      return 'ELSE';
"switch"                    return 'SWITCH';
"case"                      return 'CASE';
"default"                   return 'DEFAULT';
"while"                     return 'WHILE';
"do"                        return 'DO';
"for"                       return 'FOR';
"of"                        return 'OF';
"in"                        return 'IN';
"break"                     return 'BREAK';
"continue"                  return 'CONTINUE';
"return"                    return 'RETURN';
"function"                  return 'FUNCTION';
"console"                   return 'CONSOLE';
"log"                       return 'LOG';
"graficar_ts"               return 'GRAFICAR';


\"(\\\"|[^\"])*\"			{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'(\\\"|[^\"])*\'			{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
[0-9]+("."[0-9]+)?\b        return 'NUMERO'
([a-zA-Z])[a-zA-Z0-9_]*	    return 'ID';
<<EOF>>                     return 'EOF';
.                           {Manejo_Errores.addErrorLexico(yytext,yylineno+1);return''}

/lex

%{
	const Tipo_Operacion	= require('./Instrucciones.js').Tipo_Operacion;
	const Tipo_Valor 	    = require('./Instrucciones.js').Tipo_Valor;
    const AST_Tools     	= require('./Instrucciones.js').AST_Tools;
    const Manejo_Errores    = require('./Instrucciones.js').Manejo_Errores;
%}


%left 'OPMAS' 'OPMENOS'
%left 'OPMOD' 'OPDIVISION' 'OPMULTI'
%left 'OPCIRCU'
%left  UMENOS

%start init

%% 

init
    : inicio EOF {Manejo_Errores.resetErrors();return $1;}
;

inicio
    : instrucciones   {$$=AST_Tools.BloquePrincipal($1);}       
;

instrucciones
	: instrucciones instruccion { $1.push($2); $$ = $1; }	
	| instruccion				{ $$ = [$1]; }	
;

instruccion
    : ID                        {$$="IDXD"}
    | error PUNTOYCOMA          {console.log("Error")}            
;

