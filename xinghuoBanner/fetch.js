function fetchGet(url, params) {
    if (params) {
        let paramsArray = [];
        //拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        console.log(1);
        if (url.search(/\?/) === -1) {
            console.log(1);
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    //fetch请求
    return fetch(url, {
        method: 'GET',
    })
        .then((response) => response.json())
    // .then((json) => {
    //     console.log("fetch" + JSON.stringify(json));
    //     // this.setState({ discounts: json.data })
    // })
    // .catch((error) => {
    //     alert(error)
    // })
}


const Service = {
    LOG(data = {}, config = {}) {

        return axios.post('/spm/burydata',
            data,
            {
                baseURL: getBaseUrlObj(data).newBuryUrl,
                headers: {
                    utrace: getUuidv4(),
                },
                ...config,
            })
    },
    // 查询星火配置
    QUERY_STAR_FIRE_CONF(data = {}, config = {}) {
        // debugger
        return fetchGet(`https://ingateway-test.19ego.cn/gaoyang/rpOnlReceiptGeneralMulitService/dx/1.0/adBill`, data)
    },
}
export default Service