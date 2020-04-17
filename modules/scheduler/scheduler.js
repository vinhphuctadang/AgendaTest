/**
 * Timer stragegy:
 * 
 * 1. Use agenda to schedule the task: Every date collecting keys that needs to be revoked (1 db) + 1 extra db query of agenda
 * 2. Use artifical timer pool to schedule task to revoke key: divide a day into time-chunks so that expired key could be withdraw at the specified chunk
 * For key revocation/notifications
 *  No matter how much key/nofti we have, if we made timechunk be 5 minutes, there always 288 interval a day at max (or 144 if chunks have 10-min length)
 *  Save more db storage as key increase 
 */
class Scheduler {
	/**
	 * Init scheduler with a specific chunk length for a day timer tasks
	 * @param {Integer} chunk 
	 */
	constructor(chunk = 5*60, period = 86400){
		this.ADAY = period
		this.TimeChunksManager = new Array(parseInt(this.ADAY/chunk)).fill(0)
		this.chunk = chunk // in second
	}
	/**
	 * TriggerTimerPool(expireDate,func)
	 *    will automatically fire Function 'func' when expireDate comes (in appropriate time chunk)
	 *    this function is not promisingly fired at exact time but invoking depends on SETTING.TIMECHUNK
	 *    use this 'Timer pool' when some work needs to start at an unexpected time and save interval triggering times
	 * @param {Date} expireDate: Date type, but to second precison (not milisecond)
	 * @param {Function()} func: Callback that should fire when appropriate time comes
	 * @param {Map} args: Arguments that are passed into Function 'func'
	 * returns None
	 */
	triggerAt(expDate,func,args){ 
		let TimeChunksManager = this.TimeChunksManager
		// triggered time pool will exists
		let date =    new Date()
		date.setHours(0,0,0,0) // 00:00AM this day
		let distance = parseInt(expDate-parseInt(date/1000))
		if (distance>this.ADAY)
		return // this will be collected in another day

		let whichChunk = parseInt(Math.ceil(distance/this.chunk))// make this chunk start up if it haven't
		let at = new Date(date.getTime()+whichChunk*this.chunk*1000)
		if(at-Date.now()<0)
			return false // already run

		if(!TimeChunksManager[whichChunk]){
			TimeChunksManager[whichChunk] = setTimeout(func,at-Date.now(),args)
			return true
		}
		return false
	}
	clear(){
		let TimeChunksManager = this.TimeChunksManager
		// console.log(TimeChunksManager)
		for(let index in TimeChunksManager)
      		if (TimeChunksManager[index]) clearTimeout(TimeChunksManager[index])
	}
}

// scheduler.clear()
module.exports = Scheduler