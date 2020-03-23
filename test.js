//COMMENT: A wrapper of request module to make simple request, (async recommended)
const request = require('request')

function __method__ (met) {
	switch (met){
		case 'get':
			return request.get;
		case 'post':
			return request.post;
		case 'put':
			return request.put;
		case 'delete':
			return request.delete;
	}
	return undefined;
}

function mkreq(options, method) {
	return new Promise((resolve, reject)=>{
		let toCall = __method__ (method) // COMMENT: Function mapping ^_^
		toCall (options, (err, res, body) => {
			
			if (err) { 
				reject(err)
				return
			}
			let parsed = null;
			try {
				parsed = JSON.parse (body)
				resolve (parsed)
			} catch (e) {
				resolve(body)
			}
		})
	})
}

async function main(){
    let result = await mkreq(
        {
            url: 'http://localhost'
        },
        'get'
    )
    console.log(result)

    result = await mkreq(
        {
            url: 'http://localhost',
            json: true,
            body: {
                int: 1,
                str: 'string',
                bool: true
            }
        },
        'post'
    )
    console.log(result)
}

main()