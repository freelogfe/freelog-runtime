function go(promise, errorProps = {}, errorFirst = true) {
    return promise.then((data) => {
        return errorFirst ? [null, data] : [data, null]
    }).catch(err => {
        if (errorProps) Object.assign(err, errorProps)
        return errorFirst ? [err, null] : [null, err]
    })
}

module.exports = go;