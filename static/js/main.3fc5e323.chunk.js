(this.webpackJsonpproyecto=this.webpackJsonpproyecto||[]).push([[0],[,function(t,e){var n=[],r=[],i={BloquePrincipal:function(t){return{AST:t,ErroresLexicos:n,ErroresSintacticos:r}}},s={addErrorLexico:function(t,e){n.push({Error:t,Fila:e})},resetErrors:function(){r=[],n=[],[]}};t.exports.Tipo_Operacion={NEGACION:"NEGACION",MULTIPLICACION:"MULTIPLICACION",DIVISION:"DIVISION",SUMA:"SUMA",RESTA:"RESTA",MODULO:"MODULO",POTENCIA:"POTENCIA",CONCATENACION:"CONCATENACION",DECREMENTO:"DECREMENTO",INCREMENTO:"INCREMENTO",MAYOR_QUE:"MAYOR_QUE",MENOR_QUE:"MENOR_QUE",MAYOR_IGUAL:"MAYOR_IGUAL",MENOR_IGUAL:"MENOR_IGUAL",DOBLE_IGUAL:"DOBLE_IGUAL",NO_IGUAL:"IGUAL_QUE",AND:"AND",OR:"OR",NOT:"NOT"},t.exports.Tipo_Instruccion={DECLARACION:"INS_DECLARACION",ASIGNACION:"INS_ASIGANCION",ASIG_DECL:"INS_ASIGNACION_DECLARACION",DECL_FUNCION:"INS_DECLARACION_FUNCION",LLAM_FUNCION:"INS_LLAMADA_FUNCION",SALIDA:"INS_SALIDA_CONSOLA",BLOQUE_IF:"INS_BLOQUE_IF",BLOQUE_ELSE:"INS_BLOQUE_ELSE",BLOQUE_ELSE_IF:"INS_BLOQUE_ELSE_IF",BLOQUE_SWITCH:"INS_BLOQUE_SWITCH",CASO_SWITCH:"INS_CASO_SWITCH",CASO_DEFAULT_SWITCH:"INS_CASO_DEFAULT_SWITCH",BLOQUE_WHILE:"INS_BLOQUE_WHILE",BLOQUE_DOWHILE:"INS_BLOQUE_DOWHILE",BLOQUE_FOR:"INS_BLOQUE_FOR",BLOQUE_FOR_OF:"INS_BLOQUE_FOR_OF",BLOQUE_FOR_IN:"INS_BLOQUE_FOR_IN",CONTINUE:"INS_CONTINUE",RETURN:"INS_RETURN",BREAK:"INS_BREAK"},t.exports.Tipo_Valor={NUMERO:"NUMERO",DECIMAL:"DECIMAL",ID:"ID",BOOLEANO:"BOOLEANO",CADENA:"CADENA",CARACTER:"CARACTER"},t.exports.AST_Tools=i,t.exports.Manejo_Errores=s,t.exports.ErroresLexicos=n,t.exports.ErroresSintacticos=r},,,,,,,,function(t,e,n){t.exports=n.p+"static/media/logo.5d5d9eef.svg"},function(t,e,n){t.exports=n(28)},,,,,function(t,e,n){},function(t,e,n){},,,,,function(t,e,n){},,,function(t,e,n){(function(t,r){var i=function(){var t=function(t,e,n,r){for(n=n||{},r=t.length;r--;n[t[r]]=e);return n},e=[1,6],r=[1,5],i=[2,5,8],s={trace:function(){},yy:{},symbols_:{error:2,init:3,inicio:4,EOF:5,instrucciones:6,instruccion:7,ID:8,PUNTOYCOMA:9,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",8:"ID",9:"PUNTOYCOMA"},productions_:[0,[3,2],[4,1],[6,2],[6,1],[7,1],[7,2]],performAction:function(t,e,n,r,i,s,a){var l=s.length-1;switch(i){case 1:return c.resetErrors(),s[l-1];case 2:this.$=o.BloquePrincipal(s[l]);break;case 3:s[l-1].push(s[l]),this.$=s[l-1];break;case 4:this.$=[s[l]];break;case 5:this.$="IDXD";break;case 6:console.log("Error")}},table:[{2:e,3:1,4:2,6:3,7:4,8:r},{1:[3]},{5:[1,7]},{2:e,5:[2,2],7:8,8:r},t(i,[2,4]),t(i,[2,5]),{9:[1,9]},{1:[2,1]},t(i,[2,3]),t(i,[2,6])],defaultActions:{7:[2,1]},parseError:function(t,e){if(!e.recoverable){var n=new Error(t);throw n.hash=e,n}this.trace(t)},parse:function(t){var e=this,n=[0],r=[null],i=[],s=this.table,o="",c=0,a=0,l=0,h=2,u=1,y=i.slice.call(arguments,1),E=Object.create(this.lexer),_={yy:{}};for(var f in this.yy)Object.prototype.hasOwnProperty.call(this.yy,f)&&(_.yy[f]=this.yy[f]);E.setInput(t,_.yy),_.yy.lexer=E,_.yy.parser=this,"undefined"==typeof E.yylloc&&(E.yylloc={});var m=E.yylloc;i.push(m);var p=E.options&&E.options.ranges;function O(t){n.length=n.length-2*t,r.length=r.length-t,i.length=i.length-t}"function"===typeof _.yy.parseError?this.parseError=_.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var I,g,N,d,A,L,C,S,b,U=function(){var t;return"number"!==typeof(t=E.lex()||u)&&(t=e.symbols_[t]||t),t},R={};;){if(N=n[n.length-1],this.defaultActions[N]?d=this.defaultActions[N]:(null!==I&&"undefined"!=typeof I||(I=U()),d=s[N]&&s[N][I]),"undefined"===typeof d||!d.length||!d[0]){var T,k=function(t){for(var e=n.length-1,r=0;;){if(h.toString()in s[t])return r;if(0===t||e<2)return!1;t=n[e-=2],++r}},v="";if(l)g!==u&&(T=k(N));else{for(L in T=k(N),b=[],s[N])this.terminals_[L]&&L>h&&b.push("'"+this.terminals_[L]+"'");v=E.showPosition?"Parse error on line "+(c+1)+":\n"+E.showPosition()+"\nExpecting "+b.join(", ")+", got '"+(this.terminals_[I]||I)+"'":"Parse error on line "+(c+1)+": Unexpected "+(I==u?"end of input":"'"+(this.terminals_[I]||I)+"'"),this.parseError(v,{text:E.match,token:this.terminals_[I]||I,line:E.yylineno,loc:m,expected:b,recoverable:!1!==T})}if(3==l){if(I===u||g===u)throw new Error(v||"Parsing halted while starting to recover from another error.");a=E.yyleng,o=E.yytext,c=E.yylineno,m=E.yylloc,I=U()}if(!1===T)throw new Error(v||"Parsing halted. No suitable error recovery rule available.");O(T),g=I==h?null:I,I=h,N=n[n.length-1],d=s[N]&&s[N][h],l=3}if(d[0]instanceof Array&&d.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+I);switch(d[0]){case 1:n.push(I),r.push(E.yytext),i.push(E.yylloc),n.push(d[1]),I=null,g?(I=g,g=null):(a=E.yyleng,o=E.yytext,c=E.yylineno,m=E.yylloc,l>0&&l--);break;case 2:if(C=this.productions_[d[1]][1],R.$=r[r.length-C],R._$={first_line:i[i.length-(C||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(C||1)].first_column,last_column:i[i.length-1].last_column},p&&(R._$.range=[i[i.length-(C||1)].range[0],i[i.length-1].range[1]]),"undefined"!==typeof(A=this.performAction.apply(R,[o,a,c,_.yy,d[1],r,i].concat(y))))return A;C&&(n=n.slice(0,-1*C*2),r=r.slice(0,-1*C),i=i.slice(0,-1*C)),n.push(this.productions_[d[1]][0]),r.push(R.$),i.push(R._$),S=s[n[n.length-2]][n[n.length-1]],n.push(S);break;case 3:return!0}}return!0}},o=(n(1).Tipo_Operacion,n(1).Tipo_Valor,n(1).AST_Tools),c=n(1).Manejo_Errores,a={EOF:1,parseError:function(t,e){if(!this.yy.parser)throw new Error(t);this.yy.parser.parseError(t,e)},setInput:function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},unput:function(t){var e=t.length,n=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var r=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var i=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===r.length?this.yylloc.first_column:0)+r[r.length-n.length].length-n[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[i[0],i[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(t){this.unput(this.match.slice(t))},pastInput:function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var t=this.pastInput(),e=new Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},test_match:function(t,e){var n,r,i;if(this.options.backtrack_lexer&&(i={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(i.yylloc.range=this.yylloc.range.slice(0))),(r=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=r.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:r?r[r.length-1].length-r[r.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],n=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var s in i)this[s]=i[s];return!1}return!1},next:function(){if(this.done)return this.EOF;var t,e,n,r;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var i=this._currentRules(),s=0;s<i.length;s++)if((n=this._input.match(this.rules[i[s]]))&&(!e||n[0].length>e[0].length)){if(e=n,r=s,this.options.backtrack_lexer){if(!1!==(t=this.test_match(n,i[s])))return t;if(this._backtrack){e=!1;continue}return!1}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,i[r]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var t=this.next();return t||this.lex()},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},pushState:function(t){this.begin(t)},stateStackSize:function(){return this.conditionStack.length},options:{lex:!0,"case-sensitive":!0,yylineno:!0},performAction:function(t,e,n,r){switch(n){case 0:case 1:case 2:break;case 3:return"STRING";case 4:return"NUMBER";case 5:return"BOOLEAN";case 6:return"VOID";case 7:return"TYPE";case 8:return"LET";case 9:return"CONST";case 10:return"INCREMENTO";case 11:return"DECREMENTO";case 12:return"OPDIV";case 13:return"OPMULTI";case 14:return"OPMOD";case 15:return"OPMENOS";case 16:return"OPMAS";case 17:return"OPCIRCU";case 18:return"PARIZQ";case 19:return"PARDER";case 20:return"LLAVIZQ";case 21:return"LLAVDER";case 22:return"MAYORIG";case 23:return"MENORIG";case 24:return"MENOR";case 25:return"MAYOR";case 26:return"DIGUAL";case 27:return"IGUAL";case 28:return"NIGUAL";case 29:return"PUNTO";case 30:return 9;case 31:return"COMA";case 32:return"DOSPUNTOS";case 33:return"TERNARIO";case 34:return"AND";case 35:return"OR";case 36:return"NOT";case 37:return"IF";case 38:return"ELSE";case 39:return"SWITCH";case 40:return"CASE";case 41:return"DEFAULT";case 42:return"WHILE";case 43:return"DO";case 44:return"FOR";case 45:return"OF";case 46:return"IN";case 47:return"BREAK";case 48:return"CONTINUE";case 49:return"RETURN";case 50:return"FUNCTION";case 51:return"CONSOLE";case 52:return"LOG";case 53:return"GRAFICAR";case 54:case 55:return e.yytext=e.yytext.substr(1,e.yyleng-2),"CADENA";case 56:return"NUMERO";case 57:return 8;case 58:return 5;case 59:return c.addErrorLexico(e.yytext,e.yylineno+1),""}},rules:[/^(?:\s+)/,/^(?:\/\/.*)/,/^(?:[\/][*][^*]*[*]+([^\/*][^*]*[*]+)*[\/])/,/^(?:string\b)/,/^(?:number\b)/,/^(?:boolean\b)/,/^(?:void\b)/,/^(?:type\b)/,/^(?:let\b)/,/^(?:const\b)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\/)/,/^(?:\*)/,/^(?:%)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:\{)/,/^(?:\})/,/^(?:>=)/,/^(?:<=)/,/^(?:>)/,/^(?:<)/,/^(?:==)/,/^(?:=)/,/^(?:!=)/,/^(?:\.)/,/^(?:;)/,/^(?:,)/,/^(?::)/,/^(?:\?)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:!)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:for\b)/,/^(?:of\b)/,/^(?:in\b)/,/^(?:break\b)/,/^(?:continue\b)/,/^(?:return\b)/,/^(?:function\b)/,/^(?:console\b)/,/^(?:log\b)/,/^(?:graficar_ts\b)/,/^(?:"(\\"|[^\"])*")/,/^(?:'(\\"|[^\"])*')/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:([a-zA-Z])[a-zA-Z0-9_]*)/,/^(?:$)/,/^(?:.)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59],inclusive:!0}}};function l(){this.yy={}}return s.lexer=a,l.prototype=s,s.Parser=l,new l}();e.parser=i,e.Parser=i.Parser,e.parse=function(){return i.parse.apply(i,arguments)},e.main=function(r){r[1]||(console.log("Usage: "+r[0]+" FILE"),t.exit(1));var i=n(26).readFileSync(n(27).normalize(r[1]),"utf8");return e.parser.parse(i)},n.c[n.s]===r&&e.main(t.argv.slice(1))}).call(this,n(7),n(25)(t))},,,,function(t,e,n){"use strict";n.r(e);var r=n(0),i=n.n(r),s=n(8),o=n.n(s);n(15),n(9),n(16);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var c=n(2),a=(n(17),n(18),n(19),n(20),n(21),n(22),n(6),n(23),n(24)),l="";function h(t,e){alert("Codigo: \n"+l)}function u(t,e){e.innerHTML="L: "+t.getCursor().line+" C: "+t.getCursor().ch}function y(){var t;try{t=a.parse(l.toString()),console.log(JSON.stringify(t,null,2))}catch(e){console.error(e)}}function E(){return i.a.createElement("div",{className:"col-md-6 divcontent "},i.a.createElement("h3",null,"Entrada"),i.a.createElement(c.UnControlled,{autoFocus:!0,onChange:function(t,e,n){l=n},onCursorActivity:function(t,e,n){u(t,document.getElementById("LCEditor"))},options:{theme:"darcula",mode:"javascript",matchBrackets:!0,lineNumbers:!0}}),i.a.createElement("h6",{id:"LCEditor"},"L:0 C:0"))}function _(){return i.a.createElement("div",{className:"col-md-6 divcontent "},i.a.createElement("h3",null,"Salida"),i.a.createElement(c.UnControlled,{autoFocus:!0,onCursorActivity:function(t,e,n){u(t,document.getElementById("LCViewer"))},options:{theme:"darcula",mode:"javascript",matchBrackets:!0,lineNumbers:!0}}),i.a.createElement("h6",{id:"LCViewer"},"L:0 C:0"))}function f(){return i.a.createElement("div",{className:"col-md-12 divcontent"},i.a.createElement("h3",null,"Consola"),i.a.createElement(c.UnControlled,{autoFocus:!0,options:{theme:"lucario",lineNumbers:!0}}))}function m(t){return i.a.createElement("button",{className:"btn btn-warning col-md-2 ",onClick:h},"Traducir ")}function p(){return i.a.createElement("button",{className:"btn btn-success col-md-2 offset-md-1 ",onClick:y},"Ejecutar ")}function O(){return i.a.createElement("button",{className:"btn btn-danger col-md-2 offset-md-1",onClick:h},"Reportes ")}function I(){return i.a.createElement("div",{className:"container col-md-12"},i.a.createElement("div",{className:" row justify-content-center col-md-12 divcontent"},i.a.createElement(m,null),i.a.createElement(p,null),i.a.createElement(O,null)),i.a.createElement("div",{className:" row col-md-12 "},i.a.createElement(E,null),i.a.createElement(_,null)),i.a.createElement("div",{className:" row col-md-12 "},i.a.createElement(f,null)))}o.a.render(i.a.createElement(I,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}],[[10,1,2]]]);
//# sourceMappingURL=main.3fc5e323.chunk.js.map