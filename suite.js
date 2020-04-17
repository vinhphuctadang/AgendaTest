const Agenda = require('Agenda')
const Scheduler = require('./modules/scheduler/scheduler')
const scheduler = new Scheduler(1) // interval = 1 // mean there is a timer running every 1 second

const agenda = new Agenda(
    {
        db: {address: 'mongodb://localhost:27017/test', collection: 'agendaJobs',
          options: {useNewUrlParser: true, useUnifiedTopology: true, autoReconnect: false, reconnectTries: false, reconnectInterval: false}}
    }
);

const db = require('mongoose')
const Product = db.model('Product',{ // sample db model for testing
    key: String,
    expire: Number
})

db.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true})

let TIME = 15 // time in second
let NUMBER_OF_PRODUCT = 100

async function clear(){
    try{
        await Product.collection.drop('Product')
    }catch(e){
        console.log('No Product collection to clear...')
    }
}

async function init(interval){
    agenda.processEvery(interval)
    await agenda.start()
    agenda.define('stuff', 
    async (job, done)=>{
        let _id = job.attrs.data
        let log = await Product.deleteOne({_id: _id})
        console.log(log)
        done()
    })
    await clear()
}

async function done(){
    agenda.done()
}

function randomKey(){
    let s = "0x"+Math.ceil(Math.random()*10e16)
    return s
}

function randomTime(){ // in 2 minutes 
    let result = Math.round(Math.random()*TIME)
    return result
}

async function with_agenda(){
    await init('1 second') // agenda init
    await clear() // clear db

    let marked = Date.now()
    for(let i = 0; i<NUMBER_OF_PRODUCT; ++i){

        let expire = parseInt(Date.now()/1000)+randomTime()
        let p = {
            key : randomKey(),
            expire : expire
        }

        let product = new Product(p)
        product.save()
        console.log(`Fake data added. Delete in the next ${expire-parseInt(Date.now()/1000)} second`)

        await agenda.schedule(expire*1000, 'stuff', product._id)
    }
    console.log(`Add product and scheduled in ${Date.now()-marked} ms`)
}

async function with_agenda_and_scheduler(){
    await init(`${TIME} seconds`)
    await clear()
    let count = 0
    for(let i = 0; i<NUMBER_OF_PRODUCT; ++i){
        let expire = parseInt(Date.now()/1000)+randomTime()
        let p = {
            key : randomKey(),
            expire : expire
        }

        let product = new Product(p)
        // console.log(`Fake data added. Delete in the next ${expire-parseInt(Date.now()/1000)} second(s)`)
        product.save()
    
        
        await scheduler.triggerAt(expire, async(args)=>{
            console.log('Triggered for ', ++count,'time(s)')
            let result = await Product.deleteMany({
                expire: {$lt: parseInt(Date.now()/1000)+1}
            })
        }, {})
    }
}



async function main(){
    let choice = 1
    if (process.argv[3] != undefined) {
        choice = process.argv[3]
    }

    let func = null
    switch(choice) {
        case 1:
            console.log(`Test with agenda job scheduler, in ${TIME} seconds`)
            func = with_agenda
            break
        case 2:
            console.log(`Test with agenda job scheduler, in ${TIME} seconds`)
            func = with_agenda_and_scheduler
            break
    }
    func()
}

main()