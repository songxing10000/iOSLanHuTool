var title;
var url;
/// 把控件认为是UIImageView
let img = document.getElementById('show_image');
/// 把控件认为是UIButton
let btn = document.getElementById('show_btn');
/// 把控件认为是UILabel
let lab = document.getElementById('show_lab');
/// 自定义属性名的输入框
let proNameInput = document.getElementById('proName');
/// 生成的代码包不包含属性引用getter方法
let showPro = document.getElementById('show_pro');

/// 把控件认为是UIView里的线
let showLine = document.getElementById('show_line');
/// 失去焦点时，替换属性名
const inputHandler = function (e) {
  let proName = e.target.value
  if (proName.length > 1) {
    if (lab.checked) {
      let oldStr = document.getElementById('message').innerText
      // replaceAll https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
      let new1 = oldStr.replaceAll('aLab', proName + 'Lab')
      document.getElementById('message').innerText = new1.replaceAll('statusLab', proName + 'Lab')
    }
    else if (btn.checked) {
      let oldStr = document.getElementById('message').innerText
      let new1 = oldStr.replaceAll('aBtn', proName + 'Btn')
      document.getElementById('message').innerText = new1.replaceAll('useBtn', proName + 'Btn')
    }
    else if (img.checked) {
      let oldStr = document.getElementById('message').innerText
      let new1 = oldStr.replaceAll('aImgV', proName + 'ImgV')
      document.getElementById('message').innerText = new1.replaceAll('bgImgV', proName + 'ImgV')
    }
    else if (showLine.checked) {
      let oldStr = document.getElementById('message').innerText
      let new1 = oldStr.replaceAll('vLine', proName + 'View')
      document.getElementById('message').innerText = new1.replaceAll('bgImgV', proName + 'ImgV')
    }
  }
}

