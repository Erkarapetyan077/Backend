1. CommonJS տարբերակում, եթե յուրաքանչյուր ֆունկցիան
   առանձին exports-ին կցելու փոխարեն գրեիք՝
   exports = { add, subtract, multiply }; ապա ի՞նչ տեղի կունենար, երբ index.js ֆայլից այդ մոդուլը require() անեիք։ Ինչո՞ւ։

vorovhetev exports uxxaki hxum e module.exports vra, isk ete tenc grenq uxaki et exportsin kveragrvi taza object u chi lini;
patasxany klini kam {} datark object, kam module.exports-i hin tarery,
require CommonJS-um misht veradarcnuma module.exports-i arjeqy;

2. Ինչո՞ւ է cjs/utils/strings.js ֆայլում օգտագործվում
   module.exports = ...
   իսկ utils/math.js ֆայլում օգտագործվում է
   exports.xxx = ...
   Կարո՞ղ էիք math.js-ն էլ գրել module.exports-ով։ Եթե այո, ապա ինչ կփոխվեր import/require անելու կողմում։

strings.js-um amboxj arjeqy 1 angam enq uxarrkum isk math.js-um arandzin arandzin avelacnum enq math.js nuynpes kareli e grel
module.exports = {
add,
subtract,
multiply
};
yerku dzevnel ashxatum e;
vochinch chi poxvi require-um vorovhetev nuyn module.exports-na veradardznelu;

3. ES Modules (ESM) տարբերակում ինչո՞ւ է անհրաժեշտ գրել ֆայլի ճիշտ ընդլայնումը (.js)՝
   import ... from './utils/math.js';
   մինչդեռ CommonJS տարբերակում առանց խնդրի աշխատում է
   require('./utils/math')
   առանց .js-ի։

ES Modules ev CommonJS tarber dzev en resolve linum ES Modulesum
module resolutiony aveli xist e partadire Node.js kam Browserum chisht chanaprhy nshel isk
CommonJS-um require uni nerkarucvac voronman mexanizm Node.js hertov porcum e yndlaynumer avelacnelov
u gtnum;

4. Նշեք մեկ հնարավորություն, որը ES Modules-ն ունի, իսկ CommonJS-ը՝ ոչ։ Կարճ բացատրեք, թե ինչու է այդ տարբերությունը գոյություն ունի։

Հուշում․ մտածեք, թե ինչպես են երկու համակարգերը բեռնում (load) ֆայլերը՝ սինխրոն (synchronously), թե ոչ։

ES Modules uni asynchron bernman hnaravorutyun isk CommonJS voch
patcharn ayn e, vor CommonJS-i require() ashxatum e sinxron erb kody hasnum e require()-i Node.js
anmijapes bernum e file ev spasum minchev avartvi;
Isk ES Modules-i import-naxatesvac e aynpes, vro modulnery karox en bernvel ansychron, inch shat karevor e
browser-um kam mec cragrerum vortex modulnery karox en bernvel cancic;

ays tarberutyuny goyutyun uni vorovhetev ES Modules stexcvel e vorpes jamanakakic standart
ashxatelu Node.js kam browserum, isk CommonJS stexcvel er miayn server-side js-i hamar;
