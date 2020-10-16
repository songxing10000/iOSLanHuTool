
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
                if (desStr.length > 0) {

                    translatedStr += desStr + '\n';
                }
            }

        } else if (loadUrl.includes('fanyi.youdao.com')) {
            translatedStr = document.getElementsByClassName('input__target__text')[0].innerText
        }
        // return  willTranslateStr + '\n' +  translatedStr;
            // 多个单词 如，Daily trend chart, monthly trend chart
            let willTranslateArray = willTranslateStr.split("\n")
            //translatedArray有道翻译后是这样的         Today,,,Tomorrow,
            // if (translatedStr.indexOf(",") >= 0) {
            // 可能是有道翻译
            // //去除换行 https://www.cnblogs.com/konghou/p/3819029.html
            // translatedStr = translatedStr.replace(/<\/?.+?>/g, "");
            // translatedStr = translatedStr.replace(/[\r\n]/g, "");
            // translatedStr = translatedStr.replace(',', "\n");
            // }
            let translatedArray = translatedStr.split("\n")
            willTranslateArray = willTranslateArray.filter(item => item != '')

            // translatedArray有可能是     day,,Late at night
            translatedArray = translatedArray.filter(item => item != '')
            let dict = {};
            for (let index = 0; index < willTranslateArray.length; index++) {
                const willTranslate = willTranslateArray[index];
                let translated = translatedArray[index];
                dict[willTranslate]=translated.replace(',', '');
            }
            return dict
    }
    else if (loadUrl.includes('222.128.2.40:11199')) {
        let loginBtns = document.getElementsByClassName('btn');
        if (loginBtns.length > 0) {
            loginBtns[0].click();
        } else {
            document.getElementById('svpn_name').value = 'songxing';
            document.getElementById('svpn_password').value = 'hp?PGUKgj?rE';
            document.getElementById('logButton').click();
        }
    }

    else if (loadUrl.includes('lanhuapp.com/web')) {
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
            if (typeof(cornerObj) != "undefined" && cornerObj.indexOf('pt') >= 0) {
                cornerStr = cornerObj.replace('pt', '');
            }
            
            if (UIAppearStrs.length == 14) {
                // uiview
                let bgColor = UIAppearStrs[1];
                // 10%
                let bgColorAlpha = UIAppearStrs[2];
                if (bgColorAlpha !== '100%') {
                    bgColorAlpha = '0.' + bgColorAlpha.replace('0%', '');

                    return 'view.layer.backgroundColor = [[UIColor colorWithHexString: @\"' + bgColor + '\"] colorWithAlphaComponent: ' + bgColorAlpha + '].CGColor;\n' +
                        'view.layer.cornerRadius = ' + cornerStr + ';';
                }
                return 'view.layer.backgroundColor = [UIColor colorWithHexString: @\"' + bgColor + '\"].CGColor;\n' +
                    'view.layer.cornerRadius = ' + cornerStr + ';';
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
        // 位置面板中的 label 文字
        var labStr = alphaStrs[1].replace('\n', '');;



        // "苹方-简 中黑体"
        let labFontStr = UIAppearStrs[1];
        // Medium
        let labFontWeightStr = UIAppearStrs[3];
        // #212733
        let LabTextColorHexStr = '';
        let textColorStrObj = UIAppearStrs[11];
        if (typeof (textColorStrObj) != "undefined") {

            LabTextColorHexStr = textColorStrObj.replace('HEX', '');
        }
        if (LabTextColorHexStr === '' || !LabTextColorHexStr.startsWith("#")) {
            if (typeof (document.getElementsByClassName('mu-dropDown-menu-text-overflow')[1]) != "undefined") {
                if (document.getElementsByClassName('mu-dropDown-menu-text-overflow')[1].innerText === 'PNG') {
                    return '\
                    UIImage *img = [UIImage imageNamed: [NSString homeFastBuyIcon]];\n\
                    UIImageView *imgV = [[UIImageView alloc] initWithImage:img];\n\
                    [self.view addSubview: imgV];\n\
                    [imgV sizeToFit];\n\
                    imgV.right = 16;\n\
                    imgV.top = 16;\n\
                    ';

                } else {
                    // 这里是啥
                }
            }
        }
        

        let labFontSizeStr = '12';
        let fontSizeStrObj = UIAppearStrs[22];
        if (typeof (fontSizeStrObj) != "undefined") {
            labFontSizeStr = fontSizeStrObj.replace('pt', '');
            let labStr2 = '';
            if(UIAppearStrs[29] != "undefined") {
                labStr2 = UIAppearStrs[29].replace('\n', '');
            }
                

            if (labStr2.length > labStr.length) {
                // 有富文本
                labStr = labStr2;
            }
        }
        
        if (labFontWeightStr === 'Medium') {
            if (LabTextColorHexStr === '#212733') {
                return 'UILabel *lab =\n' +
                    '[UILabel labFont:[UIFont PingFangSCMediumSize: ' + labFontSizeStr + '] text: @\"' + labStr + '\" color:[UIColor day212733_nightFFFFFF]];\n' +
                    '[contentView addSubview: lab];';
            }
            return 'UILabel *lab =\n' +
                '[UILabel labFont:[UIFont PingFangSCMediumSize: ' + labFontSizeStr + '] text: @\"' + labStr + '\" color:[UIColor colorWithHexString:@\"' + LabTextColorHexStr + '\"];\n' +
                '[contentView addSubview: lab];';
        }
        if (LabTextColorHexStr === '#212733') {
            return 'UILabel *lab =\n' +
                '[UILabel labFont:[UIFont PingFangSCRegularSize: ' + labFontSizeStr + '] text: @\"' + labStr + '\" color:[UIColor day212733_nightFFFFFF]];\n' +
                '[contentView addSubview: lab];';
        }
        return 'UILabel *lab =\n' +
            '[UILabel text: @\"' + labStr + '\" font: [UIFont pFBlodSize: ' + labFontSizeStr + ']  textColorStr: @\"' + LabTextColorHexStr + '\"];\n' +
            '[contentView addSubview: lab];';
    }
    else if (loadUrl.indexOf('zentao/bug') >= 0 ) {
        var bugTitle = document.getElementsByClassName('text')[0].innerText
        let strs = bugTitle.split('】')
        if(strs.length > 1) {
            bugTitle = strs[1]
        } else {
            bugTitle = strs[0]
        }
        return 'fix ' + loadUrl + ' ' + bugTitle;
    }
    else if (loadUrl.indexOf('/merge_requests/new') >= 0) {
        /// 提交代码时 ，自动抓提交记录文字
        var msgs = document.getElementsByClassName('commit-row-message');

        var msgStrs = []
        for (i = 0; i < msgs.length; i++) {
            var msgStr = document.getElementsByClassName('commit-row-message')[i].innerText;
            if (msgStr != 'Merge branch \'master\' of ') {
                msgStrs.push(msgStr)
            }
        }
        var des = msgStrs.join('、')
        document.getElementById('merge_request_title').innerText = des;
        document.getElementById('merge_request_description').innerText = des;
        document.getElementById('merge_request_title').value = des;
        document.getElementById('merge_request_description').value = des;
        return ''
    } 
    else if (loadUrl.indexOf('csdn') >= 0) {
        // 移除csdn登录二维码
        document.getElementsByClassName('login-mark')[0].remove()
        document.getElementsByClassName('login-box')[0].remove()
    }
    else {
        // https://www.showdoc.cc/mingmiao?page_id=4089639825709213
        let returnStr = '';

        let des = document.getElementsByClassName('main-editor markdown-body editormd-html-preview')[0].innerText.split('\n')[4]
        returnStr += '/// ' + des + '\n';
        returnStr += '/// 文档地址：' + loadUrl + '\n';
        // 取表格
        let tableStr = document.getElementById("editor-md").getElementsByTagName('table')[0].getElementsByTagName('tbody')[0].innerText;

        ///   /// @param pageNum     否    string    默认1
        let arrStrs = tableStr.split('\n');
        for (let arrStr of arrStrs) {
            returnStr += ' /// @param ' + arrStr + '\n ';
        }

        returnStr += '+ (void)  ';
        for (let arrStr of arrStrs) {
            let strs = arrStr.split('\t');
            let name = strs[0];
            let type = strs[2];
            /// 可空
            let nullStr = strs[1];
            if (nullStr === '否') {
                nullStr = 'nullable ';
            } else if (nullStr === '是') {
                nullStr = 'nonnull ';
            }
            if (type === 'string') {
                type = 'NSString *';
            } else if (type === 'int') {
                type = 'NSUInteger';
                nullStr = '';
            }
            returnStr += name + ':' + '(' + nullStr + type + ')' + name + '   ';
        }
        // success:(nullable successBlock)success failure:(failureBlock)failure;
        returnStr += ' success:(nullable successBlock)success failure:(failureBlock)failure {';

        let inUrls = document.getElementsByClassName('main-editor markdown-body editormd-html-preview')[0].innerText.split('\n')[8]

        // "http://dev.jingletong.com/api/user/address"
        returnStr += '\n\nNSString * urlStr = @\"' + inUrls.split('.com/')[1] + '\";\n';
        /**
         * NSMutableDictionary *muDict = @{}.mutableCopy;
         *   [muDict safeAddKey:@"recordId" value:recordId];
         */
        let canEmptyArr = [];
        let noEmptyArr = [];
        for (let arrStr of arrStrs) {
            let strs = arrStr.split('\t');
            let canEmpty = strs[1];
            if (canEmpty === '否') {
                canEmptyArr.push(arrStr);
            } else {
                noEmptyArr.push(arrStr);
            }
        }
        returnStr += 'NSMutableDictionary *muDict = @{}.mutableCopy;\n';
        for (let canEmptyStr of canEmptyArr) {
            let strs = canEmptyStr.split('\t');
            let name = strs[0];
            returnStr += '[muDict safeAddKey:@"' + name + '" value:' + name + '];\n';
        }



        /*
       addressName	否	string	收货地址别名
        prov	是	string	省
        city	是	string	市
        area	是	string	区 /县
        street	否	string	街道
        detail	是	string	详细地址
        contactName	是	string	联系人名称
        contactPhone	是	string	联系人电话
       */
        /* NSDictionary *dict = @{@"pageNum": @(MAX(1, pageNum)).stringValue,
                              @"pageSize": @(MAX(1, pageSize)).stringValue};
                              */

        returnStr += '\nNSDictionary *dict = @{\n';

        for (let index = 0; index < noEmptyArr.length; index++) {
            const arrStr = noEmptyArr[index];
            let strs = arrStr.split('\t');
            let name = strs[0];
            if (index == noEmptyArr.length - 1) {
                returnStr += '@\"' + name + '\": ' + name + '};\n\n\n';
            } else {
                returnStr += '@\"' + name + '\": ' + name + ',\n';
            }

        }
        //        [muDict addEntriesFromDictionary:dict];
        returnStr += '[muDict addEntriesFromDictionary:dict];\n';
        let methodStr = document.getElementsByClassName('main-editor markdown-body editormd-html-preview')[0].innerText.split('\n')[12]
        if (methodStr === 'POST') {
            returnStr += '[self requestUrlStr:urlStr dict:muDict method:MARequestMethodPOST success:success failure:failure];\n}'
        } else {
            returnStr += '[self requestUrlStr:urlStr dict:muDict method:MARequestMethodGET success:success failure:failure];\n}'
        }

        return returnStr;


    }
    /// 根据网页抓取property
    return "未处理的url";
}

// 注入脚本时，自动发送消息getSource，调用DOMtoString方法给返回值
chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});
