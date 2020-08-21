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
"null"                      return 'NULL'

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
%left 'PUNTO'
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
    : asignacion                        {$$=$1}
    | declaracion_asignacion            {$$=$1}
    | bloqueIf                          {$$=$1}
    | bloqueWhile                       {$$=$1}
    | bloqueDoWhile                     {$$=$1}
    | bloqueFor                         {$$=$1}
    | bloqueSwitch                      {$$=$1}
    | error PUNTOYCOMA                  {Manejo_Errores.addErrorSintactico(yytext,this._$.first_line,this._$.first_column);$$=undefined }           
;

/*DECLARACIONES, ASIGNACIONES Y EXPRESIONES*/

declaracion_asignacion
    : LET listaID PUNTOYCOMA                        {$$=AST_Tools.declaracion_let($2)}
    | CONST listaID PUNTOYCOMA                      {$$=AST_Tools.declaracion_const($2)}
    | TYPE ID IGUAL LLAVIZQ listaAttrib LLAVDER     {$$=AST_Tools.declaracion_type($2,$5)}
;

asignacion
    : ID IGUAL expresion PUNTOYCOMA         {$$=AST_Tools.asignacion($1,$3)}
    | atributos IGUAL expresion PUNTOYCOMA  {$$=AST_Tools.asignacion($1,$3)}
;

tipo
    :STRING             {$$=Tipo_Valor.STRING}
    |NUMBER             {$$=Tipo_Valor.NUMBER}
    |BOOLEAN            {$$=Tipo_Valor.BOOLEAN}
    |VOID               {$$=Tipo_Valor.VOID}
    |ID                 {$$=$1}
;

listaID
    //SIN VALOR
    :listaID COMA ID DOSPUNTOS tipo     {$1.push(AST_Tools.newID($3,$5,undefined));}                        
    |listaID COMA ID                    {$1.push(AST_Tools.newID($3,undefined,undefined));}                         
    |ID DOSPUNTOS tipo                  {$$=AST_Tools.newIDList($1,$3,undefined)}   
    |ID                                 {$$=AST_Tools.newIDList($1,undefined,undefined)}  
    //CON VALOR
    |listaID COMA ID DOSPUNTOS tipo IGUAL expresion     {$1.push(AST_Tools.newID($3,$5,$7));}                        
    |listaID COMA ID IGUAL expresion                    {$1.push(AST_Tools.newID($3,undefined,$5));}                         
    |ID DOSPUNTOS tipo IGUAL expresion                  {$$=AST_Tools.newIDList($1,$3,$5)}   
    |ID IGUAL expresion                                 {$$=AST_Tools.newIDList($1,undefined,$3)} 
    //CON VALOR DE TYPE
    |listaID COMA ID DOSPUNTOS tipo IGUAL LLAVIZQ listaVal LLAVDER     {$1.push(AST_Tools.newID($3,$5,$8));}                        
    |listaID COMA ID IGUAL LLAVIZQ listaVal LLAVDER                    {$1.push(AST_Tools.newID($3,undefined,$6));}                         
    |ID DOSPUNTOS tipo IGUAL LLAVIZQ listaVal LLAVDER                  {$$=AST_Tools.newIDList($1,$3,$5)}   
    |ID IGUAL LLAVIZQ listaVal LLAVDER                                 {$$=AST_Tools.newIDList($1,undefined,$4)} 
;

listaAttrib
    : listaAttrib COMA ID DOSPUNTOS tipo    {$1.push(AST_Tools.newAttrib($3,$5))}
    | ID DOSPUNTOS tipo                     {$$=AST_Tools.newAttribList($1,$3)}
;

listaVal
    : listaVal COMA ID DOSPUNTOS expresion       {$1.push(AST_Tools.newTypeVal($3,$5))}
    | ID DOSPUNTOS expresion                     {$$=AST_Tools.newTypeValList($1,$3)}
;

