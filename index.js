const Scheduler=require('./scheduler') // 5 second chunk
const scheduler = new Scheduler(5)
scheduler.triggerAt(Date.now()/1000+2,(args)=>{console.log(args);},{toPrint:'hello world'});
scheduler.triggerAt(Date.now()/1000+7,(args)=>{console.log(args);},{toPrint:'HELL world'});
