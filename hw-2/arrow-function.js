// 1. Write the following functions as arrow functions:
// function addTwoNumbers(a, b){
//       return a+b;
// }

addTwoNumbers = (a, b) => a + b;

// function stringLength( myStr ){
//     if(myStr.length < 10)
//         return "short";
//     return "long";
// }

stringLength = (myStr) => (myStr.length < 10 ? "short" : "long");

// 2. What is this arrow functions doing?
// let fn = (a,b) => { a>b ? console.log(a) : console.log(b) }

("The arrow function is printing the larger of two given numbers, represented `a` and `b`.");

// 3. Write an example to demonstrate the use of the map function on an array.

let heights = ["5.72", "6.41", "5.83", "6.21"];
const heightWithUnits = heights.map(addUnitsFeet);

function addUnitsFeet(height) {
  return height + " feet";
}
