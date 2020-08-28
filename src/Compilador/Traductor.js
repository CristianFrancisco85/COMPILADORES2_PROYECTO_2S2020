import { Tipo_Instruccion } from './Instrucciones.js';
import { Tipo_Operacion } from './Instrucciones.js';
import { Tipo_Valor } from './Instrucciones.js';


const _ = require('lodash')


//AST modificado que se regresara si hay funciones anidadas
let AST;
//Booleano que nos dice si hay funciones anidadas
let BanderaFun
//Arreglo de funciones desanidadas
let Funciones

export function Traducir (Instrucciones){
    BanderaFun=false
    Funciones=[]
    AST=Instrucciones;
    let Code=TraducirBloque(AST)
    if(BanderaFun){
        Funciones.forEach(element => {
            if(element.length!==0){
                element.forEach(element2 => {
                    AST.push(element2)
                });
            }
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

function TraducirBloque(Instrucciones,PuntoComa){
    //Cadena que guarda el codigo traducido
    let Code="";

    Instrucciones.forEach(instruccion => {

    try{

        if(instruccion===undefined){
            throw Error("Intruccion Invalida")
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_LET){
            if(PuntoComa!==undefined){
                Code+=LetDecToString(instruccion);
            }
            else{
                Code+=LetDecToString(instruccion)+";\n";
            }
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_CONST){
            Code+=ConstDecToString(instruccion)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE){
            Code+=TypeDecToString(instruccion)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION){
            if(PuntoComa!==undefined){
                Code+=AsigToString(instruccion);
            }
            else{
                Code+=AsigToString(instruccion)+";\n";
            }
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION_ARR){
            Code+=AsigArrToString(instruccion)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
            Code+=CallFunToString(instruccion)+";\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.SALIDA){
            Code+="console.log("+traducirValor(instruccion.Valor)+");\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_IF){
            Code+=IfToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
            Code+=TernarioToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_WHILE){
            Code+=WhileToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_DO_WHILE){
            Code+=DoWhileToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR){
            Code+=ForToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_OF){
            Code+=ForOfToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_IN){
            Code+=ForInToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_SWITCH){
            Code+=SwitchToString(instruccion)+"\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION){
            Code+=FunToString(instruccion);
        }
        //----
        else if(instruccion.Tipo===Tipo_Instruccion.GRAFICAR){
            Code+="graficar_ts();\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.CONTINUE){
            Code+="continue;\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BREAK){
            Code+="break;\n";
        }
        else if(instruccion.Tipo===Tipo_Instruccion.RETURN){
            Code+="return ";
            if(instruccion.Valor!==undefined){Code+=traducirValor(instruccion.Valor)}
            Code+=";\n"
        }
        else{
            Code+=traducirValor(instruccion)+";\n"
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
function LetDecToString(instruccion){
    let TempTxt;
    TempTxt= "let "
    instruccion.ID.forEach((element, index, arr) => {

        TempTxt+= element.ID;
        if(element.Tipo===undefined){}else{TempTxt+=":"+traducirTipo(element.Tipo);}
        if(element.Valor===undefined){}else{TempTxt+="="+traducirValor(element.Valor);}

        if(arr[index+1]===undefined){}else{TempTxt+=","}
    });
    return TempTxt
}

/**
 * Traduce una sentencia de declacion de const
 * @param {*} instruccion 
 */
function ConstDecToString(instruccion){
    let TempTxt;
    TempTxt= "const "
    instruccion.ID.forEach((element, index, arr) => {

        TempTxt+= element.ID;
        if(element.Tipo===undefined){}else{TempTxt+=":"+traducirTipo(element.Tipo);}
        if(element.Valor===undefined){}else{TempTxt+="="+traducirValor(element.Valor);}

        if(arr[index+1]===undefined){}else{TempTxt+=","}
    });
    return TempTxt
}

/**
 * Traduce una sentencia de declaracion de type
 * @param {*} instruccion 
 */
function TypeDecToString(instruccion){
    let TempTxt;
    TempTxt= "type "
    TempTxt+= instruccion.ID;
    TempTxt+="="+traducirAttrib(instruccion.Attrib);
 
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
 * Traduce la asignacion de un posicion de un array
 * @param {*} instruccion 
 */
function AsigArrToString(instruccion){
    let TempTxt="";
    TempTxt+=instruccion.ID+"=["+traducirValor(instruccion.Posicion)+"]"
    if(instruccion.Posicion2!==undefined){TempTxt+="["+traducirValor(instruccion.Posicion2)+"]"}
    TempTxt+="="+traducirValor(instruccion.Valor)

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
function IfToString(instruccion){   
    let TempTxt="if("
    
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+"){\n"
    if(instruccion.InstruccionesIf!==undefined){TempTxt+=TraducirBloque(instruccion.InstruccionesIf)}
    TempTxt+="}\nelse{\n"
    if(instruccion.InstruccionesElse!==undefined){TempTxt+=TraducirBloque(instruccion.InstruccionesElse)}
    TempTxt+="}"
    return TempTxt
}

/**
 * Traduce un bloque Ternario
 * @param {*} instruccion 
 */
function TernarioToString(instruccion){   
    let TempTxt=""
    
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+"?"
    if(instruccion.InstruccionesIf!==undefined){TempTxt+=TraducirBloque(instruccion.InstruccionesIf,false)}
    TempTxt+=":"
    if(instruccion.InstruccionesElse!==undefined){TempTxt+=TraducirBloque(instruccion.InstruccionesElse,false)}
    TempTxt+=";"
    return TempTxt
}

/**
 * Traduce un bloque While
 * @param {*} instruccion 
 */
function WhileToString(instruccion){   
    let TempTxt="while("
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+"){\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones)}
    TempTxt+="}"
    return TempTxt
}

/**
 * Traduce un bloque Do-While
 * @param {*} instruccion 
 */
function DoWhileToString(instruccion){   
    let TempTxt="do{\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones)}
    TempTxt+="\n}while("+traducirValor(instruccion.ExpresionLogica)+")"
    return TempTxt
}

/**
 * Traduce un bloque For
 * @param {*} instruccion 
 */
function ForToString(instruccion){
    let TempTxt=""
    TempTxt+="for("
    TempTxt+=TraducirBloque([instruccion.OperacionInicial],false)+";"
    TempTxt+=traducirValor(instruccion.ExpresionLogica)+";"
    TempTxt+=traducirValor(instruccion.ExpresionPaso)+"){\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones)}
    TempTxt+="\n}"
    return TempTxt  
}

/**
 * Traduce un bloque For-Of
 * @param {*} instruccion 
 */
function ForOfToString(instruccion){
    let TempTxt="for(";
    TempTxt+=TraducirBloque([instruccion.AuxVar],false)
    TempTxt+=" of "+traducirValor(instruccion.Var)+"){\n"
    TempTxt+=TraducirBloque(instruccion.Instrucciones)
    TempTxt+="}\n"
    return TempTxt
}

/**
 * Traduce un bloque For-In
 * @param {*} instruccion 
 */
function ForInToString(instruccion){
    let TempTxt="for(";
    TempTxt+=TraducirBloque([instruccion.AuxVar],false)
    TempTxt+=" in "+traducirValor(instruccion.Var)+"){\n"
    TempTxt+=TraducirBloque(instruccion.Instrucciones)
    TempTxt+="}\n"
    return TempTxt
}

/**
 * Traduce un bloque switch
 * @param {*} instruccion 
 */
function SwitchToString(instruccion){
    let TempTxt="";
    TempTxt+="switch("+traducirValor(instruccion.Expresion)+"){\n"
    TempTxt+=traducirCasos(instruccion.Casos);
    TempTxt+="}"
    return TempTxt
}

/**
 * Se traduce una funcion y se realiza desanidado de funciones
 * @param {*} instruccion 
 */
function FunToString(instruccion){
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
    TempTxt+="):"+traducirTipo(instruccion.TipoRetorno)+"{\n"
    if(instruccion.Instrucciones!==undefined){TempTxt+=TraducirBloque(instruccion.Instrucciones)}
    TempTxt+="}\n"

    /*Para cada funcion anidada se establece un atributo heredado 
    para funcion padre luego se traduce*/
    if(TempFunciones.length!==0){
        BanderaFun=true;
        TempFunciones.forEach(element => {
            element.Padre=instruccion.ID
            element.ID=instruccion.ID+"_"+element.ID
            TempTxt+=FunToString(element)
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
function traducirArray(array){
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
function traducirAttrib(array){
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
function traducirCasos(array){
    let TempTxt="";
    array.forEach((element, index, arr) => {
        if(element.Tipo===Tipo_Instruccion.CASO_SWITCH){
            TempTxt+="case "+traducirValor(element.CasoExpresion)+":{\n";
        }
        else{
            TempTxt+="default :{\n";
        }
        TempTxt+=TraducirBloque(element.Instrucciones)
        TempTxt+="}\n"
    });
    return TempTxt;
}



