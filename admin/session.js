var _a;
// Creating symbols
var symbol1 = Symbol("key1");
var symbol2 = Symbol("key2");
// Creating an object with symbols as keys
var myObject = (_a = {},
    _a[symbol1] = "Value for Symbol 1",
    _a[symbol2] = "Value for Symbol 2",
    _a);
// Accessing values using symbols
// console.log(myObject[symbol1]); // Output: Value for Symbol 1
// console.log(myObject[symbol2]); // Output: Value for Symbol 2
// Iterating over symbols
var symbolKeys = Object.getOwnPropertySymbols(myObject);
// symbolKeys.forEach((symbol) => {
//   console.log("symbol", symbol);
//   console.log(symbol, myObject[symbol]);
// });
var myMap = new Map();
myMap.set("name", "John");
console.log("myMap", myMap);
// console.log(myMap.get("name"));