// 监听来消息 getSource
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
    if (url.includes('cnblogs.com') || url.includes('localhost') || url.includes('pgyer.com')) {
      // 在博客完时，只是追加日期而，面板不用显示出来
      document.body.hidden = true
    }
    else if (url.includes('lanhuapp.com/web') || url.includes('app.mockplus.cn')) {
      let strs = request.source;
      // 多行 拼接 变量 ${变量名} innerText
      let op = document.getElementById('op').value;
      if (op === 'swift_code') {
        if (lab.checked) {
          /*
          24,141,320,20,识别到的字符串,fontWithName:@"PingFangSC-Medium" size,15,0x333333

          UIFont(name: "PingFangSC-Regular", size: 15)
          lab.textColor = "#4C87F1".color
          lab.textColor = "0x4C87F1".color
          */
          let colorStr = strs[7].replace('#', '')
          var swFont = strs[5].replace('" size', '')
          swFont = swFont.replace('fontWithName:@"', '')
          message.innerText = `\nlet aLab: UILabel = {
\tlet lab = UILabel()
\tlab.text = "${strs[4]}"
\tlab.textColor = "${colorStr}".color
\tlab.font = UIFont(name: "${swFont}", size: ${strs[6]})

\tview.addSubview(lab)
\tlab.snp.makeConstraints { (make) in
\t\tmake.centerX.equalToSuperview()
\t\tmake.top.equalToSuperview().offset(10)
\t}

\treturn lab
\t}()`
        }
        else if (btn.checked) {
          /*
          24,141,320,20,识别到的字符串,fontWithName:@"PingFangSC-Medium" size,15,0x333333
          */
          let colorStr = strs[7].replace('#', '')
          var swFont = strs[5].replace('" size', '')
          swFont = swFont.replace('fontWithName:@"', '')
          message.innerText = `\nlet aBtn: UIButton = {
\tlet btn = UIButton(type: .custom)
\tbtn.setTitle("${strs[4]}", for: .normal)
\tbtn.titleLabel?.font = UIFont(name: "${swFont}", size: ${strs[6]})
\tbtn.setTitleColor("${colorStr}".color, for: .normal)
\tview.addSubview(btn)
\tbtn.snp.makeConstraints { (make) in
\t\tmake.centerX.equalToSuperview()
\t\tmake.top.equalToSuperview().offset(130)
\t}
\treturn btn
\t}()`
        }
        else if (showLine.checked) {
          /*
          12,176,351,1,#F7F7F7,100
          */

          message.innerText = `\nlet aLine: UIView = {
\tlet line = UIView()
\tline.isUserInteractionEnabled = false

\tline.backgroundColor = "${strs[4]}".color(alpha: 1)
  
\tview.addSubview(line)
\tline.snp.makeConstraints { (make) in
\t\tmake.top.equalToSuperview().offset(${strs[1]})
\t\tmake.left.equalToSuperview().offset(${strs[0]})
\t\tmake.size.equalTo(CGSize(width: ${strs[2]}, height: ${strs[3]}))
\t}
\treturn line
\t}()`
        }
        else if (img.checked) {
          /*
          24,141,320,20,识别到的字符串,fontWithName:@"PingFangSC-Medium" size,15,0x333333
          */
          message.innerText = `\nlet aImgV: UIImageView = {
\tet img = UIImage(named: "imgName")
\tlet imgV = UIImageView(image: img)
\timgV.backgroundColor = .red
    
\tview.addSubview(imgV)
\timgV.snp.makeConstraints { (make) in
\t\tmake.top.equalToSuperview().offset(${strs[1]})
\t\tmake.left.equalToSuperview().offset(${strs[0]})
\t\tmake.size.equalTo(CGSize(width: ${strs[2]}, height: ${strs[3]}))
\t}
\treturn imgV
\t}()`
        }
      }
      else if (op === 'flutter') {
        // fontWithName:@\"PingFangSC-Medium\" size
        var fluterFontName = strs[5].split(' ')[0].split('@"')[1].replace('"', '');
        if (lab.checked) {
          message.innerText = `\n
\tText(
\t\t'${strs[4]}',
\t\tstyle: TextStyle(
\t\tfontFamily: '${fluterFontName}',
\t\tfontSize: 22,
\t\tcolor: Color(${strs[7]})),
\t),\n`;
          return
        }

        if (img.checked) {
          message.innerText = `\n
          Image.asset('images/ren.png'),
          \n`;
          return
        }

        if (btn.checked) {
          message.innerText = `\n
          TextButton(
\tonPressed: () {},
\tchild: Text(
\t\t'${strs[4]}',
\t\tstyle: TextStyle(
\t\tfontFamily: '${fluterFontName}',
\t\tfontSize: 22,
\t\tcolor: Color(${strs[7]})),
\t)),
          \n`;

          return
        }
      }
      else if (op === 'oc_code') {
        // 类型判断 typeof strs === 'string'
        // 以字符串开始 startsWith
        if (img.checked) {

          /*
          24,141,320,20,识别到的字符串,fontWithName:@"PingFangSC-Medium" size,15,0x333333
          */
          // 返回来的就是UIImageView
          message.innerText = `UIImageView *aImgV = ({

\tNSString *name = @"图片名";
\tUIImage *img = [UIImage imageNamed:name];
\tUIImageView *imgV = [[UIImageView alloc] initWithImage:img];
\t#ifdef DEBUG
\timgV.backgroundColor = [UIColor redColor];
\t#endif
\tUIView *superView = self.view; //self.contentView;
\t[superView addSubview: imgV];
\t[imgV mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@${strs[1]});
\t\tmake.leading.equalTo(@${strs[0]});
\t\tmake.bottom.equalTo(@0);
\t\tmake.trailing.equalTo(@0);
\t\t// make.top.equalTo(superView.mas_top).offset(${strs[1]});
\t\t// make.leading.equalTo(superView.mas_leading).offset(${strs[0]});
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);
\t\t// make.width.equalTo(@${strs[2]});
\t\t// make.height.equalTo(@${strs[3]});
\t\t// make.size.mas_equalTo(CGSizeMake(${strs[2]}, ${strs[3]}));
\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
\t}];

\timgV;
        });
        /* ---------- 引用 ---------- */
        @property(nonatomic) UIImageView *bgImgV;
        
        -(UIImageView *)bgImgV {
          if (!_bgImgV) {
\tNSString *name = @"图片名";
\tUIImage *img = [UIImage imageNamed:name];
\tUIImageView *imgV = [[UIImageView alloc] initWithImage:img];
\t#ifdef DEBUG
\timgV.backgroundColor = [UIColor redColor];
\t#endif

\t  _bgImgV = imgV;
          }
          return _bgImgV;
      }

      UIView *superView = self.view; //self.contentView;
      [superView addSubview: self.bgImgV];
\t[self.bgImgV mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@${strs[1]});
\t\tmake.leading.equalTo(@${strs[0]});
\t\tmake.bottom.equalTo(@0);
\t\tmake.trailing.equalTo(@0);
\t\t// make.top.equalTo(superView.mas_top).offset(${strs[1]});
\t\t// make.leading.equalTo(superView.mas_leading).offset(${strs[0]});
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);
\t\t// make.width.equalTo(@${strs[2]});
\t\t// make.height.equalTo(@${strs[3]});
\t\t// make.size.mas_equalTo(CGSizeMake(${strs[2]}, ${strs[3]}));
\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
      }];

        `
          return
        }
        if (lab.checked) {
          // 返回来的就是UILabel
          message.innerText = `UILabel *aLab = ({

\tUILabel *lab = [UILabel new];
\tlab.text = @"${strs[4]}";
\tlab.font = [UIFont ${strs[5]}:  ${strs[6]}];
\tlab.textColor = @\"${strs[7]}".hexColor;

\tUIView *superView = self.view; //self.contentView;
\t[superView addSubview: lab];
\t[lab mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@${strs[1]});
\t\tmake.leading.equalTo(@${strs[0]});
\t\tmake.bottom.equalTo(@0);
\t\tmake.trailing.equalTo(@0);
\t\t// make.top.equalTo(superView.mas_top).offset(${strs[1]});
\t\t// make.leading.equalTo(superView.mas_leading).offset(${strs[0]});
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);
\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
\t}];

\tlab;
});
/* ---------- 引用 ---------- */
 @property(nonatomic) UILabel *statusLab;

-(UILabel *)statusLab {
\tif (!_statusLab) {

\t\tUILabel *lab = [UILabel new];
\t\tlab.text = @"${strs[4]}";
\t\tlab.font = [UIFont ${strs[5]}:  ${strs[6]}];
\t\tlab.textColor = @\"${strs[7]}".hexColor;

\t\t_statusLab = lab;
\t}
\treturn _statusLab;
}

      
UIView *superView = self.view; //self.contentView;
[superView addSubview: self.statusLab];
[self.statusLab mas_makeConstraints:^(MASConstraintMaker *make) {
\tmake.top.equalTo(@${strs[1]});
\tmake.leading.equalTo(@${strs[0]});
\tmake.bottom.equalTo(@0);
\tmake.trailing.equalTo(@0);
\t// make.top.equalTo(superView.mas_top).offset(${strs[1]});
\t// make.leading.equalTo(superView.mas_leading).offset(${strs[0]});
\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t// make.trailing.equalTo(superView.mas_trailing).offset(0);
\t// make.width.equalTo(@${strs[2]});
\t// make.height.equalTo(@${strs[3]});
\t// make.size.mas_equalTo(CGSizeMake(${strs[2]}, ${strs[3]}));
\t// make.centerX.equalTo(@0);
\t// make.centerY.equalTo(@0);
}];
        `;
          return
        }

        if (btn.checked) {
          if (strs.length == 2) {
            // 纯图片按钮
            if (!showPro.checked) {
              message.innerText = `UIButton *aBtn = ({

\tUIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\tNSString *name = @"图片名";
\tUIImage *img = [UIImage imageNamed:name];
\t[btn setImage:img forState:UIControlStateNormal];

\tUIView *superView = self.view; //self.contentView;
\t[superView addSubview: btn];
\t[btn mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@0);
\t\tmake.leading.equalTo(@0);
\t\tmake.bottom.equalTo(@0);
\t\tmake.trailing.equalTo(@0);
\t\t//make.top.equalTo(superView.mas_top).offset(0);
\t\t//make.leading.equalTo(superView.mas_leading).offset(0);
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);
\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
\t    }];

\t\tbtn;
\t});
`


            } else {
              message.innerText =
                `
\t@property(nonatomic) UIButton *useBtn;
\t
\t-(UIButton *)useBtn {
\t  if (!_useBtn) {
\t    UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\t     NSString *name = @"图片名";
\t      UIImage *img = [UIImage imageNamed:name];
\t     [btn setImage:img forState:UIControlStateNormal];
\t       
\t    _useBtn = btn;
\t  }
\t  return _useBtn;
          }


\tUIView *superView = self.view; //self.contentView;
      [superView addSubview: self.useBtn];
      [self.useBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(@0);
\t  make.leading.equalTo(@0);
\t  make.bottom.equalTo(@0);
\t  make.trailing.equalTo(@0);
        // make.top.equalTo(superView.mas_top).offset(0);
        // make.leading.equalTo(superView.mas_leading).offset(0);
          // make.bottom.equalTo(superView.mas_bottom).offset(0);
          // make.trailing.equalTo(superView.mas_trailing).offset(0);
          // make.centerX.equalTo(@0);
          // make.centerY.equalTo(@0);
      }];
\t`
              return
            }
          }

          if (strs.length == 6 || strs.length == 7) {
            // 纯背景色按钮 // 38,543,300,44,#9A2037,100,23
            let corner = (strs.length == 7) ? `btn.layer.cornerRadius = 23;` : ''
            let configBgColorStr = configBgColor('btn', strs[4], strs[5])
            if (!showPro.checked) {
              message.innerText = `\nUIButton *aBtn = ({

\t     UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\t     ${configBgColorStr}
\t     ${corner}

\t     UIView *superView = self.view; //self.contentView;
\t     [superView addSubview: btn];
\t     [btn mas_makeConstraints:^(MASConstraintMaker *make) {
\t      make.top.equalTo(@0);
\t      make.leading.equalTo(@0);
\t      make.bottom.equalTo(@0);
\t      make.trailing.equalTo(@0);
\t      // make.top.equalTo(superView.mas_top).offset(0);
\t      // make.leading.equalTo(superView.mas_leading).offset(0);
\t       // make.bottom.equalTo(superView.mas_bottom).offset(0);
\t       // make.trailing.equalTo(superView.mas_trailing).offset(0);
\t       // make.centerX.equalTo(@0);
\t       // make.centerY.equalTo(@0);
\t     }];

\t     btn;
\t});
\t
`


            } else {
              message.innerText =

                `
\t@property(nonatomic) UIButton *useBtn;
\t
\t-(UIButton *)useBtn {
\t  if (!_useBtn) {
\t    UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\t     ${configBgColorStr}
\t     ${corner}
\t       
\t    _useBtn = btn;
\t  }
\t  return _useBtn;
          }


\tUIView *superView = self.view; //self.contentView;
      [superView addSubview: self.useBtn];
      [self.useBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(@0);
\t  make.leading.equalTo(@0);
\t  make.bottom.equalTo(@0);
\t  make.trailing.equalTo(@0);
        // make.top.equalTo(superView.mas_top).offset(0);
        // make.leading.equalTo(superView.mas_leading).offset(0);
          // make.bottom.equalTo(superView.mas_bottom).offset(0);
          // make.trailing.equalTo(superView.mas_trailing).offset(0);
          // make.centerX.equalTo(@0);
          // make.centerY.equalTo(@0);
      }];
\t`
            }
          }
          else {
            // 纯文字按钮
            //  return [viewX, viewY, viewWidth, viewHeight, labStr, ocFontMethodName, labFontSizeStr, LabTextColorHexStr]
            if (!showPro.checked) {

              message.innerText = `\nUIButton *aBtn = ({
\t     UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\t     [btn setTitle: @"${strs[4]}" forState: UIControlStateNormal];
\t     btn.titleLabel.font = [UIFont ${strs[5]}:  ${strs[6]}];
\t     [btn setTitleColor: @\"${strs[7]}".hexColor forState: UIControlStateNormal];
\t    //  NSString *name = @"图片名";
\t    //  UIImage *img = [UIImage imageNamed:name];
\t    // [btn setImage:img forState:UIControlStateNormal];
\t     UIView *superView = self.view; //self.contentView;
\t     [superView addSubview: btn];
\t     [btn mas_makeConstraints:^(MASConstraintMaker *make) {
\t      make.top.equalTo(@0);
\t      make.leading.equalTo(@0);
\t      make.bottom.equalTo(@0);
\t      make.trailing.equalTo(@0);
\t      // make.top.equalTo(superView.mas_top).offset(0);
\t      // make.leading.equalTo(superView.mas_leading).offset(0);
\t    // make.bottom.equalTo(superView.mas_bottom).offset(0);
\t    // make.trailing.equalTo(superView.mas_trailing).offset(0);
\t    // make.centerX.equalTo(@0);
\t    // make.centerY.equalTo(@0);
\t     }];

\t     btn;
\t});
\t
`

            } else {
              message.innerText =
                `
\t@property(nonatomic) UIButton *useBtn;
\t
\t-(UIButton *)useBtn {
\t  if (!_useBtn) {
\t    UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\t     [btn setTitle: @"${strs[4]}" forState: UIControlStateNormal];
\t     btn.titleLabel.font = [UIFont ${strs[5]}:  ${strs[6]}];
\t     [btn setTitleColor: @\"${strs[7]}".hexColor forState: UIControlStateNormal];
\t    //  NSString *name = @"图片名";
\t    //  UIImage *img = [UIImage imageNamed:name];
\t    // [btn setImage:img forState:UIControlStateNormal];
\t       
\t    _useBtn = btn;
\t  }
\t  return _useBtn;
          }


\tUIView *superView = self.view; //self.contentView;
      [superView addSubview: self.useBtn];
      [self.useBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(@0);
\t  make.leading.equalTo(@0);
\t  make.bottom.equalTo(@0);
\t  make.trailing.equalTo(@0);
        // make.top.equalTo(superView.mas_top).offset(0);
        // make.leading.equalTo(superView.mas_leading).offset(0);
          // make.bottom.equalTo(superView.mas_bottom).offset(0);
          // make.trailing.equalTo(superView.mas_trailing).offset(0);
          // make.centerX.equalTo(@0);
          // make.centerY.equalTo(@0);
      }];
\t`
            }
          }

        }
        else if (showLine.checked) {

          // 圆角
          let cornerStgr = (strs.length >= 7) ? `line.layer.cornerRadius = ${strs[6]};` : ''

          let configBgColorStr = configBgColor('line', strs[4], strs[5])


          message.innerText = `\nUIView *vLine = ({
        
\t  CGRect frame = CGRectMake(${strs[0]}, ${strs[1]}, ${strs[2]}, ${strs[3]});
\t  UIView *line = [[UIView alloc] initWithFrame: frame];
\t  line.userInteractionEnabled = NO;
\t  ${configBgColorStr}
\t  ${cornerStgr}

\t  UIView *superView = self.view; //self.contentView;
\t  [superView addSubview: line];
\t  [line mas_makeConstraints:^(MASConstraintMaker *make) {
\t    make.top.equalTo(@${strs[1]});
\t  make.leading.equalTo(@${strs[0]});
\t  make.bottom.equalTo(@0);
\t  make.trailing.equalTo(@0);
\t  //   make.top.equalTo(superView.mas_top).offset(${strs[1]});
\t  // make.leading.equalTo(superView.mas_leading).offset(${strs[0]});
\t    // make.bottom.equalTo(superView.mas_bottom).offset(0);
\t    // make.trailing.equalTo(superView.mas_trailing).offset(0);
\t    // make.width.equalTo(@${strs[2]});
\t    // make.height.equalTo(@${strs[3]});
\t    // make.size.mas_equalTo(CGSizeMake(${strs[2]}, ${strs[3]}));
\t    // make.centerX.equalTo(@0);
\t    // make.centerY.equalTo(@0);
\t  }];
\t  
\t  line;
          });`
        }
      }

    }
    else {
      message.innerText = request.source;
    }
  }
});
/**
 * 设置背景色
 * @param {String} varName 变量名如, line btn lab
 * @param {String} hexColorStr 十六进制色的字符串如，#9A2037
 * @param {Number} alphaStr 透明度 100 70
 */
