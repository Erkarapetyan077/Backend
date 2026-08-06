const res = require("./utils/math");
const str = require("./utils/strings");

console.log("---Res---\n");

console.log(res.add(3, 1));
console.log(res.multiply(3, 1));
console.log(res.subtract(3, 1));

console.log("\n---String---\n");


console.log(str.capitalize("hello"));


console.log("\nrequire.cache", require.cache);

//Քանի որ Node.js-ը յուրաքանչյուր require()-ով բեռնված մոդուլ պահում է
//  require.cache-ում, որպեսզի նույն մոդուլը հաջորդ անգամ նորից չբեռնի,
//  այլ օգտագործի արդեն cache-ում պահված տարբերակը։ Իսկ index.js-ը կա,
//  որովհետև դա ծրագրի հիմնական ֆայլն է։
