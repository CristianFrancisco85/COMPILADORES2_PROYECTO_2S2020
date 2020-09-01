import {Traducir, ReturnAST} from '../Compilador/Traductor.js';
import {Ejecutar} from '../Compilador/Interprete.js'
const parser = require('../Compilador/Gramatica.js');

export let CodeTxt="",TraduccionTxt="";
export let Viewer,Console
let AST

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
        if(AST.ErroresSintacticos.length>0){
            setErrorSintactico(AST.ErroresSintacticos)
        }
    } 
    catch (e) {
        console.error(e);
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
    if(AST.ErroresSintacticos.length>0){
        setErrorSintactico(AST.ErroresSintacticos)
    }
    AST=undefined
    }
    catch(e){
        console.error(e);
    }
}

function setErrorLexico(ErroresLexicos){
    for(var i=0;i<ErroresLexicos.length;i++){
        var texto=document.createElement("p");
        texto.innerHTML="Error Lexico "+ErroresLexicos[i].Error+
        " en fila "+ErroresLexicos[i].Fila+" y columna "+ErroresLexicos[i].Columna;
        document.getElementById("Lexicos").appendChild(texto);
    }
}

function setErrorSintactico(ErroresSintacticos){
    for(var i=0;i<ErroresSintacticos.length;i++){
        var texto=document.createElement("p");
        texto.innerHTML="Error sintactico "+ErroresSintacticos[i].Error+
        " en fila "+ErroresSintacticos[i].Fila+" y columna "+ErroresSintacticos[i].Columna
        document.getElementById("Sintacticos").appendChild(texto);
    }
}


