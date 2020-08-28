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
        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });
        if(simbolo.length===0){
            this.simbolos.push(crearSimbolo(id,tipo,valor,tipo2));
        }
        else{
            throw Error("No se puede declarar variable con ID: "+id+", por que ya existe")
        }
        
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
        simbolo=simbolo[0]
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
            TypeDecExecute(instruccion,TablaSimbolos);
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
        console.error(e)
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

function TypeDecExecute(instruccion,ts){
    //Se declara Type
    ts.nuevoSimbolo(instruccion.ID,undefined,instruccion.Attrib,"TYPE")
}


//FUNCIONES COMPLEMENTARIAS 


/**
 * Ejecuta un valor
 * @param {*} valor Valor a traducir
 */
function ejecutarValor(valor,ts){
    
    //Si es un arreglo
    if(Array.isArray(valor)){
        //Si es un arreglo de un type
        if(valor[0].ID!==undefined){
            //Se crea objeto
            return crearObjeto(valor,ts)
        }
        else{
            //Se crea array
            return crearArray(valor,ts)
        }
        
    }
    //Si no hay operandos y no es un ID
    else if(valor.Valor!==undefined&&valor.Tipo!==Tipo_Valor.ID){      
        return valor
    }
    //Si no hay operandos y es un ID
    else if(valor.Valor!==undefined&&valor.Tipo===Tipo_Valor.ID){      
        return ts.getValor(valor.Valor)
    }
    //Si es un id para operacion de atributo o acceso array
    else if(valor.Tipo===undefined&&valor.OpTipo===undefined){
        return ts.getValor(valor).Valor
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

    OpIzq=ejecutarValor(valor.OpIzq,ts);
    if(valor.OpDer!==undefined){
    OpDer=ejecutarValor(valor.OpDer,ts)
    }
    
    switch(valor.OpTipo){

        case Tipo_Operacion.NEGACION:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER){
                return {Valor:-1*Number(OpIzq.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede hacer negativo un valot tipo "+OpIzq.Tipo)
            }
        case Tipo_Operacion.MULTIPLICACION:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)*Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede multiplicar "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.DIVISION:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER||OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)/Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede dividir "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.SUMA:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)+Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:OpIzq.Valor+Number(OpDer.Valor).toString(),Tipo:Tipo_Valor.STRING}
            }
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.STRING){
                return {Valor:Number(OpIzq.Valor).toString()+OpDer.Valor,Tipo:Tipo_Valor.STRING}
            }
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo===Tipo_Valor.STRING){
                return {Valor:OpIzq.Valor+OpDer.Valor,Tipo:Tipo_Valor.STRING}
            }
            else{
                throw new Error("No se puede sumar "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.RESTA:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)-Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede restar "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.MODULO:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)%Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede hacer modulo "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.POTENCIA:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)**Number(OpDer.Valor),Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede elevar "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.DECREMENTO:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)-1,Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede decrementar "+OpIzq.Tipo)
            }
        case Tipo_Operacion.INCREMENTO:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)+1,Tipo:Tipo_Valor.NUMBER}
            }
            else{
                throw new Error("No se puede incrementar "+OpIzq.Tipo)
            }
        case Tipo_Operacion.MAYOR_QUE:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)>Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede > "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.MENOR_QUE:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)<Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede < "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.MAYOR_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)>=Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede >= "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.MENOR_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)<=Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede <= "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.DOBLE_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)===Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede == "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.NO_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)!==Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede != "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.AND:
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN && OpDer.Tipo===Tipo_Valor.BOOLEAN){
                return {Valor:OpIzq.Valor && OpDer.Valor ,Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede && "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.OR:
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN && OpDer.Tipo===Tipo_Valor.BOOLEAN){
                return {Valor:OpIzq.Valor || OpDer.Valor ,Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("No se puede || "+OpIzq.Tipo+" con "+OpDer.Tipo)
            }
        case Tipo_Operacion.NOT:
            if(OpIzq.Tipo===Tipo_Valor.BOOLEAN){
                return {Valor:!OpIzq.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                throw new Error("Error con !")
            }
        case Tipo_Operacion.ATRIBUTO:
            //AQUI ME QUEDE
            if(Array.isArray(OpIzq.Valor)){
                if(OpDer.Tipo===Tipo_Valor.NUMBER){
                    return OpIzq.Valor[Number(OpDer.Valor)]
                }
                else{
                    throw Error("No se puede a array sin expresion numerica");
                }
            }
            else{
                throw Error("No se puede a array porque no existe");
            }
        case Tipo_Operacion.ACCESO_ARR:
            if(Array.isArray(OpIzq)){
                if(OpDer.Tipo===Tipo_Valor.NUMBER){
                    return OpIzq[Number(OpDer.Valor)]
                }
                else{
                    throw Error("No se puede a array sin expresion numerica");
                }
            }
            else if(Array.isArray(OpIzq.Valor)){
                if(OpDer.Tipo===Tipo_Valor.NUMBER){
                    return OpIzq.Valor[Number(OpDer.Valor)]
                }
                else{
                    throw Error("No se puede a array sin expresion numerica");
                }
            }
            else{
                throw Error("No se puede a array porque no existe");
            }
        default:
    }

}

/**
 * Crea un array a partir de la lista del arbol sintactico
 * @returns Objeto {Valor:[...],Tipo: *_ARR}
 * @param {*} valor 
 * @param {*} ts 
 */
function crearArray(valor,ts){
    let Temp={},aux
    Temp.Valor =[]
    
    //El tipo sera del tipo de primer elemento
    Temp.Tipo = ejecutarValor(valor[0].Valor,ts).Tipo

    valor.forEach((element, index, arr) => {
        aux=ejecutarValor(element.Valor,ts)
        if(aux.Tipo===Temp.Tipo){
            Temp.Valor.push(aux)
        }
        else{
            throw Error("Array tipo "+Temp.Tipo+" no puede almacenar "+aux.Tipo)
        }
        
    });

    Temp.Tipo+="_ARR"

    return Temp

}

/**
 * Crea un objeto definido por la lista de atributos
 * @returns Objeto {attrib1:...,attrib2: ...,....}
 * @param {*} valor 
 * @param {*} ts 
 */
function crearObjeto(valor,ts){
    //Objeto temporal
    let Temp={}

    //Arreglo de todos los types
    let typesArr=_.filter(ts.getsimbolos(),function(simb) {
        return simb.Tipo2==="TYPE";
    });

    //Arreglo auxiliar para comparar con types
    let auxArr=[]

    valor.forEach((element, index, arr) => {
        auxArr.push({ID:element.ID,Tipo:ejecutarValor(element.Valor,ts).Tipo})
        Temp[element.ID]=ejecutarValor(element.Valor,ts)
    });

    typesArr.forEach((element, index, arr) => {       
        if(_(element.Valor).differenceWith(auxArr, _.isEqual).isEmpty()){
            Temp = {Valor:Temp,Tipo:element.ID}
        }
    });

    if(Temp.Tipo!==undefined){
        return Temp
    }
    else{
        throw Error("El type que se desea declarar no existe")
    }

}
