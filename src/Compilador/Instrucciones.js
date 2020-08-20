// Tipos de Operaciones
const Tipo_Operacion = {
    //Aritmetica
    NEGACION:       'NEGACION',
    MULTIPLICACION: 'MULTIPLICACION',
	DIVISION:       'DIVISION',
	SUMA:           'SUMA',
    RESTA:          'RESTA',
    MODULO:         'MODULO',
	POTENCIA:       'POTENCIA',
	CONCATENACION:	'CONCATENACION',
	DECREMENTO:		'DECREMENTO',
	INCREMENTO:		'INCREMENTO',
    //Relacional
	MAYOR_QUE:      'MAYOR_QUE',
	MENOR_QUE:      'MENOR_QUE',
	MAYOR_IGUAL: 	'MAYOR_IGUAL',
	MENOR_IGUAL:    'MENOR_IGUAL',
	DOBLE_IGUAL:    'DOBLE_IGUAL',
    NO_IGUAL:    	'IGUAL_QUE',
    //Logica
	AND:  			'AND',
	OR: 			'OR',
	NOT:   			'NOT'  	
}
// Tipos de Instrucciones
const Tipo_Instruccion = {
	DECLARACION:		'INS_DECLARACION',
	ASIGNACION:			'INS_ASIGANCION',
    ASIG_DECL:      	'INS_ASIGNACION_DECLARACION',
	DECL_FUNCION:   	'INS_DECLARACION_FUNCION',
    LLAM_FUNCION:   	'INS_LLAMADA_FUNCION',
    SALIDA:         	'INS_SALIDA_CONSOLA',
	BLOQUE_IF:      	'INS_BLOQUE_IF',
	BLOQUE_ELSE:      	'INS_BLOQUE_ELSE',
	BLOQUE_ELSE_IF:     'INS_BLOQUE_ELSE_IF',
	BLOQUE_SWITCH:  	'INS_BLOQUE_SWITCH',
	CASO_SWITCH:  		'INS_CASO_SWITCH',
	CASO_DEFAULT_SWITCH:'INS_CASO_DEFAULT_SWITCH',	
    BLOQUE_WHILE:   	'INS_BLOQUE_WHILE',
    BLOQUE_DOWHILE: 	'INS_BLOQUE_DOWHILE',
    BLOQUE_FOR:     	'INS_BLOQUE_FOR',
    BLOQUE_FOR_OF:     	'INS_BLOQUE_FOR_OF',
    BLOQUE_FOR_IN:     	'INS_BLOQUE_FOR_IN',
    CONTINUE:       	'INS_CONTINUE',
    RETURN:         	'INS_RETURN',
    BREAK:          	'INS_BREAK'
}

// Tipos de Datos
const Tipo_Valor = {
    NUMBER:         'NUMBER',
    ID:             'ID',
    BOOLEAN:        'BOOLEAN',
    STRING:         'STRING',
    VOID:           'VOID',
    TYPE:           'TYPE'
}

let ErroresLexicos=[];
let ErroresSintacticos=[];
let ErroresSemanticos=[];
let Traduccion="";


const AST_Tools = {

    /**
	* Operaciones Binarias (Arimeticas,Relacional,Logica)
    * @param opIzq Operando Izquierdo 
    * @param operandoDer Operando Derecho
    * @param opTipo  Tipo De Operacion
	 */
	operacionBinaria: function(opIzq, opDer, opTipo) {
		return {
            OpIzq: opIzq,
            OpDer: opDer,
            OpTipo: opTipo
        }
	},

	/**
	 * Crea un nuevo valor
	 * @param valor 
	 * @param valTipo 
	 */
	crearValor: function(valor, valTipo) {
		return {
			Valor: valor,
			Tipo: valTipo
		}
	},

    /**
	 * Crea el bloque global, este contiene todo el codigo fuente
	 * @param sentencias Conjunto de todas las instrucciones 
	 */
	BloquePrincipal: function(sentencias) {
		return {
            AST: sentencias,
			ErroresLexicos:ErroresLexicos,
			ErroresSintacticos:ErroresSintacticos
		}
    },

    /**
	 * Crea Instrucción para una declaracion.
	 * @param id 
	 */
	declaracion: function(id) {
		return {
			Tipo: Tipo_Instruccion.DECLARACION,
			ID: id,
		}
    },

    /**
	* Crea Instrucción para una asignacion.
	* @param id 
	* @param valor 
	*/
	asignacion: function(id, valor) {
		return {
			Tipo: Tipo_Instruccion.ASIGNACION,
			ID: id,
			Valor : valor
		}
	},

    /**
	 * Crea un id
	 * @param id 
	 */
	newID: function (id,tipo,valor) {
		return{
            ID:id,
            Tipo:tipo,
            Valor:valor
        }
    },
    
    /**
	 * Crea una lista de ids
	 * @param Primer ID
	 */
	newIDList: function (id,tipo) {
        var ids = []; 
		ids.push({
            ID:id,
            Tipo:tipo
        })
        return ids

	},
}

const Translate_Tools ={

}


const Manejo_Errores = {

    /**
	 * Añade un nuevo error Lexico
     * @param error Texto que dio error 
     * @param fila Numero de fila del error
	 */
	addErrorLexico:function(error,fila){
		ErroresLexicos.push(
		{
			Error:error,
			Fila:fila,
		});
    },

    /**
    * Añade un nuevo error Sintactico
	*/
	addErrorSintactico:function(error,fila,columa){
		ErroresSintacticos.push(
		{
			Error:error,
			Fila:fila,
			Columna:columa
		});
	},

    /**
     * Limpia los arreglos de errores
     */
    resetErrors:function(){
		ErroresSintacticos=[];
        ErroresLexicos=[];
        ErroresSemanticos=[];
	}

}

module.exports.Tipo_Operacion = Tipo_Operacion;
module.exports.Tipo_Instruccion = Tipo_Instruccion;
module.exports.Tipo_Valor = Tipo_Valor;
module.exports.AST_Tools = AST_Tools;
module.exports.Manejo_Errores = Manejo_Errores;
module.exports.ErroresLexicos = ErroresLexicos;
module.exports.ErroresSintacticos = ErroresSintacticos;