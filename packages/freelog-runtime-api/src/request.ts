import axios from 'axios'


axios.interceptors.request.use(
        config => {
            return config
        },
        error => {
            console.error(error) // for debug 11
            Promise.reject(error)
        }
    )
    // response 拦截器
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        console.error(error) // for debug 11
    }
)
export default axios