
/// 通过 domcument 拼接相应 字符串
function DOMtoString(document_root) {
    var loadUrl = document.URL;
    if (loadUrl.includes('csdn')) {
        removeCodeImg()
    }
    else if (loadUrl.includes('cnblogs.com')) {
        moveReleaseDataToTop()
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
        let frameStrs = frameDiv.innerText.split('\n')
        let propertyStrs = propertyDiv.innerText.split('\n')

        // x y 始终以右上角来
        let viewX = frameStrs[3].replace('pt', '')
        let viewY = frameStrs[4].replace('pt', '')
        // 宽高
        let viewWidth = frameStrs[6].replace('pt', '')
        let viewHeight = frameStrs[7].replace('pt', '')

        if (!codeStr.startsWith('代码')) {
            // UIImageView
            return `\nUIImageView *imgV = ({

                        NSString *name = @"图片名";
                        UIImage *img = [UIImage imageNamed:name];
                        UIImageView *imgV = [[UIImageView alloc] initWithImage:img];
                        [imgV sizeToFit];

                        UIView *view = contentView;
                        [view addSubview: imgV];
                        [imgV mas_makeConstraints:^(MASConstraintMaker *make) {
                            make.leading.equalTo(view).offset(${viewX});
                            make.top.equalTo(view).offset(${viewY});
                        }];
                        
                        imgV;
                    });`
        }
        else {

            if (codeStr.includes('UILabel')) {
                // UILabel
                // Medium
                let ocFontMethodName = getOCFontMethodName(propertyStrs[3])

                if(propertyStrs[4] === '对齐') {
                    // 有对齐方式
                }
                let labFontSizeStr =propertyStrs[23].replace('pt', '')
                let labStr = propertyStrs[32]
                let LabTextColorHexStr = propertyStrs[8]
                let alphaStr = propertyStrs[9]
                if (alphaStr !== "100%") {
                    alert('透明度修复')
                }
                return `\nUILabel *lab = ({

                    UILabel *lab = [UILabel new];
                    lab.text = @"${labStr}";
                    lab.font = [UIFont ${ocFontMethodName}:  ${labFontSizeStr}];
                    lab.textColor = @\"${LabTextColorHexStr}".hexColor;
                    [lab sizeToFit];

                    UIView *view = contentView;
                    [view addSubview: lab];
                    [lab mas_makeConstraints:^(MASConstraintMaker *make) {
                        make.leading.equalTo(view).offset(${viewX});
                        make.top.equalTo(view).offset(${viewY});
                    }];
        
                    lab;
                });`;
            }
            else if (codeStr.includes('UIView')) {
                // UIView

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
        ocFontMethodName = 'pFSize';
    }
    else if (labFontWeightStr === 'Medium') {
        // 中体
        ocFontMethodName = 'pFMediumSize';
    }
    else if (labFontWeightStr === 'Bold') {
        // 粗体
        ocFontMethodName = 'pFBlodSize';
    }
    else {
        // 使用系统默认的字体
        ocFontMethodName = 'systemFontOfSize';
    }
    return ocFontMethodName
}
/**
 * 移除csdn登录二维码
 */
function removeCodeImg() {
    document.getElementsByClassName('login-mark')[0].remove()
    document.getElementsByClassName('login-box')[0].remove()
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
