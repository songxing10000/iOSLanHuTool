
/**
 * 只把首字母进行大写，其余字字符串不改变之前的大小写样式
 * @param {string} str 
 */
function upperCaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);

}
/**
 * 只把首字母进行小写，其余字字符串不改变之前的大小写样式
 * @param {string} str 
 */
function lowerCaseFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);

}

/// 通过 domcument 拼接相应 字符串
function DOMtoString(document_root) {
    var loadUrl = document.URL;
    if (loadUrl.includes('translate.google.cn') ||
        loadUrl.includes('fanyi.baidu.com') ||
        loadUrl.includes('fanyi.youdao.com')) {
        /// 考虑  's  Guarantor's vehicle information, guarantor's real estate information
        /// 谷歌翻译处理
        /// 待翻译的字符串
        var willTranslateStr = '';
        if (loadUrl.includes('translate.google.cn')) {
            // 谷歌翻译
            willTranslateStr = document.getElementsByClassName('text-dummy')[0].innerHTML
        } else if (loadUrl.includes('fanyi.baidu.com')) {
            // 百度翻译
            // document.getElementsByClassName('ordinary-output source-output')[1].innerText
            let willTranslateArr = document.getElementsByClassName("ordinary-output source-output");
            for (let index = 0; index < willTranslateArr.length; index++) {
                let desStr = willTranslateArr[index].innerText;
                if (desStr.length > 0) {
                    willTranslateStr += desStr + '\n';
                }
            }
        } else if (loadUrl.includes('fanyi.youdao.com')) {
            willTranslateStr = document.getElementsByClassName('input__original__area')[0].innerHTML
        }
        /// 翻译后的字符串 ,如  Daily trend chart
        var translatedStr = ''
        if (loadUrl.includes('translate.google.cn')) {
            // 谷歌翻译
            translatedStr = document.getElementsByClassName('tlid-translation translation')[0].innerText;
        } else if (loadUrl.includes('fanyi.baidu.com')) {
            // 百度翻译
            // document.getElementsByClassName('ordinary-output target-output clearfix')[1].innerText
            let translatedArr = document.getElementsByClassName("ordinary-output target-output clearfix");
            for (let index = 0; index < translatedArr.length; index++) {
                let desStr = translatedArr[index].innerText;
                if(desStr.length > 0) {

                    translatedStr += desStr + '\n';
                }
            }

        } else if (loadUrl.includes('fanyi.youdao.com')) {
            translatedStr = document.getElementsByClassName('input__target__text')[0].innerText
        }
        // return  willTranslateStr + '\n' +  translatedStr;
        if (willTranslateStr.indexOf("\n") >= 0) {
            // 多个单词 如，Daily trend chart, monthly trend chart
            let willTranslateArray = willTranslateStr.split("\n")
            //translatedArray有道翻译后是这样的         Today,,,Tomorrow,
            if (translatedStr.indexOf(",") >= 0) {
                // 可能是有道翻译
                // //去除换行 https://www.cnblogs.com/konghou/p/3819029.html
                translatedStr = translatedStr.replace(/<\/?.+?>/g,""); 
                translatedStr = translatedStr.replace(/[\r\n]/g, ""); 
                translatedStr = translatedStr.replace(',', "\n"); 

            }
            let translatedArray = translatedStr.split("\n")
            willTranslateArray = willTranslateArray.filter(item => item != '' )

            // translatedArray有可能是     day,,Late at night
            translatedArray = translatedArray.filter(item => item != '' )
            let str = ''
            for (let index = 0; index < willTranslateArray.length; index++) {
                const willTranslate = willTranslateArray[index];
                let translated = translatedArray[index];
                str += '\"' + willTranslate + '\"' + '=' + '\"' + translated.replace(',', '') + '\";\n'
            }
            return str
        }
        // 一个单词 如，Daily trend chart

        return '\"' + willTranslateStr + '\"' + '=' + '\"' + translatedStr + '\";'
    }
    /// 根据网页抓取property
    return "未处理的url";
}

// 注入脚本时，自动发送消息getSource，调用DOMtoString方法给返回值
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});