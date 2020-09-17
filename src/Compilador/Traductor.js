import { Tipo_Instruccion } from './Instrucciones.js';
import { Tipo_Operacion } from './Instrucciones.js';
import { Tipo_Valor } from './Instrucciones.js';
import {Simbolos, CodeTxt} from '../scripts/mainScript.js'

const _ = require('lodash')


//AST modificado que se regresara si hay funciones anidadas
let AST;
//Booleano que nos dice si hay funciones anidadas
let BanderaFun
//Arreglo de funciones desanidadas
let Funciones
//Arreglo para reemplazar llamadas de funciones
let FuncionesReplace

/**
 * Crea un símbolo en la tabla
 * @param id ID del simbolo
 * @param tipo Tipo de Dato
 * @param valor Valor del simbolo
 * @param tipo2 Let o Const
 */
function crearSimbolo(id,tipo,tipo2) {
    return {
        ID: id,
        Tipo: tipo,
        Tipo2:tipo2
    }
}

class TablaSimbolos {

    /**
     * El constructor recibe una tabla la simbolos de su ambito.
     * @param {*} simbolos 
     */
    constructor (simbolos) {
        this.simbolos=[]
        simbolos.forEach(element => {
            this.simbolos.push(element)
        });
    }

    /**
     * Crea un símbolo en la tabla
     * @param id ID del simbolo
     * @param tipo Tipo de Dato
     * @param valor Valor del simbolo
     * @param tipo2 Let o Const
     */
    nuevoSimbolo(id,tipo,tipo2) {
        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });
        if(simbolo.length===0){
            this.simbolos.push(crearSimbolo(id,tipo,tipo2));
        }
        else{
            throw Error("No se puede declarar variable con ID: "+id+", por que ya existe")
        }
        
    }

    /**
     * Funcion  para obtener los símbolos.
     */
    getsimbolos() {
        return this.simbolos;
    }
}

export function Traducir (Instrucciones){
    BanderaFun=false
    Funciones=[]
    FuncionesReplace=[]
    let Global = new TablaSimbolos([])
    AST=Instrucciones;
    let Code=TraducirBloque(AST,undefined,Global)
    if(BanderaFun){
        Funciones.forEach(element => {
            if(element.length!==0){
                element.forEach(element2 => {
                    AST.push(element2)
                });
            }
        });
        FuncionesReplace.forEach(element => {
            Code =Code.replaceAll(element.ID1,element.ID2);
        });
        console.log(AST)
    }
    Funciones=[]
    BanderaFun=false
    return Code
}

export function ReturnAST(){
    return AST
}

function TraducirBloque(Instrucciones,PuntoComa,TS){
    //Cadena que guarda el codigo traducido
    let Code="";

    Instrucciones.forEach(instruccion => {

    try{

        if(instruccion===undefined){
            throw Error("Intruccion Invalida")
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_LET){
            if(PuntoComa!==undefined){
                Code+=LetDecToString(instruccion,TS);
            }
            else{
                Code+=LetDecToString(instruccion,TS)+";\n";
            }
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_CONST){
            Code+=ConstDecToString(instruccion,TS)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE){
            Code+=TypeDecToString(instruccion,TS)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION){
            if(PuntoComa!==undefined){
                Code+=AsigToString(instruccion);
            }
            else{
                Code+=AsigToString(instruccion)+";\n";
            }
        }
        else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION){
            if(PuntoComa!==undefined){
                Code+=MasAsigToString(instruccion);
            }
            else{
                Code+=MasAsigToString(instruccion)+";\n";
            }
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION_ARR){
            Code+=AsigArrToString(instruccion)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION_ARR){
            Code+=MasAsigArrToString(instruccion,TS)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
            Code+=CallFunToString(instruccion)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.SALIDA){
            Code+="console.log("+traducirValor(instruccion.Valor)+");\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_IF){
            Code+=IfToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
            Code+=TernarioToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_WHILE){
            Code+=WhileToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_DO_WHILE){
            Code+=DoWhileToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR){
            Code+=ForToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_OF){
            Code+=ForOfToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_IN){
            Code+=ForInToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_SWITCH){
            Code+=SwitchToString(instruccion,TS)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION){
            Code+=FunToString(instruccion,TS);
        }
        else if(instruccion.Tipo===Tipo_Instruccion.GRAFICAR){
            Code+="graficar_ts();\n";
            Simbolos.push(TS.simbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.CONTINUE){
            Code+="continue;\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BREAK){
            Code+="break;\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.RETURN){
            Code+="return ";
            if(instruccion.Valor!==undefined){
                Code+=traducirValor(instruccion.Valor)
            }
            Code+=";\n"
        }
        else{
            Code+=traducirValor(instruccion,TS)+";\n"
        }
    }
    catch(e){
        console.error(e.message)
    }
        
    });

    return Code;
}

