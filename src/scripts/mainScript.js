//Variable Globales

const parser = require('../Compilador/Gramatica.js');

export let CodeTxt="";
let Editor;

export function print(text,event){
    alert("Codigo: \n"+CodeTxt);
}

export function setCode(text){
    CodeTxt=text
}

export function setLC(editor,element){
    element.innerHTML="L: "+Number(editor.getCursor().line+1)+" C: "+editor.getCursor().ch
}

export function setViewer(editor){
   Editor=editor
}

export function parse(){
    let ast;
    try {
        // Se llama a parser
        ast = parser.parse(CodeTxt.toString());
        // Salida del AST en formato JSON
        console.log(JSON.stringify(ast,null,2));
        //return JSON.stringify(ast,null,2);
    } 
    catch (e) {
        console.error(e);
        //return e;
    }
}


