/**
 * 
 * @param origin model
 * @param data wait to compare with model
 * @param diff  if only reserve difference set
 * delete the data's keys while they are (not) exist in origin
 */
export function compareObjects(origin:any, data:any, diff = false) {
    let otype = Object.prototype.toString.call(origin)
    let dtype = Object.prototype.toString.call(data)
    if (dtype === otype && otype === '[object Array]') {
        origin = { 0: origin }
        data = { 0: data }
    } else if (otype !== dtype || otype !== '[object Object]') {
        !['[object Array]', '[object object]'].includes(otype) && console.error(origin + ' is not object or array');
        !['[object Array]', '[object object]'].includes(dtype) && console.error(data + ' is not object or array');
        return
    }
    Object.keys(data).forEach((dkey) => {
        // depend on whether diff
        let isDelete = !diff
        Object.keys(origin).some((okey) => {
            if (dkey === okey) {
                isDelete = !isDelete
                if (diff) {
                    return true
                }
                let otype = Object.prototype.toString.call(origin[okey])
                let dtype = Object.prototype.toString.call(data[dkey])
                    // loop if they are object the same time 
                if (otype === dtype && dtype === '[object Object]') {
                    compareObjects(origin[okey], data[dkey], diff)
                } else if (otype === dtype && dtype === '[object Array]' && Object.prototype.toString.call(origin[dkey][0]) === '[object Object]') {
                    // if they are array the same time and origin[dkey][0] is object, 
                    data[dkey].forEach((item:any) => {
                        Object.prototype.toString.call(item) === '[object Array]' && compareObjects(origin[okey][0], item, diff)
                    })
                }
                return true
            }
            return false
        });
        isDelete && delete data[dkey]
    })
}
