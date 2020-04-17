const Scheduler=require('../scheduler') 
const scheduler = new Scheduler(5) // 5 second chunk

function onTrigger(args){ //
    console.log(`Triggering triggered at: ${(new Date()).toISOString()}`)
}

scheduler.triggerAt(Date.now()/1000+2, onTrigger);
scheduler.triggerAt(Date.now()/1000+7, onTrigger);
scheduler.triggerAt(Date.now()/1000+7, onTrigger);