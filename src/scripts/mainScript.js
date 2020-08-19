//Variable Globales

export let CodeTxt="ds";
let Editor;

export function print(text,event){
    alert("Codigo: \n"+CodeTxt);
}

export function setCode(text){
    CodeTxt=text
}

export function setViewer(editor){
   Editor=editor
}