//TRADUCCIONES DE ASIGNACIONES Y DECLARACIONES

/**
 * Traduce una sentencia de declaracion de let
 * @param {*} instruccion 
 */
function LetDecToString(instruccion,TS){
    let TempTxt;
    TempTxt= "let "
    instruccion.ID.forEach((element, index, arr) => {

        TempTxt+= element.ID;
        if(element.Tipo===undefined){}else{TempTxt+=":"+traducirTipo(element.Tipo);}
        if(element.Valor===undefined){}else{TempTxt+="="+traducirValor(element.Valor);}
        TS.nuevoSimbolo(element.ID,element.Tipo,"LET")
        if(arr[index+1]===undefined){}else{TempTxt+=","}
    });
    return TempTxt
}

/**
 * Traduce una sentencia de declacion de const
 * @param {*} instruccion 
 */
function ConstDecToString(instruccion,TS){
    let TempTxt;
    TempTxt= "const "
    instruccion.ID.forEach((element, index, arr) => {

        TempTxt+= element.ID;
        if(element.Tipo===undefined){}else{TempTxt+=":"+traducirTipo(element.Tipo);}
        if(element.Valor===undefined){}else{TempTxt+="="+traducirValor(element.Valor);}
        TS.nuevoSimbolo(element.ID,element.Tipo,"CONST")
        if(arr[index+1]===undefined){}else{TempTxt+=","}
    });
    return TempTxt
}

/**
 * Traduce una sentencia de declaracion de type
 * @param {*} instruccion 
 */
function TypeDecToString(instruccion,TS){
    let TempTxt;
    TempTxt= "type "
    TempTxt+= instruccion.ID;
    TempTxt+="="+traducirAttrib(instruccion.Attrib);
    TS.nuevoSimbolo(instruccion.ID,undefined,"TYPE")
    return TempTxt
}

/**
 * Traduce una asignacion
 * @param {*} instruccion 
 */
function AsigToString(instruccion){
    let TempTxt="";
    if(typeof instruccion.ID ==="string"){
        TempTxt+=instruccion.ID
    }
    else{
        TempTxt+=traducirValor(instruccion.ID)
    }
    TempTxt+="="+traducirValor(instruccion.Valor)

    return TempTxt
}

/**
 * Traduce una asignacion
 * @param {*} instruccion 
 */
function MasAsigToString(instruccion){
    let TempTxt="";
    if(typeof instruccion.ID ==="string"){
        TempTxt+=instruccion.ID
    }
    else{
        TempTxt+=traducirValor(instruccion.ID)
    }
    TempTxt+="+="+traducirValor(instruccion.Valor)

    return TempTxt
}

/**
 * Traduce la asignacion de un posicion de un array
 * @param {*} instruccion 
 */
function AsigArrToString(instruccion){
    let TempTxt="";
    TempTxt+=instruccion.ID+"["+traducirValor(instruccion.Posicion)+"]"
    if(instruccion.Posicion2!==undefined){TempTxt+="["+traducirValor(instruccion.Posicion2)+"]"}
    TempTxt+="="+traducirValor(instruccion.Valor)

    return TempTxt
}

/**
 * Traduce la asignacion de un posicion de un array
 * @param {*} instruccion 
 */
function MasAsigArrToString(instruccion){
    let TempTxt="";
    TempTxt+=instruccion.ID+"["+traducirValor(instruccion.Posicion)+"]"
    if(instruccion.Posicion2!==undefined){TempTxt+="["+traducirValor(instruccion.Posicion2)+"]"}
    TempTxt+="+="+traducirValor(instruccion.Valor)

    return TempTxt
}

