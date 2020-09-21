import { Tipo_Instruccion } from './Instrucciones.js';
import { Tipo_Operacion } from './Instrucciones.js';
import { Tipo_Valor } from './Instrucciones.js';
import { Console } from '../scripts/mainScript.js';
import {Simbolos2 as Simbolos} from '../scripts/mainScript.js'
import {traducirArray} from './Traductor.js'

const _ = require('lodash')


/**
 * Crea un símbolo en la tabla
 * @param id ID del simbolo
 * @param tipo Tipo de Dato
 * @param valor Valor del simbolo
 * @param tipo2 Let o Const
 */
function crearSimbolo(id,tipo,valor,tipo2,global,padre) {
    return {
        ID: id,
        Tipo: tipo,
        Valor: valor,
        Tipo2:tipo2,
        Global:global,
        Padre:padre
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
     * @param global Indica si es para un ambito global
     * @param padre Indica padre de una funcion
     */
    nuevoSimbolo(id,tipo,valor,tipo2,global,padre) {
        let simbolo = _.filter(this.simbolos,function(simb) {
            return simb.ID===id;
        });
        if(simbolo.length===0){
            this.simbolos.push(crearSimbolo(id,tipo,valor,tipo2,global,padre));
        }
        else if(simbolo[0].Global===true){
            _.remove(this.simbolos,function(simb) {
                return simb.ID===id;
            });
            this.simbolos.push(crearSimbolo(id,tipo,valor,tipo2,global));
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

        if(simbolo.Tipo2==="CONST"&&!simbolo.Tipo.includes("ARR")){    
            throw Error("No se puede cambiar el valor de la constante "+simbolo.ID)
        }

        if (simbolo!==undefined) {

            if(simbolo.Tipo===valor.Tipo||simbolo.Tipo===undefined||valor.Tipo===Tipo_Valor.NULL){
                simbolo.Valor=valor.Valor
                simbolo.Tipo=valor.Tipo
            }
            else if(simbolo.Tipo==="ARR"){
                if(valor.Tipo.includes("_ARR")){
                    simbolo.Valor=valor.Valor
                    simbolo.Tipo=valor.Tipo
                }
                else{
                    throw new Error("Error Semantico : variable " + id + " es de tipo " +simbolo.Tipo +" no se le puede asignar un "+valor.Tipo)
                }
            }
            else if(valor.Tipo==="ARR"){
                if(simbolo.Tipo.includes("_ARR")){
                    simbolo.Valor=valor.Valor
                }    
                else{
                    throw new Error("Error Semantico : variable " + id + " es de tipo " +simbolo.Tipo +" no se le puede asignar un "+valor.Tipo)
                }
            }
            else{
                throw new Error("Error Semantico : variable " + id + " es de tipo " +simbolo.Tipo +" no se le puede asignar un "+valor.Tipo)
            }

            if(simbolo.Tipo2==="CONST2"){
                simbolo.Tipo2="CONST"
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
        throw new Error ("Error : variable " + id + " no ha sido definida")
    }

    /**
     * Funcion  para obtener los símbolos.
     */
    getsimbolos() {
        return this.simbolos;
    }
}

let Global
export function Ejecutar(ast){
    //Tabla de simbolos Global
    Console.setValue("")
    Global=new TablaSimbolos([])
    BuscarDec(ast,Global)
    EjecutarBloque(ast,Global,true)
    console.log(Global.getsimbolos());

}

/**
 * Ejecuta un bloque dado
 * @param {*} Instrucciones 
 * @param {*} TablaSimbolos 
 * @param {*} Bool Indica si ignorar declaraciones o no
 */
function EjecutarBloque(Instrucciones,TablaSimbolos,Bool){

    Instrucciones.forEach(instruccion => {

    try{
        if(instruccion===undefined){
            //throw new Error("Intruccion Invalida")
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_LET&&Bool===undefined){
            LetDecExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_CONST&&Bool===undefined){
            ConstDecExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE&&Bool===undefined){
            TypeDecExecute(instruccion,TablaSimbolos);
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION){
            AsigExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION){
            MasAsigExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.ASIGNACION_ARR){
            ArrayAsigExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.MAS_ASIGNACION_ARR){
            ArrayMasAsigExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
            FunCallExecute(instruccion,TablaSimbolos,Global);
        }
        else if(instruccion.Tipo===Tipo_Instruccion.SALIDA){
            ConsoleExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_IF){
            IfExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
            TernarioExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_WHILE){
            WhileExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_DO_WHILE){
            DoWhileExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR){
            ForExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_OF){
            ForOfExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_FOR_IN){
            ForInExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BLOQUE_SWITCH){
            SwitchExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION&&Bool===undefined){
            FunDecExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.GRAFICAR){
            Simbolos.push(JSON.parse(JSON.stringify(TablaSimbolos.simbolos)))
        }
        else if(instruccion.Tipo===Tipo_Instruccion.CONTINUE){
            throw new Continue()
        }
        else if(instruccion.Tipo===Tipo_Instruccion.BREAK){
            throw new Break()
        }
        else if(instruccion.Tipo===Tipo_Instruccion.RETURN){
            if(instruccion.Valor!==undefined){
                throw new Return(ejecutarValor(instruccion.Valor,TablaSimbolos)) 
            }
            else{
                throw new Return(null)
            }
        }
        else if(instruccion.OpTipo===Tipo_Operacion.DECREMENTO||instruccion.OpTipo===Tipo_Operacion.INCREMENTO){
            IncDecExecute(instruccion,TablaSimbolos)
        }
        else if(instruccion.OpTipo===Tipo_Operacion.ATRIBUTO){
            ejecutarValor(instruccion,TablaSimbolos)
        }

    }
    catch(e){
        if(e instanceof Break || e instanceof Continue || e instanceof Return){
            throw e
        }
        Console.setValue(Console.getValue()+"[ERROR]:\t"+e.message+"\n")
        console.error(e)
    }
        
    });

}

/**
 * Hace la primera pasada para econtrar declaraciones
 * @param {*} Instrucciones 
 * @param {*} TablaSimbolos
 * @param {*} Global Indica si para un ambito global 
 */
function BuscarDec(Instrucciones,TablaSimbolos){
    Instrucciones.forEach(instruccion => {

    try{
        if(instruccion===undefined){
            //throw new Error("Intruccion Invalida")
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_LET){
            LetDecExecute(instruccion,TablaSimbolos,true)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_CONST){
            ConstDecExecute(instruccion,TablaSimbolos,true)
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECLARACION_TYPE){
            TypeDecExecute(instruccion,TablaSimbolos);
        }
        else if(instruccion.Tipo===Tipo_Instruccion.DECL_FUNCION){
            FunDecExecute(instruccion,TablaSimbolos)
        }
    }
    catch(e){
        console.error(e)
    }

    });
}

/**
 * Ejecuta una salida a consola
 * @param {*} instruccion 
 * @param {*} ts 
 */
function ConsoleExecute(instruccion,ts){
    Console.setValue(Console.getValue()+"[LOG]:\t"+ejecutarValor(instruccion.Valor,ts).Valor+"\n")
}

/**
 * Ejecuta la llamada de una funcion
 * @param {*} instruccion 
 * @param {*} ts 
 */
function FunCallExecute(instruccion,ts,Global){
    //Se obtiene funcion
    let fun = ejecutarValor(instruccion.ID,ts)
    //Se obtiene tipos de lista de parametros
    let aux=[]
    let aux2=[]
    let newTS= new TablaSimbolos(Global.simbolos)
    getAmbito(fun,newTS);
    let bool=false
    if(instruccion.Params!==undefined&&fun.Valor.Parametros!==undefined){
        instruccion.Params.forEach(element => {
            aux.push(ejecutarValor(element.Valor,ts).Tipo)
        });
        fun.Valor.Parametros.forEach(element => {
            aux2.push(element.Tipo)
        });
        //Se comparan 
        if(aux.length===aux2.length){
            for(let index in aux){
                if(aux[index]===aux2[index]||aux[index]===Tipo_Valor.NULL){
                    bool=true;
                }
                else{
                    bool=false
                    break
                }
            }
        }
    }else{bool=true}
    
    if(bool){
        if(fun.Valor.Parametros!==undefined){
            fun.Valor.Parametros.forEach((element,index) => {
                newTS.nuevoSimbolo(element.ID,element.Tipo,ejecutarValor(instruccion.Params[index].Valor,ts).Valor,"LET")
            });
        }
        try{
        Array.isArray(fun.Valor.Instrucciones)?EjecutarBloque(fun.Valor.Instrucciones,newTS):EjecutarBloque([fun.Valor.Instrucciones],newTS)
        }
        catch(e){
            if(e instanceof Return){
                
                if(e.Valor===null){
                    if(fun.Tipo==="VOID"){
                        return e.Valor
                    }
                    throw Error("Funcion "+fun.ID+" no puede retornar "+e.Valor)
                }
                else if(e.Valor.Tipo===fun.Tipo){
                    return e.Valor
                }
                else{
                    throw Error("Funcion "+fun.ID+" no puede retornar "+e.Valor.Tipo)
                }
            }
            else{throw e}
        }
    }
    else{
        throw Error("Error en parametros de llamada a "+fun.ID)
    }
}

//SENTENCIAS DE DECLARACION Y ASIGNACION

/**
 * Traduce una sentencia de declaracion de let
 * @param {*} instruccion 
 */
function LetDecExecute(instruccion,ts,global){

    instruccion.ID.forEach((element, index, arr) => {

        //Se declara
        if(global){
            ts.nuevoSimbolo(element.ID,element.Tipo,undefined,"LET",true)
        }
        else{
            ts.nuevoSimbolo(element.ID,element.Tipo,undefined,"LET")
        }
        //Se asigna si fuera el caso
        if(element.Valor!==undefined){
            ts.actualizar(element.ID,ejecutarValor(element.Valor,ts))
        }

    });
    
}

/**
 * Traduce una sentencia de declaracion de const
 * @param {*} instruccion 
 */
function ConstDecExecute(instruccion,ts){

    instruccion.ID.forEach((element, index, arr) => {

        //Se declara
        if(global){
            ts.nuevoSimbolo(element.ID,element.Tipo,undefined,"CONST2",true)
        }
        else{
            ts.nuevoSimbolo(element.ID,element.Tipo,undefined,"CONST2")
        }
        //Se asigna si fuera el caso
        if(element.Valor!==undefined){
            ts.actualizar(element.ID,JSON.parse(JSON.stringify(ejecutarValor(element.Valor,ts))))
        }
        else{
            throw Error("Se tiene que asignar un valor a la constante "+element.ID)
        }
        
    });
    
}

/**
 * Ejecuta la declaracion de un type
 * @param {*} instruccion 
 * @param {*} ts 
 */
function TypeDecExecute(instruccion,ts){
    //Se declara Type
    ts.nuevoSimbolo(instruccion.ID,undefined,instruccion.Attrib,"TYPE")
}

/**
 * Ejecuta una sentencia de asignacion
 * @param {*} instruccion 
 * @param {*} ts 
 */
function AsigExecute(instruccion,ts){
    
    //Se obtiene referencia del valor a asignar
    let aux = ejecutarValor(instruccion.ID,ts)
    if(aux.Tipo2==="CONST"){
        throw Error("No se puede asignar constante "+aux.ID)
    }
    //Se obtiene valor a asignar
    let aux2 = ejecutarValor(instruccion.Valor,ts)
    if(aux.Tipo===aux2.Tipo||aux.Tipo===undefined){
        if(typeof aux2.Valor === 'object'){
            aux.Valor=aux2.Valor
            aux.Tipo=aux2.Tipo
        }
        else{
            aux.Valor=JSON.parse(JSON.stringify(aux2.Valor))
            aux.Tipo=JSON.parse(JSON.stringify(aux2.Tipo))
        }
    }
    else if(aux2.Tipo===Tipo_Valor.NULL){
        aux.Valor=null
        aux.Tipo=Tipo_Valor.NULL
    }
    else if(aux.Tipo===Tipo_Valor.NULL){  
        aux.Valor=JSON.parse(JSON.stringify(aux2.Valor))
        aux.Tipo=JSON.parse(JSON.stringify(aux2.Tipo))
    }
    else{
        throw Error("No se puede asignar "+aux2.Tipo+" a "+aux.Tipo)
    }
    

}

/**
 * Ejecuta una sentencia de incremento o decremento
 * @param {*} instruccion 
 * @param {*} ts 
 */
function IncDecExecute(instruccion,ts){
    
    //Se obtiene referencia del valor a asignar
    let aux = ejecutarValor(instruccion.OpIzq,ts)
    //Se obtiene valor a asignar
    let aux2 = ejecutarValor(instruccion,ts)
    aux.Valor=aux2.Valor

}

/**
 * Ejecuta una sentencia de asignacion
 * @param {*} instruccion 
 * @param {*} ts 
 */
function MasAsigExecute(instruccion,ts){
  
    //Se obtiene referencia del valor a asignar
    let aux = ejecutarValor(instruccion.ID,ts)
    //Se obtiene valor a asignar
    let aux2 = ejecutarValor(instruccion.Valor,ts)
    if(aux.Tipo===aux2.Tipo){
        aux.Valor+=aux2.Valor
    }
    else{
        throw Error("No se puede asignar "+aux2.Tipo+" a "+aux.Tipo)
    }   

}

/**
 * Ejecuta la sentencia de asignar un array que no venga de un atributo
 * @param {*} instruccion 
 * @param {*} ts 
 */
function ArrayAsigExecute(instruccion,ts){
    //Se obtiene array
    let aux=ejecutarValor(instruccion.ID,ts)
    //Se obtiene nuevo valor
    let newVal = JSON.parse(JSON.stringify(ejecutarValor(instruccion.Valor,ts))) 
    
    //Se obtiene referencia a la posicion
    let posVal1,posVal2;
    if(instruccion.Posicion2!==undefined){
        //Se obtiene primera posicion
        posVal1=aux.Valor[ejecutarValor(instruccion.Posicion,ts).Valor]
        //Se obtiene segunda posicion
        posVal2=posVal1.Valor[ejecutarValor(instruccion.Posicion2,ts).Valor]
        
        if(posVal2!==undefined){
            posVal2.Valor=newVal.Valor
        }
        else{
            aux.Valor[ejecutarValor(instruccion.Posicion,ts).Valor].Valor[ejecutarValor(instruccion.Posicion2,ts).Valor]=newVal
        }
    }
    else{
        //Se obtiene primera posicion
        posVal1=aux.Valor[Number(ejecutarValor(instruccion.Posicion,ts).Valor)]
        aux.Valor[ejecutarValor(instruccion.Posicion,ts).Valor]=newVal  
    }

    //Se verifican tipos
    /*if(aux.Tipo===newVal.Tipo||(aux.Tipo.includes("ARR")&&newVal.Tipo.includes("ARR"))){
        aux.Valor=newVal.Valor
    }
    else{
        throw Error("No se puede asignar "+newVal.Tipo+" en un array tipo "+aux.Tipo)
    }*/

}

/**
 * Ejecuta la sentencia de asignar un array que no venga de un atributo
 * @param {*} instruccion 
 * @param {*} ts 
 */
function ArrayMasAsigExecute(instruccion,ts){
    //Se obtiene array
    let aux=ejecutarValor(instruccion.ID,ts)
    //Se obtiene nuevo valor
    let newVal = ejecutarValor(instruccion.Valor,ts) 

    //Se obtiene referencia a la posicion
    if(instruccion.Posicion2!==undefined){
        aux=aux.Valor[Number(ejecutarValor(instruccion.Posicion,ts).Valor)].Valor[Number(ejecutarValor(instruccion.Posicion2,ts).Valor)]
    }
    else{
        aux=aux.Valor[Number(ejecutarValor(instruccion.Posicion,ts).Valor)]
    }
    //Se verifican tipos
    if(aux.Tipo===newVal.Tipo){
        aux.Valor+=newVal.Valor
    }
    else{
        throw Error("No se puede asignar "+newVal.Tipo+" en un array tipo "+aux.Tipo)
    }

}

/**
 * Ejecuta una sentencia de declaraciion de una funcion
 * @param {*} instruccion 
 * @param {*} ts 
 */
function FunDecExecute(instruccion,ts){
    
    let aux={
        Parametros:instruccion.Parametros,
        Instrucciones:instruccion.Instrucciones,
    }

    ts.nuevoSimbolo(instruccion.ID,instruccion.TipoRetorno,aux,"FUNCTION",undefined,instruccion.Padre)

}

//SENTENCIA DE CONTROL DE FLUJO

/**
 * Ejecuta un sentencia If
 * @param {*} instruccion 
 * @param {*} ts 
 */
function IfExecute(instruccion,ts){
    let ExpBool = ejecutarValor(instruccion.ExpresionLogica,ts)    
    if(ExpBool.Tipo===Tipo_Valor.BOOLEAN){
        if(ExpBool.Valor){
            if(instruccion.InstruccionesIf!==undefined){
            Array.isArray(instruccion.InstruccionesIf)?EjecutarBloque(instruccion.InstruccionesIf,ts):EjecutarBloque([instruccion.InstruccionesIf],ts)
            }
        } 
        else{
            if(instruccion.InstruccionesElse!==undefined){
            Array.isArray(instruccion.InstruccionesElse)?EjecutarBloque(instruccion.InstruccionesElse,ts):EjecutarBloque([instruccion.InstruccionesElse],ts)
            }
        }
    }
    else{
        throw Error("Error al evaluar expresion booleana")
    }
}

/**
 * Ejecuta una sentencia de switch
 * @param {*} instruccion 
 * @param {*} ts 
 */
function SwitchExecute(instruccion,ts){
    //Se obtiene referencia del valor a evaluar
    let aux = ejecutarValor(instruccion.Expresion,ts)
    //Lista de casos
    let Casos=instruccion.Casos
    //Indica si ya se hizo match
    let bool=false
    try{
        for(let i=0;i<Casos.length;i++){
            if(Casos[i].Tipo===Tipo_Instruccion.CASO_DEFAULT){
                Array.isArray(Casos[i].Instrucciones)?EjecutarBloque(Casos[i].Instrucciones,ts):EjecutarBloque([Casos[i].Instrucciones],ts)
            }
            else if(ejecutarValor(Casos[i].CasoExpresion).Valor===aux.Valor||bool){
                bool=true
                Array.isArray(Casos[i].Instrucciones)?EjecutarBloque(Casos[i].Instrucciones,ts):EjecutarBloque([Casos[i].Instrucciones],ts)
            }
        }
    }
    catch(e){
        if(e instanceof Break){}
        else{
            throw e
        }
    }
}

/**
 * Ejecuta un bloque ternario
 * @param {*} instruccion 
 * @param {*} ts 
 */
function TernarioExecute(instruccion,ts){
    let ExpBool = ejecutarValor(instruccion.ExpresionLogica,ts)    
    if(ExpBool.Tipo===Tipo_Valor.BOOLEAN){
        if(ExpBool.Valor){
            return ejecutarValor(instruccion.InstruccionesIf,ts)
        } 
        else{
            return ejecutarValor(instruccion.InstruccionesElse,ts)
        }
    }
    else{
        throw Error("Error al evaluar expresion booleana")
    }
}

//SENTENCIAS DE REPETICION

/**
 * Ejecuta una sentencia While
 * @param {*} instruccion 
 * @param {*} ts 
 */
function WhileExecute(instruccion,ts){
    let newTS = new TablaSimbolos(ts.simbolos); 
    let ExpBool = ejecutarValor(instruccion.ExpresionLogica,newTS) 
 
    if(ExpBool.Tipo===Tipo_Valor.BOOLEAN){
        try{
            while(ExpBool.Valor){
                let newTS2 = new TablaSimbolos(newTS.simbolos);
                if(instruccion.Instrucciones!==undefined){
                    try{    
                    Array.isArray(instruccion.Instrucciones)?EjecutarBloque(instruccion.Instrucciones,newTS2):EjecutarBloque([instruccion.Instrucciones],newTS2)
                    }
                    catch(e){
                        if(e instanceof Continue){}
                        else{throw e}
                    }
                }
                ExpBool = ejecutarValor(instruccion.ExpresionLogica,newTS)
            }
        }
        catch(e){
            if(e instanceof Break){}
        }
    }
    else{
        throw Error("Error al evaluar expresion booleana")
    }
    
}

/**
 * Ejecuta una sentencia DoWhile
 * @param {*} instruccion 
 * @param {*} ts 
 */
function DoWhileExecute(instruccion,ts){
    let newTS = new TablaSimbolos(ts.simbolos);
    let ExpBool 
    try{
        do{
            let newTS2 = new TablaSimbolos(newTS.simbolos);
            if(instruccion.Instrucciones!==undefined){
                try{    
                Array.isArray(instruccion.Instrucciones)?EjecutarBloque(instruccion.Instrucciones,newTS2):EjecutarBloque([instruccion.Instrucciones],newTS2)
                }
                catch(e){
                    if(e instanceof Continue){}
                    else{throw e}
                }
            }
            ExpBool = ejecutarValor(instruccion.ExpresionLogica,newTS)
            if(ExpBool.Tipo!==Tipo_Valor.BOOLEAN){
                throw Error("Error al evaluar expresion booleana")
            }
        }while(ExpBool.Valor)
    }
    catch(e){
        if(e instanceof Break){}
        else{throw e}
    }
    

}

/**
 * Ejecuta una sentencia For
 * @param {*} instruccion 
 * @param {*} ts 
 */
function ForExecute(instruccion,ts){
    let newTS = new TablaSimbolos(ts.simbolos); 
    Array.isArray(instruccion.OperacionInicial)?EjecutarBloque(instruccion.OperacionInicial,newTS):EjecutarBloque([instruccion.OperacionInicial],newTS)
    let ExpBool = ejecutarValor(instruccion.ExpresionLogica,newTS)
    if(ExpBool.Tipo===Tipo_Valor.BOOLEAN){
        try{
            while(ExpBool.Valor){
                let newTS2 = new TablaSimbolos(newTS.simbolos);
                if(instruccion.Instrucciones!==undefined){
                    try{    
                    Array.isArray(instruccion.Instrucciones)?EjecutarBloque(instruccion.Instrucciones,newTS2):EjecutarBloque([instruccion.Instrucciones],newTS2)
                    }
                    catch(e){
                        if(e instanceof Continue){}
                        else{throw e}
                    }
                }
                Array.isArray(instruccion.ExpresionPaso)?EjecutarBloque(instruccion.ExpresionPaso,newTS):EjecutarBloque([instruccion.ExpresionPaso],newTS)
                ExpBool = ejecutarValor(instruccion.ExpresionLogica,newTS)
            }
        }
        catch(e){
            if(e instanceof Break){}
        }
    }
    else{
        throw Error("Error al evaluar expresion booleana")
    }
}

/**
 * Ejecuta una sentencia For-Of
 * @param {*} instruccion 
 * @param {*} ts 
 */
function ForOfExecute(instruccion,ts){
    let newTS = new TablaSimbolos(ts.simbolos); 
    EjecutarBloque([instruccion.AuxVar],newTS)
    //Se obtiene varible sobre cual iterar
    let aux = newTS.simbolos[newTS.simbolos.length-1]
    //Se obtiene variable a iterar
    let aux2 = ejecutarValor(instruccion.Var,newTS)
    let cont=0;
    if(Array.isArray(aux2.Valor)){
        try{
            while(aux2.Valor[cont]!==undefined){
                newTS.actualizar(aux.ID,aux2.Valor[cont])
                let newTS2 = new TablaSimbolos(newTS.simbolos);
                if(instruccion.Instrucciones!==undefined){
                    try{    
                    Array.isArray(instruccion.Instrucciones)?EjecutarBloque(instruccion.Instrucciones,newTS2):EjecutarBloque([instruccion.Instrucciones],newTS2)
                    }
                    catch(e){
                        if(e instanceof Continue){}
                        else{throw e}
                    }
                }
                cont++
            }
        }
        catch(e){
            if(e instanceof Break){}
        }
    }
    else{
        throw Error(aux2.ID+" no es una varibale iterable")
    }
}

/**
 * Ejecuta una sentencia For-In
 * @param {*} instruccion 
 * @param {*} ts 
 */
function ForInExecute(instruccion,ts){
    let newTS = new TablaSimbolos(ts.simbolos); 
    EjecutarBloque([instruccion.AuxVar],newTS)
    //Se obtiene varible sobre cual iterar
    let aux = newTS.simbolos[newTS.simbolos.length-1]
    //Se obtiene variable a iterar
    let aux2 = ejecutarValor(instruccion.Var,newTS)
    let cont=0;
    if(Array.isArray(aux2.Valor)){
        try{
            while(aux2.Valor[cont]!==undefined){
                newTS.actualizar(aux.ID,{Tipo:Tipo_Valor.NUMBER,Valor:cont})
                let newTS2 = new TablaSimbolos(newTS.simbolos);
                if(instruccion.Instrucciones!==undefined){
                    try{    
                    Array.isArray(instruccion.Instrucciones)?EjecutarBloque(instruccion.Instrucciones,newTS2):EjecutarBloque([instruccion.Instrucciones],newTS2)
                    }
                    catch(e){
                        if(e instanceof Continue){}
                        else{throw e}
                    }
                }
                cont++
            }
        }
        catch(e){
            if(e instanceof Break){}
        }
    }
    else{
        throw Error(aux2.ID+" no es una varibale iterable")
    }
}


//FUNCIONES COMPLEMENTARIAS 

/**
 * Ejecuta un valor
 * @param {*} valor Valor a traducir
 */
function ejecutarValor(valor,ts){
    
    //Si es un arreglo
    if(Array.isArray(valor)){
        //Si es un arreglo vacio
        if(valor.length===0){
            return {Valor:[],Tipo:"ARR"}
        }
        //Si es un arreglo de un type
        else if(valor[0].ID!==undefined){
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
        if(valor.Tipo===Tipo_Valor.STRING){
            return procesarCadena(valor,ts)
        }      
        return valor
    }
    //Si no hay operandos y es un ID
    else if(valor.Valor!==undefined&&valor.Tipo===Tipo_Valor.ID){      
        return ts.getValor(valor.Valor)
    }
    //Si es null
    else if(valor.Valor!==undefined&&valor.Tipo===Tipo_Valor.NULL){      
        return null
    }
    //Si es un id para operacion de atributo o acceso array
    else if(valor.Tipo===undefined&&valor.OpTipo===undefined){
        return ts.getValor(valor)
    }
    //Si es llamada de una funcion
    else if(valor.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
        return FunCallExecute(valor,ts,Global)
    }
    //Si es un bloque ternario
    else if(valor.Tipo===Tipo_Instruccion.BLOQUE_TERNARIO){
        return TernarioExecute(valor,ts)
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
    if(valor.OpDer!==undefined&&valor.OpTipo!==Tipo_Operacion.ATRIBUTO){
    OpDer=ejecutarValor(valor.OpDer,ts)
    }
    if(OpIzq===null){OpIzq={Valor:null,Tipo:Tipo_Valor.NULL}}
    if(OpDer===null){OpDer={Valor:null,Tipo:Tipo_Valor.NULL}}
    
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
            if(OpIzq.Tipo===Tipo_Valor.STRING && OpDer.Tipo.includes("ARR")){
                return {Valor:OpIzq.Valor+traducirArray(OpDer.Valor),Tipo:Tipo_Valor.STRING}
            }
            if(OpIzq.Tipo.includes("ARR") && OpDer.Tipo===Tipo_Valor.STRING){
                return {Valor:traducirArray(OpIzq.Valor)+OpDer.Valor,Tipo:Tipo_Valor.STRING}
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
                return {Valor:OpIzq.Valor>OpDer.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }  
        case Tipo_Operacion.MENOR_QUE:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)<Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                return {Valor:OpIzq.Valor<OpDer.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }  
        case Tipo_Operacion.MAYOR_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)>=Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                return {Valor:OpIzq.Valor>=OpDer.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }  
        case Tipo_Operacion.MENOR_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)<=Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                return {Valor:OpIzq.Valor<=OpDer.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }  
        case Tipo_Operacion.DOBLE_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)===Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                return {Valor:OpIzq.Valor===OpDer.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }    
            //throw new Error("No se puede == "+OpIzq.Tipo+" con "+OpDer.Tipo)
        case Tipo_Operacion.NO_IGUAL:
            if(OpIzq.Tipo===Tipo_Valor.NUMBER && OpDer.Tipo===Tipo_Valor.NUMBER){
                return {Valor:Number(OpIzq.Valor)!==Number(OpDer.Valor),Tipo:Tipo_Valor.BOOLEAN}
            }
            else{
                return {Valor:OpIzq.Valor!==OpDer.Valor,Tipo:Tipo_Valor.BOOLEAN}
            }
            //throw new Error("No se puede != "+OpIzq.Tipo+" con "+OpDer.Tipo)
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
            OpIzq=OpIzq.Valor
            OpDer=valor.OpDer
            if(typeof OpIzq === 'object'){
                //Si se accede a un array del objeto
                if(OpDer.OpTipo===Tipo_Operacion.ACCESO_ARR){
                    
                    //Si se accede a una matriz
                    if(OpDer.OpIzq.OpTipo===Tipo_Operacion.ACCESO_ARR){
                        OpIzq=OpIzq[OpDer.OpIzq.OpIzq].Valor[ejecutarValor(OpDer.OpIzq.OpDer,ts).Valor].Valor
                        return OpIzq[ejecutarValor(OpDer.OpDer,ts).Valor]
                    }
                    else{
                        OpIzq=OpIzq[OpDer.OpIzq].Valor
                        return OpIzq[ejecutarValor(OpDer.OpDer,ts).Valor]
                    }
                }
                //Si se llama a funcion pop o push
                else if(OpDer.Tipo===Tipo_Instruccion.LLAMADA_FUNCION){
                    if(OpDer.ID==="push"){
                        OpIzq.push(ejecutarValor(OpDer.Params[0].Valor,ts))
                        return {Valor:OpIzq.length,Tipo:Tipo_Valor.NUMBER}
                    }
                    else if(OpDer.ID==="pop"){
                        return OpIzq.pop()
                    }
                    else{
                        throw Error("No se puede acceder a una funcion de un objeto");
                    }
                }
                //Si se accede a un atributo
                else{
                    //Si es a propieda lenght
                    if(OpDer==="length"){
                        if(Array.isArray(OpIzq)){
                            return {Valor:OpIzq[OpDer],Tipo:Tipo_Valor.NUMBER}
                        }
                        else{
                            return OpIzq[OpDer]
                        }
                    }
                    //Si es a un atributo
                    else{
                        if(OpIzq===null){
                            return {Valor:null,Tipo:Tipo_Valor.NULL}
                        }
                        return OpIzq[OpDer]
                    }
                }
            }
            else{
                throw Error("No se puede aceeder a objeto porque no existe");
            }
        case Tipo_Operacion.ACCESO_ARR:
            if(Array.isArray(OpIzq)){
                if(OpDer.Tipo===Tipo_Valor.NUMBER){
                    return OpIzq[parseInt(OpDer.Valor)]
                }
                else{
                    throw Error("No se puede a array sin expresion numerica");
                }
            }
            else if(Array.isArray(OpIzq.Valor)){
                if(OpDer.Tipo===Tipo_Valor.NUMBER){
                    return OpIzq.Valor[parseInt(OpDer.Valor)]
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

    //Arreglos auxiliar para comparar con types
    let auxArr=[]
    let auxArr2

    //Se crea objeto
    valor.forEach((element, index, arr) => {
        auxArr.push(element.ID)
        Temp[element.ID]=ejecutarValor(element.Valor,ts)
    });

    //Se infiere Type
    for(let element of typesArr){
        auxArr2=[]
        for(let id of element.Valor){
            auxArr2.push(id.ID);
        }

        if(_.isEqual(_.sortBy(auxArr), _.sortBy(auxArr2))){
            Temp = {Valor:Temp,Tipo:element.ID}
            break;
        }
    }

    //Se comprueban tipos
    

    if(Temp.Tipo!==undefined){
        return Temp
    }
    else{
        throw Error("El type que se desea declarar no existe")
    }

}

/**
 * Da formato de cadena 
 * @param {*} valor 
 */
function procesarCadena(valor,ts){
    valor.Valor= String(valor.Valor).replaceAll(/\\n/g,'\n4')
    valor.Valor= String(valor.Valor).replaceAll(/\\r/g,'\r')
    valor.Valor= String(valor.Valor).replaceAll(/\\t/g,'\t')
    valor.Valor= String(valor.Valor).replaceAll(/\\\\/g,'\\')
    valor.Valor= String(valor.Valor).replaceAll(/\\"/g,"\"")
    let template = String(valor.Valor).match(/\${\w+}/g);
    if(Array.isArray(template)){
        template.forEach(element => {
            let aux = String(element).substring(2,element.length-1)
            valor.Valor=String(valor.Valor).replace(String(element),ts.getValor(aux).Valor)
        });
    }
    return valor
}

/**
 * Obtiene el TS del ambito de una funcion y lo guarda en newTS
 * @param {*} arr 
 * @param {*} newTS 
 */
function getAmbito(fun,newTS){

    if(fun.Padre!==undefined){
        let funPadre = ejecutarValor(fun.Padre,newTS);
        getAmbito(funPadre,newTS)
        Array.isArray(funPadre.Valor.Instrucciones)?BuscarDec(funPadre.Valor.Instrucciones,newTS):BuscarDec([funPadre.Valor.Instrucciones],newTS)
    }

}

//FUNCIOES DE SENTENCIAS DE TRANSFERENCIA

function Break() {
    this.name = 'Break';
}

function Continue() {
    this.name = 'Continue';
}

function Return(valor) {
    this.name = 'Return';
    this.Valor=valor
}