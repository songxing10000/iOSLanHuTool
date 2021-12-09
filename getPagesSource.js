
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
        // 图片 文字 bgview

        // frame面板
        let frameDiv = document.getElementsByClassName('annotation_item')[0]
        // 属性面板
        let propertyDiv = document.getElementsByClassName('annotation_item')[1]
        // 代码面板
        let codeDiv = document.getElementsByClassName('annotation_item')[2]
        let codeStr = codeDiv.innerText
        let codeStrs = codeStr.split('\n')
        if(codeStr.includes('外阴影')) {
            codeStr = document.getElementsByClassName('annotation_item')[3].innerText
        }
        let frameStrs = frameDiv.innerText.split('\n')
        let propertyStrs = propertyDiv.innerText.split('\n')

        // x y 始终以右上角来
        let viewX = frameStrs[3].replace('pt', '')
        let viewY = frameStrs[4].replace('pt', '')
        // 宽高
        let viewWidth = frameStrs[6].replace('pt', '')
        let viewHeight = frameStrs[7].replace('pt', '')
        if (viewX === "位置" && viewWidth === "大小") {
            // alert(frameStrs)// 样式信息,图层,矩形,位置,12pt,176pt,大小,351pt,1pt,不透明度,100%
            viewX = frameStrs[4].replace('pt', '')
            viewY = frameStrs[5].replace('pt', '')
            viewWidth = frameStrs[7].replace('pt', '')
            viewHeight = frameStrs[8].replace('pt', '')
        }
        
        
        if (!codeStr.startsWith('代码')) {
           
            // UIImageView
            return [viewX, viewY]
        }
        else {
            if (codeStr.includes('UILabel')) {
                
                // UILabel
                // Medium
                let ocFontMethodName = getOCFontMethodName(propertyStrs[3])
                if(propertyStrs[1] === "DIN Alternate Bold") {
                    ocFontMethodName = 'fontWithName:@"DINAlternate-Bold" size';
                }
                if(propertyStrs[4] === '对齐') {
                    // 有对齐方式
                }
                let labFontSizeStr =propertyStrs[23].replace('pt', '')
                if (labFontSizeStr === '0') {
                    // 新版蓝湖
                    labFontSizeStr =propertyStrs[21].replace('pt', '')
                }

                var labStr = ''
                if (propertyStrs.length < 33) {
                    labStr = propertyStrs[30]
                } else {

                    labStr = propertyStrs[32]
                }
                
                // document.getElementsByClassName('item_one item_content')[0].textContent
                let LabTextColorHexStr = propertyStrs[8]
                if(LabTextColorHexStr === 'HEX'){
                    // "AHEX#FF333333"转换为
                    // flutter用的 Color(0xff273A62)
                    // 0xff273A62
                    // 这里先不返回FF，给原生用
                    LabTextColorHexStr = propertyStrs[12].replace('AHEX#FF', '0x')
                }
                // let alphaStr = propertyStrs[9]
                // if (alphaStr.length > 0) {
                //     if (alphaStr !== "100%") {
                //         alert('透明度修复' + alphaStr)
                //     }
                // } else {
                //     alert('未找到透明度修复')
                // }
                
                return [viewX, viewY, viewWidth, viewHeight, labStr, ocFontMethodName, labFontSizeStr, LabTextColorHexStr]
            }
            else if (codeStr.includes('UIView')) {
                // UIView
                /*
                UIView *view = [[UIView alloc] init];
                view.frame = CGRectMake(38,543,300,44);

                view.layer.backgroundColor = [UIColor colorWithRed:154/255.0 green:32/255.0 blue:55/255.0 alpha:1.0].CGColor;
                view.layer.cornerRadius = 23;

                */
                if (propertyStrs[0] === '颜色') {
                    // #9A2037
                    let hexColor = propertyStrs[1]
                    
                    if (hexColor.includes(" 100%")) {
                        hexColor = hexColor.replace(' 100%', '')
                    }
                    //  100
                    let alphaStr = propertyStrs[2].replace('%', '')
                    if (alphaStr === "HEX") {
                        alphaStr = 100
                    }
                    let hasCorner = frameDiv.innerText.includes('圆角')
                    if (hasCorner) {
                        let corner = frameStrs[frameStrs.indexOf('圆角') + 1].replace('pt', '')
                        return [viewX, viewY, viewWidth, viewHeight, hexColor, alphaStr, corner]
                    }
                    return [viewX, viewY, viewWidth, viewHeight, hexColor, alphaStr]
                } else {
                    alert('未知类型' + propertyStrs[0])
                }
                
            }
            else {
                alert('未知类型' + codeStr)
            }
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
        alert()
        // 粗体
        ocFontMethodName = 'fontWithName:@"PingFangSC-Semibold" size';
    }
    else {
        // 使用系统默认的字体
        ocFontMethodName = 'systemFontOfSize';
    }
    return ocFontMethodName
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
