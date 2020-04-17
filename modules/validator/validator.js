/**
 * Simple and speedy data validator 
 * 
 * Overall:
 * 
 * Goal:
 *      should check for:
 *          - Existential (required)
 *          - Min, max, type (int) (cast-able)
 *          - Returns message
 *      simply returns message for developer
 * 
 * 
 * Performance (on AMD Ryzen 5, 3.6 GHz):   
 *      10^6 validation in 1067 ms      
 */ 

const ObjectId = require('mongoose').Types.ObjectId

let fmap = { // function map 
    exists: exists, 
    min: min, 
    max: max, 
    int: int, 
    mongoID: mongoID,
    regex: regex
}
function mongoID(x,expected){
    // console.log(x)
    if(ObjectId.isValid(x) == expected){
        return {result: true, message: `matches expectation:${expected? '': ' not'} a valid ID` }
    }
    return {result: false, message:`must${expected? '': ' not'} be a valid ID`}
}

function exists(x, expected){
    if((x != undefined) == expected){
        return {result: true, message: `as expected:${expected? '':' not'} exists`}
    }
    return {result: false, message: `must${expected? '' : ' not'} exists`}
}

function min(x, bound){
    let typeNotif = ''
    if (typeof(x)=='string') {x = x.length; typeNotif='length '}
    
    if(x>=bound){
        return {result: true, message: 'has statisfied lower bound of '+bound}
    }
    return {result: false, message: `${typeNotif}must be greater or equal ${bound}`}
}

function max(x, bound){
    let typeNotif = ''
    if (typeof(x)=='string') {x = x.length; typeNotif='length '} // since node js are dynamically typed
    if(x<=bound){
        return {result: true, message: `${typeNotif}has statisfied lower bound of `+bound}
    }
    return {result: false, message: `${typeNotif}must be lower or equals ${bound}`}
}

function int(x, expected){
    x = parseFloat(x) // a float can be an int
    if (Number.isInteger(x) == expected) {
        return {result: true, message: `matches expectation: must${expected? '': ' not'} be an int`}
    }
    return {result: false, message: `must${expected? '' : ' not'} be 'integer'`}
}
function regex(x, g){
    let result = g.test(x)
    return {result: result, message: `${result?'matches':'does not match'} the regex '${g.toString()}'`}
}

/**
 * @function addCustomValidator: add a custom validator so that it could be used in validate function
 * @param {Map} validateRecord
 * 
 * @example
 * function length(x, value){
 *      return {result: (x == value), message: 'checked'}
 * }
 * addCustomValidator({length: length}) 
 */
function addCustomValidator(validateRecord){
    for(let key in validateRecord){
        fmap[key] = validateRecord[key]
    }
}

/**
 * @function validate
 *   Validate if x match predefined schema
 *  
 * @param {Map} x 
 * @param {Map} schema 
 * 
 * @returns: 'true' or error message
 * 
 * @example:
 * let req = { 
 *      postID: 'afafafafafafafafafafafaf',
 *      action: 1,
 *      username: 'thao'
 * }
 * let schema = {
 *      $action: {int: true, min: 1, max: 10}, // if exists, then check condition
 *      postID:  {mongoID: true}, 
 *      username: {min: 5, max: 16} // length: min = 5, max: 16
 * }
 * 
 * let result = validate(x, schema)
 */

function validate(x, schema){
    for(let key in schema){
        let sub = schema[key]
        if(key.startsWith('$')){
            key = key.substring(1)
            if(x[key]==undefined) continue
        }else if (x[key] == undefined){
            return `Missing '${key}'`
        }
        for(let name in sub){
            let func = fmap[name]
            if (!func){
                throw Error(`${name} validator not is supported, you may need to call 'addCustomValidator'`)
            }
            let expected = sub[name]
            let result = func(x[key], expected)
            if (!result.result){
                return `'${key}' ${result.message}`
            }
        }
    }
    return true
}

/**
 * @function main()
 *      used to test validation performance
 *      what is inside, read the function below
 */

function main(){
    // fmap = {exists: exists, min: min, max: max, int: int, mongoID: mongoID}
    console.log('Start validating...')
    let time = 8000000
    let marked = Date.now()
    for(let i=0;i<time;++i){
        let req = { 
            postID: 'afafafafafafafafafafafaf',
            action: 1,
            username: 'vinh'
        }

        let schema = {
            $action: {int: true, min: 1, max: 10}, // if exists, then check condition
            postID:  {mongoID: true}, 
            username: {min: 5, max: 16} // length: min = 5, max: 16
        }
        let result = validate(req, schema);
    }
    console.log(`Testing for ${time} consumes ${Date.now()-marked} ms`)
}

module.exports = {
    addCustomValidator: addCustomValidator,
    validate: validate,
    speedTest: main
}

if (require.main === module) 
    main()