var colors = require('colors');
String.prototype.repeat=function(n){return new Array(n+1).join(this);}
String.prototype.trimChar=function(c){c='['+(c?c:"\s")+']';return this.replace(new RegExp('^'+c+'+|'+c+'+$','g'),'');}
module.exports = function(str){if (!str) {return}
    tab = "    ".repeat(str.length-(stn=str.trimChar('>')).length)
    if (!(sign={'+':"[+]".green,'-':"[-]".red,'!':"[!]".yellow,'*':"[*]".cyan}[stn[0]])) {console.log("[AP-ERR:WriteAP:InvalidSign]".red);return;}
    console.log(tab+sign+" "+stn.slice(1));
}
