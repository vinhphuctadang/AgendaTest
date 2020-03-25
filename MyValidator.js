
/**
 * Goal:
 *      checks for:
 *          - Existential (required)
 *          - Min, max, type (int) (cast-able)
 *          - Give message
 *      simply returns message for developer
 */ 

let fmap = {} // function map 

function exists(x, expected){
    if((x != undefined) == expected){
        return {result: true, message: 'existence as expected'}
    }
    return {result: false, message: 'not expected'}
}

function min(x, bound){
    if(x>=bound){
        return {result: true, message: 'min statisfied'}
    }
    return {result: false, message: `is lower than ${bound}`}
}

function max(x, bound){
    if(x<=bound){
        return {result: true, message: 'max statisfied'}
    }
    return {result: false, message: `highr than ${bound}`}
}
function int(x, expected){
    if (Number.isInteger(x) == expected) {
        return {result: true, message: 'number type as expected'}
    }
    return {result: false, message: `${expected? '' : 'does not'} need(s) to be int`}
}



function validate(x, schema){
    for(let key in schema){
        // console.log(key)
        for(let name in schema[key]){
            let func = fmap[name]
            let expected = schema[key][name]
            let result = func(x[key], expected)
            // console.log(x[key])
            if (!result.result){
                return `${key} ${result.message}`
            }
        }
    }
    return true
}

function main(){
    fmap = {exists: exists, min: min, max: max, int: int}

    console.log('Start validating...')
    let a = { 
        x: 5,
        y: 'hello world',
        z: 1.4
    }

    let schema = {
        x: {
            int: true,
            min: 4
        },
        y: {
            int: true
        }
    }

    console.log(validate(a,schema))
}

main()

