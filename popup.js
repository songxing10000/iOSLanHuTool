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
    else if (url.includes('lanhuapp.com/web')) {
      let strs = request.source;
      // 多行 拼接 变量 ${变量名} innerText
      if (lab.checked) {
        message.innerText =
          `\nUILabel *lab = ({ UILabel *lab =
                   [UILabel text: @"${strs[0]}" font: [UIFont ${strs[1]}:  ${strs[2]}]  textColorStr: @\"${strs[3]}"];
                   [contentView addSubview: lab];
                   [lab mas_makeConstraints:^(MASConstraintMaker *make) {
                          make.top.equalTo(contentView).offset(15);
                          make.leading.equalTo(contentView).offset(28);
                     }];

                     lab;
        });`;
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
    }  else if (ocCodeStr === 'line') {
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