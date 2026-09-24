export const CLAVE_INTRO = "nd2:intro";

export const SCRIPT_CARGA = `try{if(!sessionStorage.getItem("${CLAVE_INTRO}"))document.documentElement.dataset.cargando=""}catch(e){}`;
