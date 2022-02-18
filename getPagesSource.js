
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
    

        
        

        // 代码面板
        let codeDivs = document.getElementsByClassName(' language-c')
        
        if(typeof codeDivs === 'undefined' || codeDivs.length <= 0) {
            // 切图可下载
            // tip 键与值相同，可以简写
            return {x,y,width,height,corner}
        }
        let codeStr = codeDivs[0].innerText
        if (codeStr.includes('UIImageView')) {
            return {x,y,width,height,corner}
        }
        else if (codeStr.includes('UILabel')) {
            /** 
            * 大于两个NSMutableAttributedString才算是富文本
            * 获取字符串中特定串的个数
            * https://stackoverflow.com/questions/881085/count-the-number-of-occurrences-of-a-character-in-a-string-in-javascript?rq=1
            */
            let isAttStr = (codeStr.match(/NSMutableAttributedString/g) || []).length > 2 || codeStr.includes('addAttributes')
            if (isAttStr) {
                // 1.PingFangSC 2.苹方-简 常规体
                /*
                3.
                苹方-简 常规体
                PingFangSC-Regular
                苹方-简 极细体
                PingFangSC-Ultralight
                苹方-简 细体
                PingFangSC-Light
                苹方-简 纤细体
                PingFangSC-Thin
                苹方-简 中黑体
                PingFangSC-Medium
                苹方-简 中粗体
                PingFangSC-Semibold 
                */
                /*
                js 全部替换
                var str = '2016-09-19';
                var result = str.replace(/-/g,'');
                */
                let returnCodeStr = codeStr.replace(/苹方-简 常规体/g, 'PingFangSC-Regular')
                returnCodeStr = returnCodeStr.replace(/苹方-简 中黑体/g, 'PingFangSC-Medium')
                returnCodeStr = returnCodeStr.replace(/苹方-简 中粗体/g, 'PingFangSC-Semibold')
                returnCodeStr = returnCodeStr.replace(/PingFangSC/g, 'PingFangSC-Regular')
                return {x,y,width,height,corner,returnCodeStr}
            }
            // UILabel
            // Medium
            let ocFontMethodName = getOCFontMethodName(propertyStrs[3])
            if (propertyStrs[1] === "DIN Alternate Bold") {
                ocFontMethodName = 'fontWithName:@"DINAlternate-Bold" size';
            }
            let labFontSizeStr = codeStr.match(/ size: (\S*)],/)[1]
            let labText = codeStr.match(/initWithString:@"(\S*)"attributes/)[1]
            let hexColor = propertyStrs.filter(str => str.includes('#')&&str.includes('%'))[0]
            let UIColorStr = hexToUIColor(propertyStrs[12], 1)
            return {x, y, width, height, alpha:1,labText, ocFontMethodName, labFontSizeStr, UIColorStr, hexColor}
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
                // #333333 50%
                // #FFFFFF 100%
                
                
                let hexColors = propertyStrs[1].split(' ')
                let hexColor = ''
                let alpha = '1'
                if(hexColors.length > 1){
                    hexColor = hexColors[0]
                    alpha = parseInt(hexColors[1]) / 100.0
                } else {
                    alert("获取颜色错误")
                }
                let UIColorStr = hexToUIColor(hexColor, alpha)
                return {x, y, width, height, hexColor:propertyStrs[1], alpha, corner, UIColorStr}
            } else {
                alert('未知类型' + propertyStrs[0])
            }

        }
        else {
            alert('这是啥类型')
            return {x,y,width,height,corner}
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
/*
 #999999 => [UIColor colorWithRed:153/255.0 green:153/255.0 blue:153/255.0 alpha:1.0]
*/
function hexToUIColor(hexStr, alphaStr) {
    var hex = hexStr.replace('AHEX#FF', '#');
    var red = parseInt(hex[1] + hex[2], 16);
    var green = parseInt(hex[3] + hex[4], 16);
    var blue = parseInt(hex[5] + hex[6], 16);
    return `[UIColor colorWithRed:${red}/255.0 green:${green}/255.0 blue:${blue}/255.0 alpha:${alphaStr}]`
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
