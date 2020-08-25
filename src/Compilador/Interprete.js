const Tipo_Operacion	= require('./Instrucciones.js').Tipo_Operacion;
const Tipo_Valor 	    = require('./Instrucciones.js').Tipo_Valor;

/**
 * Función que crea un símbolo.
 * @param id 
 * @param tipo 
 * @param valor 
 */
function crearSimbolo(id, tipo, valor) {
    return {
        ID: id,
        Tipo: tipo,
        Valor: valor
    }
}

class TablaSimbolos {

    /**
     * El constructor recibe una tabla de simbolos de su ambito.
     * @param {*} simbolos 
     */
    constructor (simbolos) {
        this.simbolos = simbolos;
    }

    /**
     * Agrega un nuevo valor a la tabla de simbolo
     * @param id 
     * @param tipo 
     */
    nuevoSimbolo(id, tipo) {
        this.simbolos.push(crearSimbolo(id,tipo));
    }

    /**
     * Actualiza el valor de un simbolo
     * @param id 
     * @param valor 
     */
    actualizar(id, valor) { //AQUI VAMOS A VALIDAR TIPOS
        const simbolo = this._simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) {
            if(simbolo.tipo===valor.tipo){
                if(simbolo.tipo===TIPO_DATO.NUMERO){
                    if(valor.valor instanceof String){ //para que no hayan clavos, convertimos si es necesario
                        simbolo.valor = parseInt(valor.valor,10);
                    }else{
                        simbolo.valor = valor.valor;
                    }
                }else{
                    if(valor.valor instanceof Number){ //para que no hayan clavos, convertimos si es necesario
                        simbolo.valor = valor.valor.toString();
                    }else{
                        simbolo.valor = valor.valor;
                    }
                }
                
            }else{
                throw 'ERROR DE TIPOS -> variable: ' + id + ' tiene tipo: '+simbolo.tipo +' y el valor a asignar es de tipo: '+valor.tipo;
            }
        }
        else {
            throw 'ERROR: variable: ' + id + ' no ha sido definida';
        }
    }

    /**
     * Obtiene el valor de un símbolo
     * @param id 
     */
    getValor(id) {
        const simbolo = this.simbolos.filter(simbolo => simbolo.id === id)[0];
        if (simbolo) return simbolo; //aqui devolvemos el simbolo completo
        else throw "ERROR: variable: " + id + "no ha sido definida";
    }

    /**
     * Función getter para obtener los símbolos.
     */
    get simbolos() {
        return this._simbolos;
    }
}

// Exportamos las constantes y la clase.

module.exports.Tipo_Valor = Tipo_Valor;
module.exports.TablaSimbolos = TablaSimbolos;