// Creating symbols
const symbol1 = Symbol("key1");
const symbol2 = Symbol("key2");

// Creating an object with symbols as keys
const myObject = {
  [symbol1]: "Value for Symbol 1",
  [symbol2]: "Value for Symbol 2",
};

// Accessing values using symbols
// console.log(myObject[symbol1]); // Output: Value for Symbol 1
// console.log(myObject[symbol2]); // Output: Value for Symbol 2

// Iterating over symbols
const symbolKeys = Object.getOwnPropertySymbols(myObject);
// symbolKeys.forEach((symbol) => {
//   console.log("symbol", symbol);
//   console.log(symbol, myObject[symbol]);
// });

const myMap = new Map();
myMap.set("name", "John");
console.log("myMap", myMap);
// console.log(myMap.get("name"));
