
/// 通过 domcument 拼接相应 字符串
function DOMtoString(document_root) {
    var loadUrl = document.URL;
    if (loadUrl.includes('cnblogs.com')) {
        moveReleaseDataToTop()
    }
    else if (loadUrl.includes('91hiwork')) {
        return 'fix ' + document.getElementsByClassName('editable-field inactive')[0].innerText + ' ' + loadUrl
    }
    else if (loadUrl.includes('pgyer.com')) {

        let div = document.getElementsByClassName('span12 gray-text')[1]
        let versionDiv = document.getElementsByTagName('li')[0]
        versionDiv.innerText = versionDiv.innerText.split('(')[0]
        div.append(versionDiv)
        let desDiv = document.getElementsByClassName('tag-box margin-bottom-40')[0]
        div.append(desDiv)
    }
    else if (loadUrl.includes('lanhuapp.com/web')) {

        // 属性面板
        let propertyDiv = document.getElementsByClassName('annotation_item')[1]
        let propertyStrs = propertyDiv.innerText.split('\n')
        /** 
        *初始返回对象
        */
        let returnObj = getReturnObj()
        let rgbaStrs = propertyStrs.filter(str => str.includes('RGBA'))[0].replace('RGBA', '').split(', ')
        if(rgbaStrs.length >= 4) {
            returnObj.r = rgbaStrs[0]
            returnObj.g = rgbaStrs[1]
            returnObj.b = rgbaStrs[2]
            returnObj.a = rgbaStrs[3]
        } else {
            alert('获取rgba异常')
        }
        // 代码面板
        let codeDivs = document.getElementsByClassName(' language-c')
        if (typeof codeDivs === 'undefined' || codeDivs.length <= 0) {
            // 切图可下载
            return returnObj
        }
        let codeStr = codeDivs[0].innerText
        if (codeStr.includes('UIImageView')) {
            return returnObj
        }
        if (codeStr.includes('UILabel')) {
            /** 
            * 大于两个NSMutableAttributedString才算是富文本
            * 获取字符串中特定串的个数
            * https://stackoverflow.com/questions/881085/count-the-number-of-occurrences-of-a-character-in-a-string-in-javascript?rq=1
            */
            let isAttStr = (codeStr.match(/NSMutableAttributedString/g) || []).length > 2 || codeStr.includes('addAttributes')
            if (isAttStr) {
                let returnCodeStr = codeStr.replaceAll('苹方-简 常规体', 'PingFangSC-Regular')
                returnCodeStr = returnCodeStr.replaceAll('苹方-简 中黑体', 'PingFangSC-Medium')
                returnCodeStr = returnCodeStr.replaceAll('苹方-简 中粗体', 'PingFangSC-Semibold')
                returnCodeStr = returnCodeStr.replaceAll('PingFangSC', 'PingFangSC-Regular')
                returnCodeStr = returnCodeStr.replaceAll('DIN Alternate Bold', 'DINAlternate-Bold')
                returnCodeStr = returnCodeStr.replaceAll('DINAlternate', 'DINAlternate-Bold')
                returnObj.returnCodeStr = returnCodeStr
                return returnObj
            }
            let fontName =  propertyStrs[propertyStrs.indexOf('字体')+1]
            fontName = fontName.replaceAll('苹方-简 常规体', 'PingFangSC-Regular')
            fontName = fontName.replaceAll('苹方-简 中黑体', 'PingFangSC-Medium')
            fontName = fontName.replaceAll('苹方-简 中粗体', 'PingFangSC-Semibold')
            // DINAlternate 或者 DIN Alternate Bold 变换到OC里的 @"DINAlternate-Bold"
            fontName = fontName.replaceAll('DINAlternate', 'DINAlternate-Bold')
            fontName = fontName.replaceAll('DIN Alternate Bold', 'DINAlternate-Bold')
            // UILabel的alpha基本没见过不是1的这里直接写死1
            returnObj.a = 1
            returnObj.text = propertyStrs[propertyStrs.indexOf('内容')+1]
            returnObj.fontName = fontName
            returnObj.fontSize = propertyStrs[propertyStrs.indexOf('字号')+1].replace('pt', '')
            returnObj.hexColor = propertyStrs.filter(str => str.includes('#') && str.includes('%'))[0]
            return returnObj
        }
        if (codeStr.includes('UIView')) {

            if (propertyStrs[0] === '颜色') {
                // #333333 50%
                // #FFFFFF 100%
                returnObj.hexColor = propertyStrs[1]
                return returnObj
            } else {
                alert('未知类型' + propertyStrs[0])
            }
        }
        else {
            alert('这是啥类型')
            return returnObj
        }

    }

    return "未处理的url";
}

/**
 * 得到oc字号方法名，
 * @param {String} labFontWeightStr 字重Regular、Medium、Bold
 */
function getOCFontMethodName(labFontWeightStr) {
    //  Medium Bold
    let ocFontMethodName = 'pFSize';
    if (labFontWeightStr === 'Regular') {
        // 粗体
        ocFontMethodName = 'fontWithName:@"PingFangSC-Regular" size';
    }
    else if (labFontWeightStr === 'Medium') {
        // 中体
        ocFontMethodName = 'fontWithName:@"PingFangSC-Medium" size';
    }
    else if (labFontWeightStr === 'Bold') {
        // 粗体
        ocFontMethodName = 'fontWithName:@"PingFangSC-Semibold" size';
    }
    else {
        // 使用系统默认的字体
        ocFontMethodName = 'systemFontOfSize';
    }
    return ocFontMethodName
}
function getReturnObj() {
    // frame面板
    let frameDiv = document.getElementsByClassName('annotation_item')[0]
    let frameStrs = frameDiv.innerText.split('\n').filter(str => str.includes('pt')).map(str => str.replaceAll('pt', ''))
    let x = ''
    let y = ''
    let width = ''
    let height = ''
    let corner = '0'
    if (frameStrs.length >= 4) {
        x = frameStrs[0]
        y = frameStrs[1]
        width = frameStrs[2]
        height = frameStrs[3]
    }
    if (frameStrs.length >= 5) {
        corner = frameStrs[4]
        if (corner.includes('  ')) {
            // 288,52,87,24,12  0  0  12  
            // 暂不考虑不是四个角圆角的 
            corner = corner.split('  ').filter(str => parseInt(str) > 0)[0]
        }
    }
    // tip 键与值相同，可以简写
    return { x, y, width, height, corner }
}
/**
 * 把博客园的博客的发布日期放标题上来
 */
function moveReleaseDataToTop() {
    let titleElement = document.getElementById('cb_post_title_url')
    let dateElement = document.getElementById('post-date')
    let title = titleElement.innerText
    titleElement.innerText = title + ' 发布日期：' + dateElement.innerText
}
// 注入脚本时，自动发送消息getSource，调用DOMtoString方法给返回值
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
