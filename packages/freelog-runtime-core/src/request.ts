import axios from 'axios'


axios.interceptors.request.use(
    (        config: any) => {
            return config
        },
    (        error: any) => {
            console.error(error) // for debug 11
            Promise.reject(error)
        }
    )
    // response 拦截器
axios.interceptors.response.use(
    (    response: any) => {
        return response
    },
    (    error: any) => {
        console.error(error) // for debug 11
    }
)
export default axios