function configBgColor(varName, hexColorStr, alphaStr) {
  // 透明度
  let returnCodeStr = `${varName}.backgroundColor = @"${hexColorStr}".hexColor;`
  if (alphaStr / 100 != 1) {
    // 透明度         
    returnCodeStr = `${varName}.backgroundColor = [@"${hexColorStr}".hexColor colorWithAlphaComponent: ${alphaStr / 100.0}];`
  }
  return returnCodeStr
}
function onWindowLoad() {

  // 获取 popup.html里的元素进行字符串设定
  var message = document.querySelector('#message');
  // 获取 当前选择的tab的title 和 url
  chrome.tabs.getSelected(null, function (tab) {//获取当前tab
    title = tab.title;
    url = tab.url;
  });
  // 注入脚本，接收错误回显
  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function () {
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
  proNameInput.addEventListener('blur', inputHandler);
}
// 窗口载入时使用自己的载入函数
window.onload = onWindowLoad;

/// 新加面板
document.addEventListener('DOMContentLoaded', function () {
  // 默认配置
  var defaultConfig = { 'op': 'oc_code', 'ocCode': 'btn', 'isShowPro': false };
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  chrome.storage.sync.get(defaultConfig, function (items) {
    document.getElementById('op').value = items.op;
    let ocCodeStr = items.ocCode;
    if (ocCodeStr === 'img') {
      img.checked = true;
    } else if (ocCodeStr === 'btn') {
      btn.checked = true;
    } else if (ocCodeStr === 'lab') {
      lab.checked = true;
    } else if (ocCodeStr === 'line') {
      showLine.checked = true;
    }
    showPro.checked = (items.isShowPro === 'true');
    // 同步自定义属性名输入框的显示与隐藏
    proNameInput.hidden = !showPro.checked
  });
});
// 复制代码事件
document.getElementById('copyCode').addEventListener('click', function () {

  let codeStr = document.getElementById('message').innerText;
  copyStr(codeStr)

});
/// 复制字符串到粘贴板
function copyStr(str) {
  // 复制字符串到粘贴板 http://www.voidcn.com/article/p-effxpdwn-buc.html
  var input = document.createElement('textarea');
  document.body.appendChild(input);
  input.value = str;
  input.focus();
  input.select();
  document.execCommand('Copy');
  input.remove();
}
// 保存配置事件
document.getElementById('save').addEventListener('click', function () {
  let op = document.getElementById('op').value;
  let ocCodeStr = '';
  if (img.checked) {
    ocCodeStr = 'img';
  }
  else if (btn.checked) {
    ocCodeStr = 'btn';
  }
  else if (lab.checked) {
    ocCodeStr = 'lab';
  }
  else if (showLine.checked) {
    ocCodeStr = 'line';
  }
  let showProStr = showPro.checked ? "true" : "false"
  let saveDict = {
    op: op,
    ocCode: ocCodeStr,
    isShowPro: showProStr
  };
  chrome.storage.sync.set(saveDict, function () {
    document.getElementById('status').textContent = '保存成功！';
    setTimeout(() => { document.getElementById('status').textContent = ''; }, 800);
  });
});

// checked 事件互斥

img.addEventListener('change', function () {
  btn.checked = false;
  lab.checked = false;
  showLine.checked = false;
});
document.getElementById('show_btn').addEventListener('change', function () {
  img.checked = false;
  lab.checked = false;
  showLine.checked = false;
});
document.getElementById('show_lab').addEventListener('change', function () {
  img.checked = false;
  btn.checked = false;
  showLine.checked = false;
});
document.getElementById('show_line').addEventListener('change', function () {
  img.checked = false;
  btn.checked = false;
  lab.checked = false;
});
// 属性引用打钩事件
document.getElementById('show_pro').addEventListener('change', function (e) {
  proNameInput.hidden = !showPro.checked;
});