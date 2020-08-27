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
    try {
        AST = parser.parse(CodeTxt.toString());
        console.log(JSON.stringify(AST,null,2));
        TraduccionTxt=Traducir(AST.AST);
        Viewer.setValue(TraduccionTxt)
        AST.AST=ReturnAST();
        Ejecutar(AST.AST)
        console.log(JSON.stringify(AST,null,2));
    } 
    catch (e) {
        console.error(e);
    }
}



