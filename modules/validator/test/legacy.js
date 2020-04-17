const assert = require('assert')
const Validator = require('../validator')

describe('Validator test',async()=>{
    it('should returns not oke: invalid postID', ()=>{
        let req = {
            postID: '12ab1',
            alias: 'mynameisfalse'
        }

        let result = Validator.validate(req,{postID:{mongoID: true}, alias:{regex:/^[a-z0-9._]{3,30}$/}})
        console.log(result)
        assert.notEqual(result,true)
    })
    it('should returns not oke: Not a valid name', ()=>{
        let req = {
            postID: '111111111111111111111111',
            alias: '>mynameisfalse'
        }

        let result = Validator.validate(req,{postID:{mongoID: true}, alias:{regex:/^[a-z0-9._]{3,30}$/}})
        console.log(result)
        assert.notEqual(result,true)
    })

    it('should returns ok: bio field exists or not does not matter', ()=>{
        let req = {
            postID: '111111111111111111111111',
            alias: 'mynameisfalse'
        }

        let result = Validator.validate(req,{postID:{mongoID: true}, alias:{regex:/^[a-z0-9._]{3,30}$/}, $bio: {min: 5}})
        console.log(result)
        assert.equal(result,true)
    })
    it('should returns NOT ok: bio field NEEDed', ()=>{
        let req = {
            postID: '111111111111111111111111',
            alias: 'mynameisfalse'
        }

        let result = Validator.validate(req,{postID:{mongoID: true}, alias:{regex:/^[a-z0-9._]{3,30}$/}, bio: {min: 5}})
        console.log(result)
        assert.notEqual(result,true)
    })
    it('should returns NOT ok: bio field NEEDed and min length must be satisfied', ()=>{
        let req = {
            postID: '111111111111111111111111',
            alias: 'mynameisfalse',
            bio: 'not'
        }
        let result = Validator.validate(req,{postID:{mongoID: true}, alias:{regex:/^[a-z0-9._]{3,30}$/}, bio: {min: 5}})
        console.log(result)
        assert.notEqual(result,true)
    })
})