var title;
var url;
let img = document.getElementById('show_image');
let btn = document.getElementById('show_btn');
let lab = document.getElementById('show_lab');

/// document.getElementById('show_line');
let showLine = document.getElementById('show_line');
// 监听来消息 getSource
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
    if (url.includes('cnblogs.com')) {
      // 在博客完时，只是追加日期而，面板不用显示出来
      document.body.hidden = true
    }
    else if (url.includes('csdn')) {
      // 在csdn里，只是移除登录框，不显示面板
      document.body.hidden = true
    }
    else if (url.includes('lanhuapp.com/web') ||
      url.includes('app.mockplus.cn')) {
      let strs = request.source;
      // 多行 拼接 变量 ${变量名} innerText
      let op = document.getElementById('op').value;
      if (op === 'xml_code') {
        if (lab.checked) {
          let fontStr = strs[1]
          let typeStr = ''
          if (fontStr === 'pFSize') {
            typeStr = "type=\"system\""
          } else if (fontStr === 'pFMediumSize') {
            typeStr = "type=\"system\" weight=\"medium\""
          } else if (fontStr === 'pFBlodSize') {
            typeStr = "type=\"boldSystem\""
          }
          // TODO： frame id color
          message.innerText =
            `<label opaque="NO" userInteractionEnabled="NO" contentMode="left" horizontalHuggingPriority="251" verticalHuggingPriority="251" text="${strs[0]}" textAlignment="natural" lineBreakMode="tailTruncation" baselineAdjustment="alignBaselines" adjustsFontSizeToFit="NO" translatesAutoresizingMaskIntoConstraints="NO" id="Vit-KM-Fpd">
              <rect key="frame" x="82.5" y="18.5" width="155" height="23"/>
              <fontDescription key="fontDescription" ${typeStr} pointSize="${strs[2]}"/>
              <color key="textColor" red="0.96862745098039216" green="0.52549019607843139" blue="0.023529411764705882" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
              <nil key="highlightedColor"/>
          </label>`
        }
      }
      else if (op === 'swift_code') {
        if (lab.checked) {
          let colorStr = strs[3].replace('#', '')
          message.innerText =
            `\nlet lab: UILabel = {
            let lab = UILabel()
            lab.text = "${strs[0]}"
            lab.textColor = UIColor(rgb: 0x${colorStr})
            lab.font = UIFont.systemFont(ofSize: calculate(ipadfs: ${strs[2]}))
            
            addSubview(lab)
            lab.snp.makeConstraints { (make) in
                make.centerX.equalToSuperview()
                make.top.equalToSuperview().offset(calculate(h: 28.0))
            }
            
            return lab
        }()`
        }
        else if (btn.checked) {
          message.innerText =
            `\nUIButton *btn = ({
                 UIButton *btn = [UIButton btn];
                 btn.normalTitle = @"${strs[0]}";
                 btn.titleLabel.font = [UIFont ${strs[1]}:  ${strs[2]}];
                 btn.normalTitleColor = @"${strs[3]}".hexColor;
            
                 btn;
            });`
        } else if (showLine.checked) {
          // ["圆角矩形 750","systemFontOfSize","12","RGBA233, 236, 245, 1"]

          message.innerText =
            `\nUIView *vLine = ({
            UIView *vLine = [UIView new];
            vLine.backgroundColor = @"${strs[3]}".hexColor;
            [contentView addSubview: vLine];
            [vLine mas_makeConstraints:^(MASConstraintMaker *make) {
                make.width.equalTo(@0.5);
                make.top.equalTo(titleLab.mas_bottom).offset(11);
                make.leading.equalTo(contentView).offset(18);
                make.bottom.equalTo(contentView).offset(-12);
            }];
        });`
        }
      }
      else if (op === 'oc_code') {
        // 类型判断 typeof strs === 'string'
        // 以字符串开始 startsWith
        if (img.checked) {
          // 返回来的就是UIImageView
          message.innerText = `\nUIImageView *imgV = ({

            NSString *name = @"图片名";
            UIImage *img = [UIImage imageNamed:name];
            UIImageView *imgV = [[UIImageView alloc] initWithImage:img];
            [imgV sizeToFit];

            UIView *view = contentView;
            [view addSubview: imgV];
            [imgV mas_makeConstraints:^(MASConstraintMaker *make) {
                make.leading.equalTo(view).offset(${strs[0]});
                make.top.equalTo(view).offset(${strs[1]});
            }];
            
            imgV;
        });`
          return
        }
        if (typeof strs === 'string' && strs.startsWith('\nUILabel')) {
          // 返回来的就是UILabel
          message.innerText = strs
          return
        }
        
        if (btn.checked) {
          if(strs.length == 2) {
            // 图片
            message.innerText =
            `\nUIButton *btn = ({
                 UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
                 NSString *name = @"图片名";
                  UIImage *img = [UIImage imageNamed:name];
                 [btn setImage:img forState:UIControlStateNormal];
                  [btn sizeToFit];

                UIView *view = contentView;
                [view addSubview: btn];
                [btn mas_makeConstraints:^(MASConstraintMaker *make) {
                  make.leading.equalTo(view).offset(${strs[0]});
                  make.top.equalTo(view).offset(${strs[1]});
                }];

                 btn;
            });`
          }
          else {
            message.innerText =
            `\nUIButton *btn = ({
                 UIButton *btn = [UIButton btn];
                 btn.normalTitle = @"${strs[0]}";
                 btn.titleLabel.font = [UIFont ${strs[1]}:  ${strs[2]}];
                 btn.normalTitleColor = @"${strs[3]}".hexColor;
            
                 btn;
            });`
          }
          
        }
        else if (showLine.checked) {
          // ["圆角矩形 750","systemFontOfSize","12","RGBA233, 236, 245, 1"]

          message.innerText =
            `\nUIView *vLine = ({
            UIView *vLine = [UIView new];
            vLine.backgroundColor = @"${strs[3]}".hexColor;
            [contentView addSubview: vLine];
            [vLine mas_makeConstraints:^(MASConstraintMaker *make) {
                make.width.equalTo(@0.5);
                make.top.equalTo(titleLab.mas_bottom).offset(11);
                make.leading.equalTo(contentView).offset(18);
                make.bottom.equalTo(contentView).offset(-12);
            }];
        });`
        }
      }

    }
    else {
      message.innerText = request.source;
    }
  }
});

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

}
// 窗口载入时使用自己的载入函数
window.onload = onWindowLoad;

/// 新加面板
document.addEventListener('DOMContentLoaded', function () {
  // 默认配置
  var defaultConfig = { 'op': 'oc_code', 'ocCode': 'btn' };
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
  let showImage = img.checked;
  let saveDict = {
    op: op,
    ocCode: ocCodeStr
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