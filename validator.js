const Validator = require("fastest-validator"); 

let time = 1000000
const v = new Validator(); 
let marked = Date.now()

// slow on 10^6 tests
for(let i=0;i<time;++i){ 
    let schema = {
        id: { type: "number", positive: true, integer: true },
        name: { type: "string", min: 3, max: 255 },
        status: "boolean" 
    };
    let result = v.validate({ id: 5, name: "John", status: true }, schema);
}
console.log(`Testing for ${time} consumes ${Date.now()-marked} ms`)