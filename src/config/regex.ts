export const isNumeric = /^[0-9]+$/;
export const isAlphaNumeric = /^[a-zA-Z0-9_]+$/;
export const isValidCpf = /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)|^(\d{11}|\d{14})$/;
export const isValidEmail = /^[a-z0-9._]+@[a-z0-9]+\.[a-z]+\.?([a-z]+)?$/i;
export const isValidIp = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;

//NAO DEIXA COLOCAR SÓ SIMBOLO, PERMITE ACENTUAÇÕES, MINIMO DE 3 CARACTERES, PROS ANIMAIS NÃO FAZER MERDA
export const formatInput = /^(?=.*[a-zA-Z0-9\u00C0-\u00FF])[a-zA-Z0-9\u00C0-\u00FF.()_+\-=/\\|, ]{3,}$/;
export const wifiPassword = /^[a-zA-Z0-9_]{8,}$/;
export const spaceNotAllowed = /^\S*$/;

//OBRIGA USO DE LETRAS MAIUSCULAS, MINUSCULAS E NUMEROS
export const Act2436ANATEL = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;