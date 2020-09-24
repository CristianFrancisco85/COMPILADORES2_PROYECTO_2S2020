import {Traducir, ReturnAST} from '../Compilador/Traductor.js';
import {Ejecutar} from '../Compilador/Interprete.js'
const parser = require('../Compilador/Gramatica.js').parser;
const _ = require('lodash')

let ErroresSintacticos=[];
export let CodeTxt="",TraduccionTxt="";
export let Viewer,Console
export let Simbolos=[]
export let Simbolos2=[]
export let AST,ASTData

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
    try {
        //AST ORIGINAL
        AST = parser.parse(CodeTxt.toString());
        //Salida de Traduccion
        TraduccionTxt=Traducir(JSON.parse(JSON.stringify(AST.AST)));
        Viewer.setValue(TraduccionTxt)
        AST.AST=ReturnAST()
        console.log(JSON.stringify(AST,null,2));
    } 
    catch (e) {
        console.error(e.message);
    }
    finally{
        ASTData=AST.AST
        refreshErrores()
    }
}
export function execute(){
    try{

    if(AST===undefined){
        AST = parser.parse(CodeTxt.toString());
        //Se comprueba por funciones anidadas
        Traducir(JSON.parse(JSON.stringify(AST.AST)));
        let aux = ReturnAST();
        if(!(_.isEqual(JSON.parse(JSON.stringify(AST.AST)),JSON.parse(JSON.stringify(aux))))){
            Console.setValue("[ERROR]: Hay funciones anidadas :o")
            throw Error("Funciones anidadas")
        }
        else{
            Ejecutar(aux)
        }
        
    }
    else{
        Ejecutar(AST.AST)
    }   
    }
    catch(e){
        console.error(e);
    }
    finally{
        ASTData=AST.AST
        AST=undefined
        refreshErrores()
    }
}

function refreshErrores(){
    
    document.getElementById("Lexicos").innerHTML=""
    document.getElementById("Sintacticos").innerHTML=""
    if(AST!==undefined){
        if(AST.ErroresLexicos.length>0){
            setErrorLexico(AST.ErroresLexicos)
        }   
    }
    if(ErroresSintacticos.length>0){
            setErrorSintactico(ErroresSintacticos)
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


