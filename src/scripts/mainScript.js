import {Traducir, ReturAST} from '../Compilador/Traductor.js';
import {ReturnAST} from '../Compilador/Traductor.js';
const parser = require('../Compilador/Gramatica.js');

export let CodeTxt="2";
let Viewer,Console
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
    try {
        AST = parser.parse(CodeTxt.toString());
        console.log(JSON.stringify(AST,null,2));
        console.log(Traducir(AST.AST));
        Viewer.setValue(CodeTxt)
        AST.AST=ReturnAST();
        console.log(JSON.stringify(AST,null,2));
    } 
    catch (e) {
        console.error(e);
    }
}



