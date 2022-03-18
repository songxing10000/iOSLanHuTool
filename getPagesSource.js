
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
        let rgbas = propertyStrs.filter(str => str.includes('RGBA'))
        let rgbaStrs = []
        if (rgbas.length > 0) {
            rgbaStrs = rgbas[0].replace('RGBA', '').split(', ')
        } else {
            propertyDiv = document.getElementsByClassName('annotation_item')[2]
            propertyStrs = propertyDiv.innerText.split('\n')
            rgbas = propertyStrs.filter(str => str.includes('RGBA'))
            if (rgbas.length > 0) {
                rgbaStrs = rgbas[0].replace('RGBA', '').split(', ')
            }
            
        }
        
        if(rgbaStrs.length >= 4) {
            returnObj.r = rgbaStrs[0]
            returnObj.g = rgbaStrs[1]
            returnObj.b = rgbaStrs[2]
            returnObj.a = rgbaStrs[3]
        } else {
            // alert('获取rgba异常')
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
                returnCodeStr = returnCodeStr.replaceAll('DINAlternate', 'DINAlternate-Bold')
                returnCodeStr = returnCodeStr.replaceAll('DIN Alternate Bold', 'DINAlternate-Bold')
                returnCodeStr = returnCodeStr.replaceAll('PingFang SC-Bold', 'PingFangSC-Semibold')
                returnCodeStr = returnCodeStr.replaceAll('PingFang SC-Regular', 'PingFangSC-Regular')
                returnCodeStr = returnCodeStr.replaceAll('苹方 粗体', 'PingFangSC-Semibold')
                returnCodeStr = returnCodeStr.replaceAll('苹方 中等', 'PingFangSC-Medium')
                

                
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
            fontName = fontName.replaceAll('PingFang SC-Bold', 'PingFangSC-Semibold')
            fontName = fontName.replaceAll('PingFang SC-Regular', 'PingFangSC-Regular')
            fontName = fontName.replaceAll('苹方 粗体', 'PingFangSC-Semibold')
            fontName = fontName.replaceAll('苹方 中等', 'PingFangSC-Medium')
            // UILabel的alpha基本没见过不是1的这里直接写死1
            if (returnObj.a != 0) {
                // 不改变之前的
            } else {
                returnObj.a = 1
            }
            
            returnObj.text = propertyStrs[propertyStrs.indexOf('内容')+1]
            returnObj.fontName = fontName
            returnObj.fontSize = propertyStrs[propertyStrs.indexOf('字号')+1].replace('pt', '')
            returnObj.hexColor = propertyStrs.filter(str => str.includes('#') && str.includes('%'))[0]
            return returnObj
        }
        if (codeStr.includes('UIView')) {

            
            if (propertyStrs[0] === '颜色') {
                returnObj.hexColor = propertyStrs.filter(str => str.includes('#') && str.includes('%'))[0]
                return returnObj
            } 
            else  if (propertyStrs[0] === '中心边框') {
                /*
                中心边框,粗细,0.5pt,#000000 10%,HEX,,HEX#000000,,AHEX#1A000000,,HEXA#0000001A,,RGBA0, 0, 0, 0.1,,HSLA0, 0%, 0%, 0.1
                */
               if (returnObj.height == 0) {
                   returnObj.height = propertyStrs[propertyStrs.indexOf('粗细')+1].replace('pt', '')
                   returnObj.hexColor = propertyStrs.filter(str => str.includes('#') && str.includes('%'))[0]

               }
            }
           
            else {
                
                alert('未知类型' + propertyStrs[0])
            }
        }
        else {
            alert('这是2啥类型')
            return returnObj
        }

    }

    return "未处理的url";
}
function getReturnObj() {
    // frame面板
    let frameDiv = document.getElementsByClassName('annotation_item')[0]
    let frameStrs = frameDiv.innerText.split('\n')
    // x,y
    let postIdx = frameStrs.indexOf('位置')
    let x = frameStrs[postIdx+1].replaceAll('pt', '')
    let y = frameStrs[postIdx+2].replaceAll('pt', '')
    let sizeIdx = frameStrs.indexOf('大小')
    // w,h
    let width = frameStrs[sizeIdx+1].replaceAll('pt', '')
    let height = frameStrs[sizeIdx+2].replaceAll('pt', '')

    // corner
    let corner = '0'
    let cornerIdx = frameStrs.indexOf('圆角')
    if (cornerIdx >= 0) {
        // 有圆角
        corner = frameStrs[cornerIdx+1].replaceAll('pt', '')
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