/**
 * Traduce una llamada de una funcion
 * @param {*} instruccion 
 */
function CallFunToString(instruccion){
    let TempTxt=""
    TempTxt+=instruccion.ID+"("
    if(instruccion.Params!==undefined){
        TempTxt+=traducirParams(instruccion.Params)
    }
    TempTxt+=")"
    return TempTxt;
}

/**
 * Traduce un bloque If-Else
 * @param {*} instruccion 
 */
function IfToString(instruccion,TS){   
    let TempTxt="if("
    let newTS=new TablaSimbolos(TS.simbolos)
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+"){\n"
    if(instruccion.InstruccionesIf!==undefined){TempTxt+=TraducirBloque(instruccion.InstruccionesIf,undefined,newTS)}
    TempTxt+="}\n"
    if(instruccion.InstruccionesElse!==undefined){
        TempTxt+="else{\n"
        TempTxt+=TraducirBloque(instruccion.InstruccionesElse,undefined,newTS)
        TempTxt+="}"
    }
    return TempTxt
}

/**
 * Traduce un bloque Ternario
 * @param {*} instruccion 
 */
function TernarioToString(instruccion,TS){   
    let TempTxt=""
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+"?"
    if(instruccion.InstruccionesIf!==undefined){TempTxt+=traducirValor(instruccion.InstruccionesIf)}
    TempTxt+=":"
    if(instruccion.InstruccionesElse!==undefined){TempTxt+=traducirValor(instruccion.InstruccionesElse)}
    return TempTxt
}

/**
 * Traduce un bloque While
 * @param {*} instruccion 
 */
function WhileToString(instruccion,TS){ 
    let newTS=new TablaSimbolos(TS.simbolos)  
    let TempTxt="while("
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+"){\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones,undefined,newTS)}
    TempTxt+="}"
    return TempTxt
}

/**
 * Traduce un bloque Do-While
 * @param {*} instruccion 
 */
function DoWhileToString(instruccion,TS){   
    let newTS=new TablaSimbolos(TS.simbolos)
    let TempTxt="do{\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones,undefined,newTS)}
    TempTxt+="\n}while("+traducirValor(instruccion.ExpresionLogica)+")"
    return TempTxt
}

/**
 * Traduce un bloque For
 * @param {*} instruccion 
 */
function ForToString(instruccion,TS){
    let newTS=new TablaSimbolos(TS.simbolos)
    let TempTxt=""
    TempTxt+="for("
    TempTxt+=TraducirBloque([instruccion.OperacionInicial],false,newTS)+";"
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+";"
    TempTxt+=traducirValor(instruccion.ExpresionPaso)+"){\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones,undefined,newTS)}
    TempTxt+="\n}"
    return TempTxt  
}

/**
 * Traduce un bloque For-Of
 * @param {*} instruccion 
 */
function ForOfToString(instruccion,TS){
    let newTS=new TablaSimbolos(TS.simbolos)
    let TempTxt="for(";
    TempTxt+=TraducirBloque([instruccion.AuxVar],false,newTS)
    TempTxt+=" of "+traducirValor(instruccion.Var)+"){\n"
    TempTxt+=TraducirBloque(instruccion.Instrucciones,undefined,newTS)
    TempTxt+="}\n"
    return TempTxt
}

/**
 * Traduce un bloque For-In
 * @param {*} instruccion 
 */
function ForInToString(instruccion,TS){
    let newTS=new TablaSimbolos(TS.simbolos)
    let TempTxt="for(";
    TempTxt+=TraducirBloque([instruccion.AuxVar],false,newTS)
    TempTxt+=" in "+traducirValor(instruccion.Var)+"){\n"
    TempTxt+=TraducirBloque(instruccion.Instrucciones,undefined,newTS)
    TempTxt+="}\n"
    return TempTxt
}

/**
 * Traduce un bloque switch
 * @param {*} instruccion 
 */
function SwitchToString(instruccion,TS){
    let newTS=new TablaSimbolos(TS.simbolos)
    let TempTxt="";
    TempTxt+="switch("+traducirValor(instruccion.Expresion)+"){\n"
    TempTxt+=traducirCasos(instruccion.Casos,newTS);
    TempTxt+="}"
    return TempTxt
}

