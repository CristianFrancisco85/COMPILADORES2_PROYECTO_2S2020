import { Tipo_Instruccion } from './Instrucciones.js';
import { Tipo_Operacion } from './Instrucciones.js';
import { Tipo_Valor } from './Instrucciones.js';
import { Console } from '../scripts/mainScript.js';

const _ = require('lodash')


/**
 * Crea un símbolo en la tabla
 * @param id ID del simbolo
 * @param tipo Tipo de Dato
 * @param valor Valor del simbolo
 * @param tipo2 Let o Const
 */
function crearSimbolo(id,tipo,valor,tipo2) {
    return {
        ID: id,
        Tipo: tipo,
        Valor: valor,
        Tipo2:tipo2
    }
}

class TablaSimbolos {

    /**
     * El constructor recibe una tabla la simbolos de su ambito.
     * @param {*} simbolos 
     */
    constructor (simbolos) {
        this.simbolos = simbolos;
    }

    /**
     * Crea un símbolo en la tabla
     * @param id ID del simbolo
     * @param tipo Tipo de Dato
     * @param valor Valor del simbolo
     * @param tipo2 Let o Const
     */
    nuevoSimbolo(id,tipo,valor,tipo2) {
        this.simbolos.push(crearSimbolo(id,tipo,valor,tipo2));
    }

    /**
     * Actualiza el valor de un simbolo
     * @param id ID del simbolo a actualizar
     * @param valor Objeto {Valor:..,Tipo:..}
     */
    actualizar(id, valor) {

        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });
        simbolo=simbolo[0]
        if (simbolo!==undefined) {
            if(simbolo.Tipo===valor.Tipo||simbolo.Tipo===undefined){

                simbolo.Valor=valor.Valor
                simbolo.Tipo=valor.Tipo
                
            }else{
                throw new Error("Error Semantico : variable " + id + " es de tipo " +simbolo.Tipo +" no se le puede asignar un "+valor.Tipo)
            }
        }
        else {
            throw new Error("Error : variable " + id + " no ha sido definida")
        }
    }

    /**
     * Obtiene el valor de un símbolo
     * @param id 
     */
    getValor(id) {

        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });

        if (simbolo){
            return simbolo
        }
        throw new Error ("Error ; variable " + id + " no ha sido definida")
    }

    /**
     * Funcion  para obtener los símbolos.
     */
    getsimbolos() {
        return this.simbolos;
    }
}

export function Ejecutar(ast){
    //Tabla de simbolos Global
    let Global = new TablaSimbolos([])
    EjecutarBloque(ast,Global)
    console.log(Global.getsimbolos());

}

function EjecutarBloque(Instrucciones,TablaSimbolos){

    Instrucciones.forEach(instruccion => {

    try{

        if(instruccion===undefined){
            throw new Error("Intruccion Invalida")
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_LET){
            LetDecExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_CONST){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION_ARR){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.SALIDA){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_IF){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_WHILE){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_DO_WHILE){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_OF){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_IN){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_SWITCH){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.GRAFICAR){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.CONTINUE){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BREAK){
            
        }
        else if(instruccion.Tipo===Tipo_Instruccion.RETURN){
            
        }
        else{
            
        }

    }
    catch(e){
        console.error(e.message)
    }
        
    });

}

/**
 * Traduce una sentencia de declaracion de let
 * @param {*} instruccion 
 */
function LetDecExecute(instruccion,ts){

    instruccion.ID.forEach((element, index, arr) => {

        //Se declara
        ts.nuevoSimbolo(element.ID,element.Tipo,undefined,"LET")
        //Se asigna si fuera el caso
        if(element.Valor!==undefined){
            ts.actualizar(element.ID,ejecutarValor(element.Valor,ts))
        }

    });
    
}


//FUNCIONES COMPLEMENTARIAS 


/**
 * Ejecuta un valor
 * @param {*} valor Valor a traducir
 */
function ejecutarValor(valor,ts){
    
    //Si no hay operandos
    if(valor.Valor!==undefined){      
        return valor
    }
    //Si es un arreglo
    else if(Array.isArray(valor.Valor)){
        //FALTA
    }
    //Si es llamada de una funcion
    else if(valor.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
        //FALTA
    }
    //Si hay una operacion
    else if(valor.OpTipo!==undefined){
        return ejecutarOperacionBinaria(valor,ts);
    }
    else{
        throw new Error("Error en valor")
    }

}



/**
 * Se ejecuta una operacion binaria
 * @param {*} valor Expresion a traducir
 */
function ejecutarOperacionBinaria(valor,ts){
    let OpIzq,OpDer

    OpIzq=ejecutarValor(valor.OpIzq);
    if(valor.OpDer!==undefined){
    OpDer=ejecutarValor(valor.OpDer)
    }
    
    switch(valor.OpTipo){

        case Tipo_Operacion.NEGACION:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER){
                return {Valor:-1*Number(OpIzq.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con -1")
            }
        case Tipo_Operacion.MULTIPLICACION:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)*Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con *")
            }
        case Tipo_Operacion.DIVISION:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)/Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con /")
            }
        case Tipo_Operacion.SUMA:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)+Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con +")
            }
        case Tipo_Operacion.RESTA:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)-Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con -")
            }
        case Tipo_Operacion.MODULO:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)%Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con %")
            }
        case Tipo_Operacion.POTENCIA:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)**Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con **")
            }
        case Tipo_Operacion.DECREMENTO:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)-1,Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con --")
            }
        case Tipo_Operacion.INCREMENTO:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)+1,Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("Error con ++")
            }
        case Tipo_Operacion.MAYOR_QUE:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)>Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con >")
            }
        case Tipo_Operacion.MENOR_QUE:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)<Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con <")
            }
        case Tipo_Operacion.MAYOR_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)>=Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con >=")
            }
        case Tipo_Operacion.MENOR_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)<=Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con <=")
            }
        case Tipo_Operacion.DOBLE_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)===Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con ==")
            }
        case Tipo_Operacion.NO_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)!==Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con !=")
            }
        case Tipo_Operacion.AND:
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN||OpDer.Tipo===Tipo_Valor.BOOLEAN){
                return {Valor:OpIzq.Valor && OpDer.Valor ,Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con &&")
            }
        case Tipo_Operacion.OR:
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN||OpDer.Tipo===Tipo_Valor.BOOLEAN){
                return {Valor:OpIzq.Valor || OpDer.Valor ,Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con ==")
            }
        case Tipo_Operacion.NOT:
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN){
                return {Valor:!OpIzq.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con !")
            }
        case Tipo_Operacion.ATRIBUTO:
            return ejecutarValor(valor.OpIzq)+"."+ejecutarValor(valor.OpDer)
        case Tipo_Operacion.ACCESO_ARR:
            return ejecutarValor(ejecutarValor(valor.OpIzq)[ejecutarValor(valor.OpDer)])
        default:
    }

}