listaParam
    : listaParam COMA expresion     {$1.push(AST_Tools.newParam($3))}
    | expresion                     {$$=AST_Tools.newParamList($1)}
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
    | TRUE                                  { $$ = AST_Tools.crearValor($1,Tipo_Valor.BOOLEAN);}
    | FALSE                                 { $$ = AST_Tools.crearValor($1,Tipo_Valor.BOOLEAN);}
    | NULL                                  { $$ = AST_Tools.crearValor($1,Tipo_Valor.NULL);}
    //RELACIONALES
    | expresion MAYOR expresion             { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_QUE);}
    | expresion MENOR expresion             { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_QUE);}
    | expresion MAYORIG expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MAYOR_IGUAL);}
    | expresion MENORIG expresion           { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.MENOR_IGUAL);}
    | expresion DIGUAL expresion            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.DOBLE_IGUAL);}
    | expresion NIGUAL expresion            { $$ = AST_Tools.operacionBinaria($1, $3, Tipo_Operacion.NO_IGUAL);}
    //FUNCIONES Y ATRIBUTOS
    | ID PARIZQ listaParam PARDER           { $$ = AST_Tools.llamadaFuncion($1,$3);}
    | ID PARIZQ PARDER                      { $$ = AST_Tools.llamadaFuncion($1,undefined);}
    | atributos                             { $$ = $1}
    //EXPRESION DE ASIGNACION DE ATRIBUTOS
;

atributos
    : atributos PUNTO ID       { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}
    | ID PUNTO ID                     { $$ = AST_Tools.operacionBinaria($1,$3,Tipo_Operacion.ATRIBUTO)}
;

/* SENTENCIAS DE CONTROL DE FLUJO */

bloqueIf
    : IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER              {$$= AST_Tools.nuevoIf($3,$6);}
    | IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER bloqueElse   {$$= AST_Tools.nuevoIfElse($3,$6,$8)}
    | IF PARIZQ expresion PARDER LLAVIZQ LLAVDER                            {$$= AST_Tools.nuevoIf($3,undefined);}
    | IF PARIZQ expresion PARDER LLAVIZQ LLAVDER bloqueElse                 {$$= AST_Tools.nuevoIfElse($3,undefined,$7)}
;

bloqueElse
    : ELSE LLAVIZQ instrucciones LLAVDER                                           {$$= $3}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER                {$$= AST_Tools.nuevoIf($4,$7);}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER bloqueElse     {$$= AST_Tools.nuevoIfElse($4,$7,$9)}
    | ELSE LLAVIZQ  LLAVDER                                                        {$$= undefined}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ LLAVDER                              {$$= AST_Tools.nuevoIf($4,undefined);}
    | ELSE IF PARIZQ expresion PARDER LLAVIZQ LLAVDER bloqueElse                   {$$= AST_Tools.nuevoIfElse($4,undefined,$8)}
;

bloqueSwitch
    : SWITCH PARIZQ expresion PARDER LLAVIZQ casos LLAVDER     {$$=AST_Tools.nuevoSwitch($3,$6);}
;

casos 
    : casos caso    {$1.push($2);}
    | caso          {$$=AST_Tools.listaCasos($1);}
;

caso 
    : CASE expresion DOSPUNTOS LLAVIZQ instrucciones LLAVDER      {$$=AST_Tools.nuevoCaso($2,$5);}
    | DEFAULT DOSPUNTOS LLAVIZQ instrucciones LLAVDER             {$$=AST_Tools.nuevoCasoDefault($4);}
    | CASE expresion DOSPUNTOS LLAVIZQ LLAVDER                    {$$=AST_Tools.nuevoCaso($2,undefined);}
    | DEFAULT DOSPUNTOS LLAVIZQ LLAVDER                           {$$=AST_Tools.nuevoCasoDefault(undefined);}
;

/* SENTENCIAS DE REPETICION */

bloqueWhile
    : WHILE PARIZQ expresion PARDER LLAVIZQ instrucciones LLAVDER     {$$= AST_Tools.nuevoWhile($3,$6);}
    | WHILE PARIZQ expresion PARDER LLAVIZQ  LLAVDER                  {$$= AST_Tools.nuevoWhile($3,undefined);}
;

bloqueDoWhile
    : DO LLAVIZQ instrucciones LLAVDER WHILE PARIZQ expresion PARDER     {$$= AST_Tools.nuevoDoWhile($7,$3);}
    | DO LLAVIZQ LLAVDER WHILE PARIZQ expresion PARDER                   {$$= AST_Tools.nuevoDoWhile($6,undefined);}
;

bloqueFor
    :FOR PARIZQ asignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ instrucciones LLAVDER                {$$=AST_Tools.nuevoFor($3,$4,$6,$9);}
    |FOR PARIZQ declaracion_asignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ instrucciones LLAVDER    {$$=AST_Tools.nuevoFor($3,$4,$6,$9);}
    |FOR PARIZQ asignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ LLAVDER                              {$$=AST_Tools.nuevoFor($3,$4,$6,undefined);}
    |FOR PARIZQ declaracion_asignacion expresion PUNTOYCOMA expresion PARDER LLAVIZQ LLAVDER                  {$$=AST_Tools.nuevoFor($3,$4,$6,undefined);}
;
