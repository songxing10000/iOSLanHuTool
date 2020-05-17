var title;
var url;
// 监听来消息 getSource
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {

    if (url.indexOf('translate.google.cn') >= 0) {
      let op = document.getElementById('op').value;
      if (op === 'lang') {
        var str='';
        for (const [key, value] of Object.entries(request.source)) {
          str += '\"' + key + '\"' + '=' + '\"' + value.replace(',', '') + '\";\n'
        }
        message.innerText = str;
      } else {
        message.innerText = request.source;
      }
    } else {

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
  var defaultConfig = { op: 'lang', showImage: true };
  // 读取数据，第一个参数是指定要读取的key以及设置默认值
  chrome.storage.sync.get(defaultConfig, function (items) {
    document.getElementById('op').value = items.op;
    document.getElementById('show_image').checked = items.showImage;
  });
});
let img = document.getElementById('show_image');
let btn = document.getElementById('show_btn');
let lab = document.getElementById('show_lab');

// 保存配置事件
document.getElementById('save').addEventListener('click', function () {
  let op = document.getElementById('op').value;
  let showImage = img.checked;
  chrome.storage.sync.set({ op: op, showImage: showImage }, function () {
    document.getElementById('status').textContent = '保存成功！';
    setTimeout(() => { document.getElementById('status').textContent = ''; }, 800);
  });
});

// checked 事件互斥

img.addEventListener('change', function () {
  btn.checked = false;
  lab.checked = false;
});
document.getElementById('show_btn').addEventListener('change', function () {
  img.checked = false;
  lab.checked = false;
});
document.getElementById('show_lab').addEventListener('change', function () {
  img.checked = false;
  btn.checked = false;
});

