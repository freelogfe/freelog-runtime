export const DEV_TYPE_FALSE= 0
export const DEV_WIDGET = 1
export const DEV_TYPE_REPLACE = 2
export function dev():any{
    const paramsArray = window.location.search.split('?')[1].split('&')
    const params:any = {}
    paramsArray.forEach(item=>{
        params[item.split('=')[0]] = item.split('=')[1]
    })
    if(!params.dev){
      return {type: DEV_TYPE_FALSE}
    }
    if(params.dev.toLowerCase() === 'replace'){
        return {type: DEV_TYPE_REPLACE, params}
    }
    return {type: DEV_WIDGET, params}
}