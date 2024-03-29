
var savedRequest;

// 让你的代码高亮后支持换行 1.brPlugin 2.hljs.addPlugin(brPlugin);
const brPlugin = {
  "before:highlightBlock": ({ block }) => {
    block.innerHTML = block.innerHTML.replace(/\n/g, '').replace(/<br[ /]*>/g, '\n');
  },
  "after:highlightBlock": ({ result }) => {
    result.value = result.value.replace(/\n/g, "<br>");
  }
};
hljs.addPlugin(brPlugin);


/**
 * 把控件认为是UIImageView
*/
let img = document.getElementById('show_image');
/**
 * 把控件认为是UIButton
 */
let btn = document.getElementById('show_btn');
/**
 * 把控件认为是UILabel
 */
let lab = document.getElementById('show_lab');
/**
 * 自定义属性名的输入框
 */
let proNameInput = document.getElementById('proName');

/**
 * 生成的代码包不包含属性引用getter方法
 */
let showPro = document.getElementById('show_pro');
/**
 * 把控件认为是UIView里的线
 */
let showLine = document.getElementById('show_line');
/**
 * 显示代码
 */
let msgDiv = document.getElementById('message')

/**
 * 语言选择
 */
let language_select_element = document.getElementById('op')

/**
 * 失去焦点时，替换属性名
 */
const inputHandler = function (e) {
  let proName = e.target.value
  if (proName.length > 1) {
    let oldStr = msgDiv.innerText
    if (lab.checked) {
      // replaceAll https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
      let new1 = oldStr.replaceAll('aLab', proName + 'Lab')
      msgDiv.innerText = new1.replaceAll('statusLab', proName + 'Lab')
    }
    else if (btn.checked) {
      let new1 = oldStr.replaceAll('aBtn', proName + 'Btn')
      msgDiv.innerText = new1.replaceAll('useBtn', proName + 'Btn')
    }
    else if (img.checked) {
      let new1 = oldStr.replaceAll('aImgV', proName + 'ImgV')
      msgDiv.innerText = new1.replaceAll('bgImgV', proName + 'ImgV')
    }
    else if (showLine.checked) {
      let new1 = oldStr.replaceAll('vLine', proName + 'View')
      msgDiv.innerText = new1.replaceAll('bgImgV', proName + 'ImgV')
    }
    hljs.highlightAll()

  }
}

// 监听来消息 getSource
chrome.runtime.onMessage.addListener(function (request, sender) {

  let url = sender.tab.url;
  if (request.action != "getSource") {
    return
  }

  if (url.includes('cnblogs.com') || url.includes('localhost') || url.includes('pgyer.com')) {
    // 在博客完时，只是追加日期而，面板不用显示出来
    document.body.hidden = true
    return
  }
  if (url.includes('lanhuapp.com/web') || url.includes('app.mockplus.cn')) {
    savedRequest = request;
    processCodeOutput(request)
    return
  }
  // 其他情况直接显示返回的
  message.innerText = request.source;

}
);
/**
 * 刷新代码区域
 * @param    参数request
 */
