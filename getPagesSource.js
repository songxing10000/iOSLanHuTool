
/// 通过 domcument 拼接相应 字符串
function DOMtoString(document_root) {
    var loadUrl = document.URL;
    if (loadUrl.includes('lanhuapp.com/web')) {
        // 蓝湖
        let alphaStrs = document.getElementsByClassName('annotation_item')[0].innerText.split('\n');
        // UI外观
        let UIAppearStrs = document.getElementsByClassName('annotation_item')[1].innerText.split('\n');
        // 代码 
        let objcCodeStrs = document.getElementsByClassName('annotation_item')[2].innerText;
        let cornerStr = '';
        if (alphaStrs.length == 12) {
            // 有圆角
            let cornerObj = alphaStrs[13];
            if (typeof (cornerObj) != "undefined" && cornerObj.includes('pt')) {
                cornerStr = cornerObj.replace('pt', '');
            }

            if (UIAppearStrs.length == 14) {
                // uiview
                let bgColor = UIAppearStrs[1];
                // 10%
                let bgColorAlpha = UIAppearStrs[2];
                if (bgColorAlpha !== '100%') {
                    bgColorAlpha = '0.' + bgColorAlpha.replace('0%', '');

                    return ['', '', '', bgColor, cornerStr]
                }
                // 字 字体 字号 字色 圆角
                return ['', '', '', bgColor, cornerStr]
            } else if (UIAppearStrs.length == 17) {
                // 按钮边框
                let borderWidth = UIAppearStrs[2].replace('pt', '');
                let borderColor = UIAppearStrs[4];
                // 10%
                let borderColorAlpha = UIAppearStrs[5];
                if (borderColorAlpha !== '100%') {
                    borderColorAlpha = '0.' + bgColorAlpha.replace('0%', '');

                    return 'view.layer.backgroundColor = [[UIColor colorWithHexString: @\"' + borderColor + '\"] colorWithAlphaComponent: ' + borderColorAlpha + '].CGColor;\n' +
                        'view.layer.borderWidth = ' + borderWidth + ';\n' +
                        'view.layer.cornerRadius = ' + cornerStr + ';';
                }
                return 'view.layer.borderColor = [UIColor colorWithHexString: @\"' + borderColor + '\"].CGColor;\n' +
                    'view.layer.borderWidth = ' + borderWidth + ';\n' +
                    'view.layer.cornerRadius = ' + cornerStr + ';';
            }
        }

        // 位置面板中的透明度 
        let alphaStr = '';
        if (typeof (alphaStrs[9]) != "undefined") {
            if (alphaStrs[9] !== '100%') {
                // 需求设置透明度 一般是 60% 30%
                alphaStr = '0.' + alphaStrs[9].replace('0%', '');
            }
        }
        if (alphaStrs.length <= 0) {
            return '未选中控件'
        }
        // 位置面板中的 label 文字
        var labStr = alphaStrs[1].replace('\n', '');;



        // "苹方-简 中黑体"
        let labFontStr = UIAppearStrs[1];
        // Medium
        let labFontWeightStr = UIAppearStrs[3];
        let LabTextColorHexStr = '';
        let textColorStrObj = UIAppearStrs[11];
        if (typeof (textColorStrObj) != "undefined") {

            LabTextColorHexStr = textColorStrObj.replace('HEX', '');
        }
        if (LabTextColorHexStr === '' || !LabTextColorHexStr.startsWith("#")) {

            if (typeof (document.getElementsByClassName('mu-dropDown-menu-text-overflow')[1]) != "undefined") {
                if (document.getElementsByClassName('mu-dropDown-menu-text-overflow')[1].innerText === 'PNG') {
                    
                    let str = document.getElementsByClassName('annotation_container lanhu_scrollbar flag-pl')[0].getElementsByClassName('annotation_item')[0].innerText;
                    let strs = str.split('\n')
                    let imgX = strs[3].replace('pt','')
                    let imgY = strs[4].replace('pt','')
                    return `\nUIImageView *imgV = ({

                                NSString *name = @"支付课程图";
                                UIImage *img = [UIImage imageNamed:name];
                                UIImageView *imgV = [[UIImageView alloc] initWithImage:img];
                                [imgV sizeToFit];

                                UIView *view = contentView;
                                [view addSubview: imgV];
                                [imgV mas_makeConstraints:^(MASConstraintMaker *make) {
                                    make.leading.equalTo(view).offset(${imgX});
                                    make.top.equalTo(view).offset(${imgY});
                                }];
                                
                                imgV;
                            });`

                } else {
                    // 这里是啥
                }
            }

            if (LabTextColorHexStr.includes('RGB')) {
                // RGBA233, 236, 245, 1 转换 十六进制
                // #E9ECF5
                LabTextColorHexStr = document.getElementsByClassName('color_hex')[0].innerText
                // 100%
                // let colorAlphaStr = pdocument.getElementsByClassName('color_opacity')[0].innerText
            }
        }

        let labFontSizeStr = '12';
        let fontSizeStrObj = UIAppearStrs[22];
        if (typeof (fontSizeStrObj) != "undefined") {
            labFontSizeStr = fontSizeStrObj.replace('pt', '');
            let labStr2 = '';
            if (UIAppearStrs[29] != "undefined") {
                labStr2 = UIAppearStrs[29].replace('\n', '');
            }


            if (labStr2.length > labStr.length) {
                // 有富文本
                labStr = labStr2;
            }
        }
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
        return [labStr, ocFontMethodName, labFontSizeStr, LabTextColorHexStr];

    }
    else if (loadUrl.includes('app.mockplus.cn')) {
        let destView = document.getElementsByClassName('property-panel-wrap property-panel-text-info')


        if (typeof (destView) != "undefined" && destView.length > 0) {

            let infoStrs = destView[0].innerText.split('\n')

            /// 字的内容
            let text = infoStrs[3]
            // PingFangSC
            let font = infoStrs[5]
            // 20px
            let fontSize = infoStrs[7].replace('px', '').replace('pt', '')
            // Regular
            let labFontWeightStr = infoStrs[9]
            // #161616
            let textColor = infoStrs[20]
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
            return [text, ocFontMethodName, fontSize, textColor]
        }
    }
    else if (loadUrl.includes('csdn')) {
        removeCodeImg()
    }
    else if (loadUrl.includes('cnblogs.com')) {
        moveReleaseDataToTop()
    }
    return "未处理的url";
}

function removeCodeImg() {
    // 移除csdn登录二维码
    document.getElementsByClassName('login-mark')[0].remove()
    document.getElementsByClassName('login-box')[0].remove()
}
/// 把博客园的博客的发布日期放标题上来
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
