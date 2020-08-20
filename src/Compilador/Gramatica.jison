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
"true"                      return 'TRUE'
"false"                     return 'FALSE'

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

%left 'OR'
%left 'AND'
%left 'DIGUAL' 'NIGUAL'
%left 'MAYOR' 'MENOR' 'MENORIG' 'MAYORIG'
%left 'OPMAS' 'OPMENOS'
%left 'OPMOD' 'OPDIVISION' 'OPMULTI'
%left 'OPCIRCU'
%right  'UMENOS' 'NOT'
%nonassoc 'DECREMENTO' 'INCREMENTO'
%nonassoc 'PARDER' 'PARIZQ'

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
    : declaracion                        {$$=$1}
    | asignacion                         {$$=$1}
    | error PUNTOYCOMA                   {Manejo_Errores.addErrorSintactico(yytext,this._$.first_line,this._$.first_column);$$=undefined }           
;

declaracion
    : LET listaID PUNTOYCOMA    {$$=AST_Tools.declaracion($2)}
;

asignacion
    : ID IGUAL expresion PUNTOYCOMA        {$$=AST_Tools.asignacion($1,$3)}
;  

declaracion_asignacion
    :
;

listaID
    :listaID COMA ID DOSPUNTOS tipo     {$1.push(AST_Tools.newID($3,$5));}                        
    |listaID COMA ID                    {$1.push(AST_Tools.newID($3,undefined));}                         
    |ID DOSPUNTOS tipo                  {$$=AST_Tools.newIDList($1,$3)}   
    |ID                                 {$$=AST_Tools.newIDList($1,undefined)}  
    | 
;

tipo
    :STRING             {$$=Tipo_Valor.STRING}
    |NUMBER             {$$=Tipo_Valor.NUMBER}
    |BOOLEAN            {$$=Tipo_Valor.BOOLEAN}
    |VOID               {$$=Tipo_Valor.VOID}
    |ID                 {$$=$1}
;

expresion
    : PARIZQ expresion PARDER			    { $$ = $2; }
    //ARITMETICAS
    | OPMENOS expresion %prec UMENOS	    { $$ = AST_Tools.operacionBinaria ($2,undefined,Tipo_Operacion.NEGACION); }
    | expresion OPMENOS expresion		    { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.RESTA);}
	| expresion OPMAS expresion	            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.SUMA);}	
	| expresion OPDIVISION expresion		{ $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.DIVISON);}				
    | expresion OPMOD expresion	            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MODULO);}
    | expresion OPCIRCU expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.POTENCIA);}
    | expresion OPMULTI expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MULTIPLICACION);}
	| NUMERO							    { $$ = AST_Tools.crearValor(Number($1),Tipo_Valor.NUMBER); }
	| ID                                    { $$ = AST_Tools.crearValor($1,Tipo_Valor.ID); }
    | CADENA                                { $$ = AST_Tools.crearValor($1,Tipo_Valor.STRING); }
    | ID DECREMENTO                         { $$ = AST_Tools.operacionBinaria ($1,undefined,Tipo_Operacion.DECREMENTO); }
    | NUMERO DECREMENTO                     { $$ = AST_Tools.operacionBinaria (Number($1),undefined,Tipo_Operacion.DECREMENTO); }
    | ID INCREMENTO                         { $$ = AST_Tools.operacionBinaria ($1,undefined,Tipo_Operacion.INCREMENTO); }
    | NUMERO INCREMENTO                     { $$ = AST_Tools.operacionBinaria (Number($1),undefined,Tipo_Operacion.INCREMENTO); }
    //LOGICAS
    | expresion AND expresion               { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.AND);}
    | expresion OR expresion                { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.OR);}
    | NOT expresion                         { $$ = AST_Tools.operacionBinaria ($2,undefined,Tipo_Operacion.NOT);}
    | TRUE                                  { $$ = AST_Tools.crearValor($1,Tipo_Valor.BOOLEANO);}
    | FALSE                                 { $$ = AST_Tools.crearValor($1,Tipo_Valor.BOOLEANO);}
    //RELACIONALES
    | expresion MAYOR expresion             { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_QUE);}
    | expresion MENOR expresion             { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_QUE);}
    | expresion MAYORIG expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_IGUAL);}
    | expresion MENORIG expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_IGUAL);}
    | expresion DIGUAL expresion            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.DOBLE_IGUAL);}
    | expresion NIGUAL expresion            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.NO_IGUAL);}
    //FUNCIONES Y ATRIBUTOS
    //| ID PARIZQ lista_parametros PARDER     { $$ = AST_Tools.llamadaFuncion($1,$3);}
    //| ID PARIZQ PARDER                      { $$ = AST_Tools.llamadaFuncion($1,undefined);}

;