function processCodeOutput(request) {
  let returnObj = request.source;
  if(typeof returnObj === 'undefined') {
    // 没有选中某个元素

    // 显示下载xib文件按钮
    document.getElementById("downloadXibFile").style.display="";

    message.innerText = JSON.stringify(savedData);
    msgDiv.className = 'language-json'
    hljs.highlightAll()
    return
  }
  // 隐藏下载xib文件按钮
  document.getElementById("downloadXibFile").style.display="none";



    // 多行 拼接 变量 ${变量名} innerText
    let op = language_select_element.value;
    if (op === 'swift') {
      msgDiv.className = 'language-swift'

      let hexColor = returnObj.hexColor
      // 默认使用系统的
      let textColorCode = `UIColor(red: ${returnObj.r}/255.0, green: ${returnObj.g}/255.0, blue: ${returnObj.b}/255.0, alpha: ${returnObj.a})`
      if (typeof hexColor !== 'undefined') {
        // 使用三方库SwiftHEXColors的方式
        /*
        输入 #4784F4 100%
        输出1
        lab.textColor = UIColor(hex: 0x4784F4) 
        输出2
        lab.textColor = UIColor(hex: 0x4784f4, alpha:1)
        */
        let hex = hexColor.split(' ')[0].replaceAll('#', '')
        let alp = hexColor.split(' ')[1].replaceAll('%', '') / 100.0
        if (hexColor.includes('100%')) {
          textColorCode = `UIColor(hex: 0x${hex})`
        } else {
          textColorCode = `UIColor(hex: 0x${hex}, alpha:${alp})`
        }
      }


      if (lab.checked) {

      




        message.innerText = `\nlet aLab: UILabel = {
\tlet lab = UILabel()
\tlab.text = "${returnObj.text}"
\t// ${returnObj.hexColor}
\tlab.textColor = ${textColorCode}
\tlab.font = UIFont(name: "${returnObj.fontName}", size: ${returnObj.fontSize})
\tlab.translatesAutoresizingMaskIntoConstraints = false
\tview.addSubview(lab)
\tlab.snp.makeConstraints { (make) in
\t\tmake.centerX.equalToSuperview()
\t\tmake.top.equalToSuperview().offset(10)
\t}


\treturn lab
\t}()`
        
        hljs.highlightAll()
        return
      }

      if (btn.checked) {
        message.innerText = `\nlet aBtn: UIButton = {
\tlet btn = UIButton(type: .custom)
\tbtn.setTitle("${returnObj.text}", for: .normal)
\tbtn.titleLabel?.font = UIFont(name: "${returnObj.fontName}", size: ${returnObj.fontSize})
\tbtn.translatesAutoresizingMaskIntoConstraints = false
\t// ${returnObj.hexColor}
\tbtn.setTitleColor(${textColorCode}), for: .normal)
\tview.addSubview(btn)
\tbtn.snp.makeConstraints { (make) in
\t\tmake.centerX.equalToSuperview()
\t\tmake.top.equalToSuperview().offset(130)
\t}
\treturn btn
\t}()`
hljs.highlightAll()

        return
      }

      if (showLine.checked) {
        /*
        12,176,351,1,#F7F7F7,100
        */

        message.innerText = `\nlet aLine: UIView = {
\tlet line = UIView()
\tline.isUserInteractionEnabled = false
\tline.translatesAutoresizingMaskIntoConstraints = false
\tline.backgroundColor = ${textColorCode}
\tview.addSubview(line)
\tline.snp.makeConstraints { (make) in
\t\tmake.top.equalToSuperview().offset(${returnObj.y})
\t\tmake.left.equalToSuperview().offset(${returnObj.x})
\t\tmake.size.equalTo(CGSize(width: ${returnObj.width}, height: ${returnObj.height}))
\t}
\treturn line
\t}()`
hljs.highlightAll()

        return
      }

      if (img.checked) {
        /*
        24,141,320,20,识别到的字符串,fontWithName:@"PingFangSC-Medium" size,15,0x333333
        */
        message.innerText = `\nlet aImgV: UIImageView = {
\tlet img = UIImage(named: "imgName")
\tlet imgV = UIImageView(image: img)
\timgV.backgroundColor = .red
\timgV.translatesAutoresizingMaskIntoConstraints = false

\tview.addSubview(imgV)
\timgV.snp.makeConstraints { (make) in
\t\tmake.top.equalToSuperview().offset(${returnObj.y})
\t\tmake.left.equalToSuperview().offset(${returnObj.x})
\t\tmake.size.equalTo(CGSize(width: ${returnObj.width}, height: ${returnObj.height}))
\t}
\treturn imgV
\t}()`
hljs.highlightAll()

        return
      }
      return
    }
    if (op === 'dart') {
      msgDiv.className = 'language-plaintext'

      if (img.checked) {
        message.innerText = `Image.asset('images/${returnObj.imgName}.png'),`;
        hljs.highlightAll()
        return
      }
      // 有可能是图片类型的按钮

      let flutterColor = returnObj.hexColor

      if (typeof flutterColor === 'undefined') {
        message.innerText = `
IconButton(
  icon: Image.asset('images/${returnObj.imgName}.png'),
  onPressed: (){
    
  },
), 
    `;
        hljs.highlightAll()

        // 没有颜色
        return;
}


      if(flutterColor.includes('#') &&
      flutterColor.includes(' ') &&
      flutterColor.includes('%')){

        // #333333 100%
        flutterColor = flutterColor.replaceAll('#', '')
        if(flutterColor.split(' ')[1].includes('100')) {
          flutterColor = '0xFF'+flutterColor.split(' ')[0];
        }

      }
      if (lab.checked) {
       
        message.innerText =`
Text(
\t'${returnObj.text}',
\tstyle: TextStyle(
\tfontFamily: '${returnObj.fontName}',
\tfontSize: ${returnObj.fontSize},
\tcolor: Color(${flutterColor})),
),`;
hljs.highlightAll()

        return
      }

      
       if (showLine.checked) {
         if(returnObj.corner === '0') {
          message.innerText = ` 
        Container(
          // width:${returnObj.width},
          // height:${returnObj.height},
          // padding: EdgeInsets.fromLTRB(6, 5, 6, 5),
          color: Color(${flutterColor}),
          child: Text('未开始')
        ),
        `;
        hljs.highlightAll()

           return
         }
        message.innerText = 
        `Container(
          // width:${returnObj.width},
          // height:${returnObj.height},
          // padding: EdgeInsets.fromLTRB(6, 5, 6, 5),
          decoration: BoxDecoration(
            borderRadius:
                BorderRadius.circular(${returnObj.corner}),
            color: Color(${flutterColor}),
          ),
          child: Text('未开始')
        ),`;
          hljs.highlightAll()

        return
      }
      if (btn.checked) {
        message.innerText = 
`TextButton(
\tonPressed: () {},
\tchild: Text(
\t\t'${returnObj.text}',
\t\tstyle: TextStyle(
\t\tfontFamily: '${returnObj.fontName}',
\t\tfontSize: ${returnObj.fontSize},
\t\tcolor: Color(${flutterColor})),
\t)),`;
          hljs.highlightAll()

        return
      }
      return
    }

    if (op === 'objc') {
      msgDiv.className = 'language-objc'

      // 类型判断 typeof strs === 'string'
      // 以字符串开始 startsWith
      if (img.checked) {
        // 返回来的就是UIImageView
        if (!showPro.checked) {
          
          message.innerText = `UIImageView *aImgV = ({

\tNSString *name = @"图片名";
\tUIImage *img = [UIImage imageNamed:name];
\tUIImageView *imgV = [[UIImageView alloc] initWithImage:img];
\timgV.contentMode = UIViewContentModeScaleAspectFit;
\t#ifdef DEBUG
\timgV.backgroundColor = [UIColor redColor];
\t#endif
\t[self.view addSubview: imgV];
\t[imgV mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@${returnObj.y});
\t\tmake.leading.equalTo(@${returnObj.x});
\t\t//make.bottom.equalTo(@0);
\t\t//make.trailing.equalTo(@0);
\t\t//make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

\t\t// make.top.equalTo(superView.mas_bottom).offset(${returnObj.y});
\t\t// make.leading.equalTo(superView.mas_leading).offset(${returnObj.x});
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);

\t\t// make.width.equalTo(@${returnObj.width});
\t\t// make.height.equalTo(@${returnObj.height});

\t\t// make.size.mas_equalTo(CGSizeMake(${returnObj.width}, ${returnObj.height}));

\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
\t}];

\timgV;
        });
        `} else {

          message.innerText = `
        @property(nonatomic) UIImageView *bgImgV;
        
        -(UIImageView *)bgImgV {
          if (!_bgImgV) {
\tNSString *name = @"图片名";
\tUIImage *img = [UIImage imageNamed:name];
\tUIImageView *imgV = [[UIImageView alloc] initWithImage:img];
\timgV.contentMode = UIViewContentModeScaleAspectFit;
\t#ifdef DEBUG
\timgV.backgroundColor = [UIColor redColor];
\t#endif

\t  _bgImgV = imgV;
          }
          return _bgImgV;
      }
      [self.view addSubview: self.bgImgV];
\t[self.bgImgV mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@${returnObj.y});
\t\tmake.leading.equalTo(@${returnObj.x});
\t\t//make.bottom.equalTo(@0);
\t\t//make.trailing.equalTo(@0);
\t\t//make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

\t\t// make.top.equalTo(superView.mas_bottom).offset(${returnObj.y});
\t\t// make.leading.equalTo(superView.mas_leading).offset(${returnObj.x});
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);

\t\t// make.width.equalTo(@${returnObj.width});
\t\t// make.height.equalTo(@${returnObj.height});

\t\t// make.size.mas_equalTo(CGSizeMake(${returnObj.width}, ${returnObj.height}));

\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
      }];

        `}
        hljs.highlightAll()

        return
      }

      if (lab.checked) {
        // 返回来的就是UILabel 
        if (!showPro.checked) {
          
          if(typeof returnObj.returnCodeStr !== 'undefined') {
            message.innerText = `${returnObj.returnCodeStr}  
[self.view addSubview: label];
[label mas_makeConstraints:^(MASConstraintMaker *make) {
\tmake.top.equalTo(@${returnObj.y});
\tmake.leading.equalTo(@${returnObj.x});
\t//make.bottom.equalTo(@0);
\t//make.trailing.equalTo(@0);
\t//make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

\t// make.top.equalTo(superView.mas_bottom).offset(${returnObj.y});
\t// make.leading.equalTo(superView.mas_leading).offset(${returnObj.x});
\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t// make.trailing.equalTo(superView.mas_trailing).offset(0);

\t// make.centerX.equalTo(@0);
\t// make.centerY.equalTo(@0);
}];
          
              `
              hljs.highlightAll()

              return
          }
          message.innerText = `UILabel *aLab = ({

\tUILabel *lab = [UILabel new];
\tlab.text = @"${returnObj.text}";
\tlab.font = [UIFont fontWithName:@"${returnObj.fontName}" size: ${returnObj.fontSize}];

\t// ${returnObj.hexColor}
\tlab.textColor =
\t[UIColor colorWithRed:${returnObj.r}/255.0 green:${returnObj.g}/255.0 blue:${returnObj.b}/255.0 alpha:${returnObj.a}]; 

\t[self.view addSubview: lab];
\t[lab mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@${returnObj.y});
\t\tmake.leading.equalTo(@${returnObj.x});
\t\t//make.bottom.equalTo(@0);
\t\t//make.trailing.equalTo(@0);
\t\t//make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

\t\t// make.top.equalTo(superView.mas_bottom).offset(${returnObj.y});
\t\t// make.leading.equalTo(superView.mas_leading).offset(${returnObj.x});
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);

\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
\t}];

\tlab;
});
`
        } else {
          message.innerText = `
 @property(nonatomic) UILabel *statusLab;

-(UILabel *)statusLab {
\tif (!_statusLab) {

\t\tUILabel *lab = [UILabel new];
\t\tlab.text = @"${returnObj.text}";
\t\tlab.font = [UIFont fontWithName:@"${returnObj.fontName}" size: ${returnObj.fontSize}];

\t\t// ${returnObj.hexColor}
\t\tlab.textColor =
\t\t[UIColor colorWithRed:${returnObj.r}/255.0 green:${returnObj.g}/255.0 blue:${returnObj.b}/255.0 alpha:${returnObj.a}]; 


\t\t_statusLab = lab;
\t}
\treturn _statusLab;
}

[self.view addSubview: self.statusLab];
[self.statusLab mas_makeConstraints:^(MASConstraintMaker *make) {
\tmake.top.equalTo(@${returnObj.y});
\tmake.leading.equalTo(@${returnObj.x});
\t//make.bottom.equalTo(@0);
\t//make.trailing.equalTo(@0);
\t//make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

\t// make.top.equalTo(superView.mas_bottom).offset(${returnObj.y});
\t// make.leading.equalTo(superView.mas_leading).offset(${returnObj.x});
\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t// make.trailing.equalTo(superView.mas_trailing).offset(0);

\t// make.width.equalTo(@${returnObj.width});
\t// make.height.equalTo(@${returnObj.height});

\t// make.size.mas_equalTo(CGSizeMake(${returnObj.width}, ${returnObj.height}));

\t// make.centerX.equalTo(@0);
\t// make.centerY.equalTo(@0);
}];
        `;
        }
        hljs.highlightAll()

        return
      }


      if (btn.checked) {
        if (returnObj.length == 2) {
          // 纯图片按钮
          if (!showPro.checked) {
            message.innerText = `UIButton *aBtn = ({

\tUIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\tNSString *name = @"图片名";
\tUIImage *img = [UIImage imageNamed:name];
\t[btn setImage:img forState:UIControlStateNormal];

\t[self.view addSubview: btn];
\t[btn mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@0);
\t\tmake.leading.equalTo(@0);
\t\tmake.bottom.equalTo(@0);
\t\tmake.trailing.equalTo(@0);
\t\t//make.top.equalTo(superView.mas_bottom).offset(0);
\t\t//make.leading.equalTo(superView.mas_leading).offset(0);
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);
\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
\t    }];

\t\tbtn;
\t});
`
hljs.highlightAll()

            return
          }
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

      [self.view addSubview: self.useBtn];
      [self.useBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(@0);
\t  make.leading.equalTo(@0);
\t  //make.bottom.equalTo(@0);
\t  //make.trailing.equalTo(@0);
\t  //make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

        // make.top.equalTo(superView.mas_bottom).offset(0);
        // make.leading.equalTo(superView.mas_leading).offset(0);
          // make.bottom.equalTo(superView.mas_bottom).offset(0);
          // make.trailing.equalTo(superView.mas_trailing).offset(0);

          // make.centerX.equalTo(@0);
          // make.centerY.equalTo(@0);
      }];
\t
`
hljs.highlightAll()

          return
        }

        if (returnObj.length == 6 || returnObj.length == 7) {
          // 纯背景色按钮 // 38,543,300,44,#9A2037,100,23
          let corner = (returnObj.corner > 0) ? `btn.layer.cornerRadius = ${returnObj.corner};` : ''
          if (!showPro.checked) {
            message.innerText = `\nUIButton *aBtn = ({

\t     UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\t     btn.backgroundColor = [UIColor colorWithRed:${returnObj.r}/255.0 green:${returnObj.g}/255.0 blue:${returnObj.b}/255.0 alpha:${returnObj.a}];
\t     ${corner}

\t     [self.view addSubview: btn];
\t     [btn mas_makeConstraints:^(MASConstraintMaker *make) {
\t      make.top.equalTo(@0);
\t      make.leading.equalTo(@0);
\t      //make.bottom.equalTo(@0);
\t      //make.trailing.equalTo(@0);
\t      //make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

\t      // make.top.equalTo(superView.mas_bottom).offset(0);
\t      // make.leading.equalTo(superView.mas_leading).offset(0);
\t       // make.bottom.equalTo(superView.mas_bottom).offset(0);
\t       // make.trailing.equalTo(superView.mas_trailing).offset(0);

\t       // make.centerX.equalTo(@0);
\t       // make.centerY.equalTo(@0);
\t     }];

\t     btn;
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

\t    // ${returnObj.hexColor}
\t    btn.backgroundColor = 
\t    [UIColor colorWithRed:${returnObj.r}/255.0 green:${returnObj.g}/255.0 blue:${returnObj.b}/255.0 alpha:${returnObj.a}];
\t     ${corner}
\t       
\t    _useBtn = btn;
\t  }
\t  return _useBtn;
          }

      [self.view addSubview: self.useBtn];
      [self.useBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(@0);
\t  make.leading.equalTo(@0);
\t  //make.bottom.equalTo(@0);
\t  //make.trailing.equalTo(@0);
\t  //make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

        // make.top.equalTo(superView.mas_bottom).offset(0);
        // make.leading.equalTo(superView.mas_leading).offset(0);
          // make.bottom.equalTo(superView.mas_bottom).offset(0);
          // make.trailing.equalTo(superView.mas_trailing).offset(0);

          // make.centerX.equalTo(@0);
          // make.centerY.equalTo(@0);
      }];
\t
`
          }
        }
        else {
          // 纯文字按钮
          //  return [viewX, viewY, viewWidth, viewHeight, labStr, ocFontMethodName, labFontSizeStr, LabTextColorHexStr]
          if (!showPro.checked) {
            
            let setTitleCode = ''
            if (typeof returnObj.text === 'undefined' || returnObj.text.length <= 0) {
              //  没有文字
            } else {
              //  有文字
setTitleCode = 
`\t[btn setTitle: @"${returnObj.text}" forState: UIControlStateNormal];
\tbtn.titleLabel.font = [UIFont fontWithName:@"${returnObj.fontName}" size: ${returnObj.fontSize}];

\t// ${returnObj.hexColor}
\t[btn setTitleColor: [UIColor colorWithRed:${returnObj.r}/255.0 green:${returnObj.g}/255.0 blue:${returnObj.b}/255.0 alpha:${returnObj.a}] 
\t\tforState: UIControlStateNormal]; 
`
              
            }




            message.innerText = `\nUIButton *aBtn = ({
\tUIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
${setTitleCode}
\t//  NSString *name = @"图片名";
\t//  UIImage *img = [UIImage imageNamed:name];
\t// [btn setImage:img forState:UIControlStateNormal];
\t[self.view addSubview: btn];
\t[btn mas_makeConstraints:^(MASConstraintMaker *make) {
\t\tmake.top.equalTo(@0);
\t\tmake.leading.equalTo(@0);
\t\t//make.bottom.equalTo(@0);
\t\t//make.trailing.equalTo(@0);
\t\t//make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

\t\t// make.top.equalTo(superView.mas_bottom).offset(0);
\t\t// make.leading.equalTo(superView.mas_leading).offset(0);
\t\t// make.bottom.equalTo(superView.mas_bottom).offset(0);
\t\t// make.trailing.equalTo(superView.mas_trailing).offset(0);

\t\t// make.centerX.equalTo(@0);
\t\t// make.centerY.equalTo(@0);
\t}];

\tbtn;
});
`

          } else {
            message.innerText =
              `
\t@property(nonatomic) UIButton *useBtn;
\t
-(UIButton *)useBtn {
\tif (!_useBtn) {
\t\tUIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
\t\t[btn  setTitle: @"${returnObj.text}" forState: UIControlStateNormal];
\t\tbtn.titleLabel.font = [UIFont fontWithName:@"${returnObj.fontName}" size: ${returnObj.fontSize}];

\t\t// ${returnObj.hexColor}
\t\t[btn  setTitleColor: [UIColor colorWithRed:${returnObj.r}/255.0 green:${returnObj.g}/255.0 blue:${returnObj.b}/255.0 alpha:${returnObj.a}]
\t\t\t forState: UIControlStateNormal]; 

\t\t//  NSString *name = @"图片名";
\t\t//  UIImage *img = [UIImage imageNamed:name];
\t\t// [btn setImage:img forState:UIControlStateNormal];
     
\t\t_useBtn = btn;
\t}
\treturn _useBtn;
}


\t
      [self.view addSubview: self.useBtn];
      [self.useBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(@0);
\t  make.leading.equalTo(@0);
\t  //make.bottom.equalTo(@0);
\t  //make.trailing.equalTo(@0);
\t  //make.edges.mas_equalTo(UIEdgeInsetsMake(0, 0, 0, 0));

        // make.top.equalTo(superView.mas_bottom).offset(0);
        // make.leading.equalTo(superView.mas_leading).offset(0);
          // make.bottom.equalTo(superView.mas_bottom).offset(0);
          // make.trailing.equalTo(superView.mas_trailing).offset(0);

          // make.centerX.equalTo(@0);
          // make.centerY.equalTo(@0);
      }];
\t
`
          }
        }
        hljs.highlightAll()

        return
      }

      if (showLine.checked) {
        // 圆角
        let cornerStgr = (returnObj.corner > 0) ? `line.layer.cornerRadius = ${returnObj.corner};` : ''
        message.innerText = `\nUIView *vLine = ({
        
\t  CGRect frame = CGRectMake(${returnObj.x}, ${returnObj.y}, ${returnObj.width}, ${returnObj.height});
\t  UIView *line = [[UIView alloc] initWithFrame: frame];
\t  line.userInteractionEnabled = NO;

\t// ${returnObj.hexColor}
\tline.backgroundColor = 
\t[UIColor colorWithRed:${returnObj.r}/255.0 green:${returnObj.g}/255.0 blue:${returnObj.b}/255.0 alpha:${returnObj.a}]; 

\t  ${cornerStgr}

\t  [self.view addSubview: line];
\t  [line mas_makeConstraints:^(MASConstraintMaker *make) {
\t\t  make.top.equalTo(@${returnObj.y});
\t\t  make.leading.equalTo(@${returnObj.x});
\t\t  make.bottom.equalTo(@0);
\t\t  make.trailing.equalTo(@0);
\t    // make.top.equalTo(superView.mas_bottom).offset(${returnObj.y});
\t    // make.leading.equalTo(superView.mas_leading).offset(${returnObj.x});
\t    // make.bottom.equalTo(superView.mas_bottom).offset(0);
\t    // make.trailing.equalTo(superView.mas_trailing).offset(0);
\t    // make.width.equalTo(@${returnObj.width});
\t    // make.height.equalTo(@${returnObj.height});
\t    // make.size.mas_equalTo(CGSizeMake(${returnObj.width}, ${returnObj.height}));
\t    // make.centerX.equalTo(@0);
\t    // make.centerY.equalTo(@0);
\t  }];
\t  
\t  line;
          });`
          hljs.highlightAll()

        return
      }
    }


    if (op === 'Android') {
      if (lab.checked) {
        /*
        <TextView 
android:layout_width="26dp" 
android:layout_height="14dp"
android:text="吴京"
android:textColor="#ff333333"
android:textSize="13sp"
/>

{"x":"106.5dp",
"y":"266dp",
"width":"25.5dp",
"height":"13.5dp",
"corner":"0",
"r":"51",
"g":"51",
"b":"51",
"a":"1",
"text":"吴京",
"fontName":"MicrosoftYaHeiUI",
"fontSize":"13sp",
"hexColor":"#333333 100%"}
*/
msgDiv.className = 'language-xml'
message.innerText = 
`<TextView 

<!-- android:layout_width="${returnObj.width}" -->
<!-- android:layout_height="${returnObj.height}" -->

android:text="${returnObj.text}"
android:textColor="#ff333333"
android:textSize="${returnObj.fontSize}"
/>`
hljs.highlightAll()

      }
      
    }
    
}
function onWindowLoad() {

  // 获取 popup.html里的元素进行字符串设定
  var message = document.querySelector('#message');
  
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
  var defaultConfig = { 'op': 'objc', 'ocCode': 'btn', 'isShowPro': false };
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  chrome.storage.sync.get(defaultConfig, function (items) {
    language_select_element.value = items.op;
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

/**
 * 复制字符串到粘贴板
 */
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

/**
 * 保存配置事件
 */ 
function saveConfig() {
  let op = language_select_element.value;
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
  // 保存配置到谷歌
  chrome.storage.sync.set(saveDict, function () {
    const status = document.getElementById('status')
    status.style.display = 'block';
    status.textContent = '保存成功！';
    setTimeout(() => {
      status.textContent = '';
      status.style.display = 'none';
    }, 800);
  });
}

// 复制代码事件
document.getElementById('copyCode').addEventListener('click', function () {
  copyStr(msgDiv.innerText)

});
// ------------------------------------下载xib文件-----------------------
document.getElementById('downloadXibFile').addEventListener('click', function () {
  // 下载文件
  let subViewStrs = ''
    for (let aview of savedData['info']) {
      // ["shape", "layer-group", "symbol", "bitmap", "text"]
      if (aview['isVisible'] === true && aview['type'] === 'text') {
        
        let textInfo = aview['font']
        let textColorInfo = textInfo['color']
        
        let r = textColorInfo.hasOwnProperty('r') ? textColorInfo['r'] : 0;
        let g = textColorInfo.hasOwnProperty('g') ? textColorInfo['g'] : 0;
        let b = textColorInfo.hasOwnProperty('b') ? textColorInfo['b'] : 0;
        let a = textColorInfo.hasOwnProperty('a') ? textColorInfo['a'] : 1;


        subViewStrs += getUILabelXMLString(aview['ddsOriginFrame']['x'], aview['ddsOriginFrame']['y'], aview['ddsOriginFrame']['width'], aview['ddsOriginFrame']['height'], 
        textInfo['content'],textInfo['font'],textInfo['size'],r, g,b,a);
        
      }
      else if (aview['isVisible'] === true && aview['type'] === 'shape') {
        if (aview.hasOwnProperty('borders')) {
          // UIView
          let colorInfo = aview['borders'][0]['color']
          let r = colorInfo.hasOwnProperty('r') ? colorInfo['r'] : 0;
          let g = colorInfo.hasOwnProperty('g') ? colorInfo['g'] : 0;
          let b = colorInfo.hasOwnProperty('b') ? colorInfo['b'] : 0;
          let a = colorInfo.hasOwnProperty('a') ? colorInfo['a'] : 1;
          subViewStrs += getUIViewXMLString(aview['ddsOriginFrame']['x'], aview['ddsOriginFrame']['y'], aview['ddsOriginFrame']['width'], aview['ddsOriginFrame']['height'], r, g, b, a);
        } else if (aview.hasOwnProperty('fills') && aview['fills'].length > 0 && aview['fills'][0].hasOwnProperty('color')) {
          // UIView
          let colorInfo = aview['fills'][0]['color']
          let r = colorInfo.hasOwnProperty('r') ? colorInfo['r'] : 0;
          let g = colorInfo.hasOwnProperty('g') ? colorInfo['g'] : 0;
          let b = colorInfo.hasOwnProperty('b') ? colorInfo['b'] : 0;
          let a = colorInfo.hasOwnProperty('a') ? colorInfo['a'] : 1;

          subViewStrs += getUIViewXMLString(aview['ddsOriginFrame']['x'], aview['ddsOriginFrame']['y'], aview['ddsOriginFrame']['width'], aview['ddsOriginFrame']['height'], r, g, b, a);
        }
        else if (!aview.hasOwnProperty('fills')) {
          // UIImageView
          subViewStrs += getUIImageViewXMLString(aview['ddsOriginFrame']['x'], aview['ddsOriginFrame']['y'], aview['ddsOriginFrame']['width'], aview['ddsOriginFrame']['height']);
        }

      }
      else if (aview['visible'] === true && aview['type'] === 'textLayer') {
        
        let textInfo = aview['textInfo']
        let textColorInfo = textInfo['color']
        
        let r = textColorInfo.hasOwnProperty('r') ? textColorInfo['r'] : 0;
        let g = textColorInfo.hasOwnProperty('g') ? textColorInfo['g'] : 0;
        let b = textColorInfo.hasOwnProperty('b') ? textColorInfo['b'] : 0;
        let a = textColorInfo.hasOwnProperty('a') ? textColorInfo['a'] : 1;


        subViewStrs += getUILabelXMLString(aview['left']*0.5, aview['top']*0.5, aview['width']*0.5, aview['height']*0.5, 
        textInfo['text'],textInfo['fontPostScriptName'],textInfo['size']*0.5,r, g,b,a);
      } else if (aview['visible'] === true && aview['type'] === 'layerSection') {
        subViewStrs += getUIImageViewXMLString(aview['left']*0.5, aview['top']*0.5, aview['width']*0.5, aview['height']*0.5);
      } else if (aview['visible'] === true && aview['type'] === 'shapeLayer') {
        
        let colorInfo = aview['fill']['color']
        let r = colorInfo.hasOwnProperty('red') ? colorInfo['red'] : 0;
        let g = colorInfo.hasOwnProperty('green') ? colorInfo['green'] : 0;
        let b = colorInfo.hasOwnProperty('blue') ? colorInfo['blue'] : 0;
        let a = colorInfo.hasOwnProperty('alpha') ? colorInfo['alpha'] : 1;
        subViewStrs += getUIViewXMLString(aview['left']*0.5, aview['top']*0.5, aview['width']*0.5, aview['height']*0.5, r, g,b,a);
      }
    }



  const blob = new Blob([getXibXMLString(subViewStrs)], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "page.xib");
});


// img打钩事件
img.addEventListener('change', function () {
  btn.checked = false;
  lab.checked = false;
  showLine.checked = false;

  saveConfig()
  processCodeOutput(savedRequest)
});

// 语言选择事件
language_select_element.addEventListener('change', function (data) {

  saveConfig()
  processCodeOutput(savedRequest)
});
 
  
 

// btn打钩事件
btn.addEventListener('change', function () {
  img.checked = false;
  lab.checked = false;
  showLine.checked = false;

  saveConfig()
  processCodeOutput(savedRequest)
});

// lab打钩事件
lab.addEventListener('change', function () {
  img.checked = false;
  btn.checked = false;
  showLine.checked = false;

  saveConfig()
  processCodeOutput(savedRequest)
});

// UIView打钩事件
showLine.addEventListener('change', function () {
  img.checked = false;
  btn.checked = false;
  lab.checked = false;

  saveConfig()
  processCodeOutput(savedRequest)
});

// 属性引用打钩事件
showPro.addEventListener('change', function (e) {
  proNameInput.hidden = !showPro.checked;

  saveConfig()
  processCodeOutput(savedRequest)
});
/*
以下代码可以获取到整页控件信息

// 先获取background页面
var bg = chrome.extension.getBackgroundPage();
//再在返回的对象上调用background.js 里面的函数
alert(bg.fetchSavedData());
*/

// 在弹出pop页面时，直接存有效的信息
let savedData;
let bg = chrome.extension.getBackgroundPage();
let inputData = bg.fetchSavedData();
if (typeof inputData !== 'undefined') {
  savedData = inputData
}

function getUILabelXMLString(x, y, width, height, text, fontName, fontSize, r, g, b ,a) {
  // 系统 type="system"
  // 平方 name="PingFangSC-Regular" family="PingFang SC"
  let fontValue = `type="system"`
  if (fontName.includes('PingFangSC')) {
    fontValue = `name="${fontName}" family="PingFang SC"`
  }
  
  return `
  <label opaque="NO" userInteractionEnabled="NO" contentMode="left" horizontalHuggingPriority="251" verticalHuggingPriority="251" fixedFrame="YES" text="${text}" textAlignment="natural" lineBreakMode="tailTruncation" baselineAdjustment="alignBaselines" adjustsFontSizeToFit="NO" translatesAutoresizingMaskIntoConstraints="NO" id="${getXibRandomIDString()}">
      <rect key="frame" x="${x}" y="${y}" width="${width+6}" height="${height+4}"/>
      <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
      <fontDescription key="fontDescription" ${fontValue} pointSize="${fontSize}"/>
      <color key="textColor" red="${r/255.0}" green="${g/255.0}" blue="${b/255.0}" alpha="${a}" colorSpace="calibratedRGB"/>
      <nil key="highlightedColor"/>
</label>
`
}
function getUIImageViewXMLString(x, y, width, height) {
return`
<imageView clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleAspectFit" horizontalHuggingPriority="251" verticalHuggingPriority="251" fixedFrame="YES" translatesAutoresizingMaskIntoConstraints="NO" id="${getXibRandomIDString()}">
      <rect key="frame" x="${x}" y="${y}" width="${width}" height="${height}"/>
      <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
</imageView>

`
}
function getUIViewXMLString(x, y, width, height, r, g, b ,a) {
  return`
  <view contentMode="scaleToFill" fixedFrame="YES" translatesAutoresizingMaskIntoConstraints="NO" id="${getXibRandomIDString()}">
      <rect key="frame" x="${x}" y="${y}" width="${width}" height="${height}"/>
      <autoresizingMask key="autoresizingMask" flexibleMaxX="YES" flexibleMaxY="YES"/>
      <color key="backgroundColor" red="${r/255.0}" green="${g/255.0}" blue="${b/255.0}" alpha="${a}" colorSpace="calibratedRGB"/>
  </view>
  
  `
  }

/**
 * 生成xib xml 格式
 */
  function getXibXMLString(subviews) {

 
 return `<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.XIB" version="3.0" toolsVersion="21507" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES">
    <device id="retina6_1" orientation="portrait" appearance="light"/>
    <dependencies>
        <deployment identifier="iOS"/>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="21505"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="System colors in document resources" minToolsVersion="11.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <objects>
        <placeholder placeholderIdentifier="IBFilesOwner" id="-1" userLabel="File's Owner"/>
        <placeholder placeholderIdentifier="IBFirstResponder" id="-2" customClass="UIResponder"/>
        <view contentMode="scaleToFill" id="${getXibRandomIDString()}">
            <rect key="frame" x="0.0" y="0.0" width="414" height="896"/>
            <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
            <subviews>
                 
                ${subviews}

            </subviews>
            <viewLayoutGuide key="safeArea" id="${getXibRandomIDString()}"/>
            <color key="backgroundColor" systemColor="systemBackgroundColor"/>
            <point key="canvasLocation" x="130.43478260869566" y="-11.383928571428571"/>
        </view>
    </objects>
    <resources>
        <systemColor name="systemBackgroundColor">
            <color white="1" alpha="1" colorSpace="custom" customColorSpace="genericGamma22GrayColorSpace"/>
        </systemColor>
    </resources>
</document>`
}
/**
 * 生成xib上的随机id
 */
function getXibRandomIDString(length) {
  return `${getRandomString(3)}-${getRandomString(2)}-${getRandomString(3)}`;
}

/**
 * 生成随机的串 数字大小写字母
 */
function getRandomString(length) {
  var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) 
      result += str[Math.floor(Math.random() * str.length)];
  return result;
}