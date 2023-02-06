import { terminal, getNetWorkType, getBrowser } from './utils/common.js'
import { getUuidv4 } from './utils/common.js'

const config = {
    dev: {
        env: 'dev',
        xinghuoURL: 'https://ingateway-dev.19ego.cn',
        newBuryUrl: 'http://spm.dev.gyjxwh.com',
        fuyaoUrl: 'https://luna-app-api-dev.gyjxwh.com',
    },
    test: {
        env: 'test',
        xinghuoURL: 'https://ingateway-test.19ego.cn',
        newBuryUrl: 'https://spm-sit.gyjxwh.com',
        fuyaoUrl: 'https://luna-app-api-sit.gyjxwh.com',
    },
    prod: {
        env: 'prod',
        xinghuoURL: 'https://ingateway-hx.19ego.cn',
        newBuryUrl: 'https://spm.iyoudui.com',
        fuyaoUrl: 'https://luna.iyoudui.com',
    }
}

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

}
const getBaseUrlObj = (data = {}) => {
    const env = (data && data.env) ? data.env : 'prod'
    const baseURLObj = config[env]
    return baseURLObj
}


// // 埋点接口-通用
// export const maidianCommon = ({ uid, appId = '', appVerion = '', channel = 'self', spm, other = {}, ...params }) => {
//     const { userAgent } = navigator
//     // 标志H5为必传参数
//     const newParams = {
//         app_id: appId, // H5,海星id，✨外传，✅
//         app_ver: appVerion, // H5,海星version，✨外传，✅
//         uid, // H5,用户id，✨外传，✅
//         // tenant_code: '', // 非必传,H5，商户code
//         spm_value: spm || params.spm_value, // H5,埋点值， 兼容之前的写法，✅
//         action: '', // H5,动作类型，✅
//         spm_time: new Date().getTime(), // H5,触发时间，✅
//         resource_spm: spm || params.resource_spm || params.spm_value, // 非必传,H5，访问来源spm
//         mobile: terminal(), // H5-非必传，客户端机型信息，✅
//         browser: getBrowser().browser, // H5,客户端浏览器信息，✅
//         browser_core: getBrowser().engine, // H5,浏览器内核，✅
//         channel, // H5,渠道，✅
//         // channel2: '', //  H5-非必传,二级渠道
//         // guideVersion: '', // H5-非必传。小程序版本号
//         // portraitCode: '',// H5,开通页的ab测试，标识码
//         device_brand: '', // TODO-H5,设备品牌，暂时为空✅
//         device_model: '', // TODO-H5,设备型号，暂时为空✅
//         network: getNetWorkType(), // H5，网络情况，通过UA识别 分 5g/4g/3g/wifi/unknow等，✅
//         // os: getBrowser().os, // H5，非必传,操作系统
//         // os_version: getBrowser().version, // H5，非必传,操作系统版本
//         uri: window.location.href, // H5,当前页面路径（绝对路径），✅
//         user_agent: userAgent, // H5,User-Agent，✅
//         other: JSON.stringify(other), // H5，可空
//         ...params,
//         events: params.events ? JSON.stringify(params.events) : '', // 事件json字符串
//     }
//     console.log('埋点接口*****入参', newParams)

//     return Service.LOG(
//         newParams
//     )
// }


const Service = {
    LOG({ uid, appId = '', appVerion = '', channel = 'self', spm, other = {}, ...params }) {
        console.log(params);
        const _url = getBaseUrlObj(params)
        const { userAgent } = navigator
        const newParams = {
            app_id: appId, // H5,海星id，✨外传，✅
            app_ver: appVerion, // H5,海星version，✨外传，✅
            uid, // H5,用户id，✨外传，✅
            // tenant_code: '', // 非必传,H5，商户code
            spm_value: spm || params.spm_value, // H5,埋点值， 兼容之前的写法，✅
            action: '', // H5,动作类型，✅
            spm_time: new Date().getTime(), // H5,触发时间，✅
            resource_spm: spm || params.resource_spm || params.spm_value, // 非必传,H5，访问来源spm
            mobile: terminal(), // H5-非必传，客户端机型信息，✅
            browser: getBrowser().browser, // H5,客户端浏览器信息，✅
            browser_core: getBrowser().engine, // H5,浏览器内核，✅
            channel, // H5,渠道，✅
            // channel2: '', //  H5-非必传,二级渠道
            // guideVersion: '', // H5-非必传。小程序版本号
            // portraitCode: '',// H5,开通页的ab测试，标识码
            device_brand: '', // TODO-H5,设备品牌，暂时为空✅
            device_model: '', // TODO-H5,设备型号，暂时为空✅
            network: getNetWorkType(), // H5，网络情况，通过UA识别 分 5g/4g/3g/wifi/unknow等，✅
            // os: getBrowser().os, // H5，非必传,操作系统
            // os_version: getBrowser().version, // H5，非必传,操作系统版本
            uri: window.location.href, // H5,当前页面路径（绝对路径），✅
            user_agent: userAgent, // H5,User-Agent，✅
            other: JSON.stringify(other) || {}, // H5，可空
            ...params,
            events: params.events ? JSON.stringify(params.events) : '', // 事件json字符串
        }
        return fetch(`${_url.newBuryUrl}/spm/burydata`, {
            method: 'POST',
            body: JSON.stringify(newParams),
            headers: {
                utrace: getUuidv4(),
            }
        }).then(function (response) {
            response.json()
        })
        // axios.post('/spm/burydata',
        //     data,
        //     {
        //         baseURL: getBaseUrlObj(data).newBuryUrl,
        //         headers: {
        //             utrace: getUuidv4(),
        //         },
        //         ...config,
        //     })
    },
    // 查询星火配置
    QUERY_STAR_FIRE_CONF(data = {}, config = {}) {
        const _url = getBaseUrlObj(data)
        // debugger
        return fetchGet(`${_url.xinghuoURL}/gaoyang/rpOnlReceiptGeneralMulitService/${data.projectType}/1.0/adBill`, data)
    },
}
export default Service