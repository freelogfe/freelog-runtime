let http = require('./http');
let resolveBook = require('../cheerio/book');
let config = require('../config.json');
async function getBook(data) {
    let url = `${config.bookApi}/${data.bid}`
    console.log(url)
    let result = await http({method:'get',url})
    result = resolveBook(result.data)
    return result
}
module.exports = getBook