/**
 * Se traduce una funcion y se realiza desanidado de funciones
 * @param {*} instruccion 
 */
function FunToString(instruccion,TS){
    let newTS=new TablaSimbolos(TS.simbolos)
    let TempTxt="";
    let TempFunciones=[]
    //Se extraen funciones anidadas
    TempFunciones=_.filter(instruccion.Instrucciones,function(ins) {
        return ins.Tipo===Tipo_Instruccion.DECL_FUNCION;
    });
    Funciones.push(TempFunciones)
    //Luego se eliminan
    _.remove(instruccion.Instrucciones,function(ins) {
        return ins.Tipo===Tipo_Instruccion.DECL_FUNCION;
    });
    //Se traduce funcion sin funciones anidadas
    TempTxt+="function "+instruccion.ID+"("
    if(instruccion.Parametros!==undefined){
        instruccion.Parametros.forEach((element, index, arr) => {
            TempTxt+= element.ID;
            if(element.Tipo===undefined){}else{TempTxt+=":"+traducirTipo(element.Tipo);}
            if(arr[index+1]===undefined){}else{TempTxt+=","}
        });
    }   
    TS.nuevoSimbolo(instruccion.ID,traducirTipo(instruccion.TipoRetorno),"FUNCTION")
    TempTxt+="):"+traducirTipo(instruccion.TipoRetorno)+"{\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones,undefined,newTS)}
    TempTxt+="}\n"

    /*Para cada funcion anidada se establece un atributo heredado 
    para funcion padre luego se traduce*/
    if(TempFunciones.length!==0){
        BanderaFun=true;
        TempFunciones.forEach(element => {
            element.Padre=instruccion.ID
            FuncionesReplace.push({ID1:element.ID,ID2:instruccion.ID+"_"+element.ID})
            //element.ID=instruccion.ID+"_"+element.ID
            TempTxt+=FunToString(element,newTS)
        });
    }   

    return TempTxt;

}

//FUNCIONES COMPLEMENTARIAS

function traducirTipo(tipo){
    switch (tipo){
        case Tipo_Valor.NUMBER:
            return "number";
        case Tipo_Valor.BOOLEAN:
            return "boolean";
        case Tipo_Valor.STRING:
            return "string";
        case Tipo_Valor.VOID:
            return "void";
        case Tipo_Valor.NUMBER_ARR:
            return "number[]";
        case Tipo_Valor.BOOLEAN_ARR:
            return "boolean[]";
        case Tipo_Valor.STRING_ARR:
            return "string[]";
        case Tipo_Valor.VOID_ARR:
            return "void[]";
        case Tipo_Valor.NUMBER_ARR_ARR:
            return "number[][]";
        case Tipo_Valor.BOOLEAN_ARR_ARR:
            return "boolean[][]";
        case Tipo_Valor.STRING_ARR_ARR:
            return "string[][]";
        case Tipo_Valor.VOID_ARR_ARR:
            return "void[][]";
        case Tipo_Valor.NULL:
            return "null";
        default:
            if(tipo.substring(tipo.length-4,tipo.length)==="_ARR"){
                return tipo.substring(0,tipo.length-4)+"[]"
            }
            else if(tipo.substring(tipo.length-8,tipo.length)==="_ARR_ARR"){
                return tipo.substring(0,tipo.length-8)+"[][]"
            }
            else{
                return tipo
            }
    }

}

/**
 * 
 * @param {*} valor Valor a traducir
 */
function traducirValor(valor){
    if(valor.Valor!==undefined){
        if(valor.Tipo===Tipo_Valor.STRING){
            return "\""+valor.Valor+"\""
        }
        else{
            return valor.Valor;
        }
    }
    else if(Array.isArray(valor)){

        if(valor.length===0){
            return "[]"
        }
        else if(valor[0].ID===undefined){
            return traducirArray(valor);
        }
        else{
            return traducirAttrib(valor)
        }
        
    }
    else if(valor.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
        return CallFunToString(valor);
    }
    else if(valor.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
        return TernarioToString(valor) 
    }
    else if(valor.OpTipo!==undefined){
        return traducirOperacionBinaria(valor);
    }
    else{
        return valor;
    }
}

