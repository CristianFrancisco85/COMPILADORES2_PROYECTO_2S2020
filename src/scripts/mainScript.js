import {Traducir, ReturnAST} from '../Compilador/Traductor.js';
import {Ejecutar} from '../Compilador/Interprete.js'
const parser = require('../Compilador/Gramatica.js').parser;

let ErroresSintacticos=[];
export let CodeTxt="",TraduccionTxt="";
export let Viewer,Console
let AST

parser.yy.parseError = function(msg, hash) {
    ErroresSintacticos.push(
		{
			Error:hash.text,
			Fila:hash.line,
			Columna:hash.loc.first_column
		}); 
    console.log('No se esperaba "'+hash.token+'" en linea '+hash.line); 
}

export function setCode(text){
    CodeTxt=text
}
//Actualiza el numero de linea y columna de un editor
export function setLC(editor,element){
    element.innerHTML="L: "+Number(editor.getCursor().line+1)+" C: "+editor.getCursor().ch
}
export function setViewer(editor){
    Viewer=editor
}
export function setConsole(editor){
    Console=editor
}
export function translate(){
    document.getElementById("Lexicos").innerHTML=""
    document.getElementById("Sintacticos").innerHTML=""
    try {
        //AST ORIGINAL
        AST = parser.parse(CodeTxt.toString());
        console.log(JSON.stringify(AST,null,2));

        //Salida de Traduccion
        TraduccionTxt=Traducir(AST.AST);
        Viewer.setValue(TraduccionTxt)

        //AST DESANIDADO
        AST.AST=ReturnAST();
        //console.log(JSON.stringify(AST,null,2));
        if(AST.ErroresLexicos.length>0){
            setErrorLexico(AST.ErroresLexicos)
        }
        if(ErroresSintacticos.length>0){
            setErrorSintactico(ErroresSintacticos)
        }
    } 
    catch (e) {
        console.error(e.message);
    }
}
export function execute(){
    document.getElementById("Lexicos").innerHTML=""
    document.getElementById("Sintacticos").innerHTML=""
    try{
    if(AST===undefined){
        AST = parser.parse(CodeTxt.toString());
    }
    Ejecutar(AST.AST)

    if(AST.ErroresLexicos.length>0){
        setErrorLexico(AST.ErroresLexicos)
    }
    if(ErroresSintacticos.length>0){
        setErrorSintactico(ErroresSintacticos)
    }
    AST=undefined
    }
    catch(e){
        console.error(e);
    }
}

function setErrorLexico(Errores){
    for(var i=0;i<Errores.length;i++){
        var texto=document.createElement("p");
        texto.innerHTML="Caracter invalido "+Errores[i].Error+
        " en fila "+Errores[i].Fila+" y columna "+Errores[i].Columna;
        document.getElementById("Lexicos").appendChild(texto);
    }
}
function setErrorSintactico(Errores){
    for(var i=0;i<Errores.length;i++){
        var texto=document.createElement("p");
        texto.innerHTML="No se esperaba "+Errores[i].Error+
        " en fila "+Errores[i].Fila+" y columna "+Errores[i].Columna
        document.getElementById("Sintacticos").appendChild(texto);
    }
    ErroresSintacticos=[]
}