/**
 * Traduce una expresion a un string
 * Se incluyen parentesis para indicar la precedencia
 * @param {*} valor Expresion a traducir
 */
function traducirOperacionBinaria(valor){
    
    switch(valor.OpTipo){
        case Tipo_Operacion.NEGACION:
            return "(-"+traducirValor(valor.OpIzq)+")"
        case Tipo_Operacion.MULTIPLICACION:
            return "("+traducirValor(valor.OpIzq)+"*"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.DIVISION:
            return "("+traducirValor(valor.OpIzq)+"/"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.SUMA:
            return "("+traducirValor(valor.OpIzq)+"+"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.RESTA:
            return "("+traducirValor(valor.OpIzq)+"-"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.MODULO:
            return "("+traducirValor(valor.OpIzq)+"%"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.POTENCIA:
            return "("+traducirValor(valor.OpIzq)+"**"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.DECREMENTO:
            return ""+traducirValor(valor.OpIzq)+"--"
        case Tipo_Operacion.INCREMENTO:
            return ""+traducirValor(valor.OpIzq)+"++"
        case Tipo_Operacion.MAYOR_QUE:
            return "("+traducirValor(valor.OpIzq)+">"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.MENOR_QUE:
            return "("+traducirValor(valor.OpIzq)+"<"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.MAYOR_IGUAL:
            return "("+traducirValor(valor.OpIzq)+">="+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.MENOR_IGUAL:
            return "("+traducirValor(valor.OpIzq)+"<="+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.DOBLE_IGUAL:
            return "("+traducirValor(valor.OpIzq)+"=="+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.NO_IGUAL:
            return "("+traducirValor(valor.OpIzq)+"!="+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.AND:
            return "("+traducirValor(valor.OpIzq)+"&&"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.OR:
            return "("+traducirValor(valor.OpIzq)+"||"+traducirValor(valor.OpDer)+")"
        case Tipo_Operacion.NOT:
            return "!("+traducirValor(valor.OpIzq)+")"
        case Tipo_Operacion.ATRIBUTO:
            return traducirValor(valor.OpIzq)+"."+traducirValor(valor.OpDer)
        case Tipo_Operacion.ACCESO_ARR:
            return traducirValor(valor.OpIzq)+"["+traducirValor(valor.OpDer)+"]"
        default:
    }

}

/**
 * Traduce una lista de array 
 * @param {*} array 
 */
export function traducirArray(array){
    let TempTxt="[";
    array.forEach((element, index, arr) => {
        TempTxt+=traducirValor(element.Valor)
        if(arr[index+1]===undefined){}else{TempTxt+=","}
    });
    TempTxt+="]"
    return TempTxt;
}

/**
 * Traduce un array de atributos de un type
 * @param {*} array 
 */
export function traducirAttrib(array){
    let TempTxt="{";
    array.forEach((element, index, arr) => {
        TempTxt+=element.ID
        if(element.Valor!==undefined){
        TempTxt+=":"+traducirValor(element.Valor);
        }
        else{
            if(element.Tipo!==undefined){TempTxt+=":"+traducirTipo(element.Tipo);}
        }
        if(arr[index+1]===undefined){}else{TempTxt+=","}
    });
    TempTxt+="}"
    return TempTxt;
}

/**
 * Traduce una lista de parametros pasada a una funcion
 * @param {*} array 
 */
function traducirParams(array){
    let TempTxt="";
    array.forEach((element, index, arr) => {
        TempTxt+=traducirValor(element.Valor);
        if(arr[index+1]===undefined){}else{TempTxt+=","}
    });
    return TempTxt;
}

/**
 * Traduce una lista de casos de un Switch
 * @param {*} array 
 */
function traducirCasos(array,ts){
    let TempTxt="";
    array.forEach((element, index, arr) => {
        if(element.Tipo===Tipo_Instruccion.CASO_SWITCH){
            TempTxt+="case "+traducirValor(element.CasoExpresion)+":\n";
        }
        else{
            TempTxt+="default :\n";
        }
        TempTxt+=TraducirBloque(element.Instrucciones,undefined,ts)
        TempTxt+="\n"
    });
    return TempTxt;
}

