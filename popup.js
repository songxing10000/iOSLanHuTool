
// 监听来消息 getSource
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
      message.innerText = request.source;
  }
});

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

}
// 窗口载入时使用自己的载入函数
window.onload = onWindowLoad;

/// 新加面板
document.addEventListener('DOMContentLoaded', function() {
  // 默认配置
  var defaultConfig = {color: 'white', showImage: true};
	// 读取数据，第一个参数是指定要读取的key以及设置默认值
	chrome.storage.sync.get(defaultConfig, function(items) {
		document.getElementById('color').value = items.color;
		document.getElementById('show_image').checked = items.showImage;
  });
});

document.getElementById('save').addEventListener('click', function() {
	var color = document.getElementById('color').value;
	var showImage = document.getElementById('show_image').checked;
	chrome.storage.sync.set({color: color, showImage: showImage}, function() {
		document.getElementById('status').textContent = '保存成功！';
		setTimeout(() => {document.getElementById('status').textContent = '';}, 800);
	});
});
document.getElementById('show_image').addEventListener('change', function() {
  document.getElementById('show_btn').checked = false;
  document.getElementById('show_lab').checked = false;
});
document.getElementById('show_btn').addEventListener('change', function() {
  document.getElementById('show_image').checked = false;
  document.getElementById('show_lab').checked = false;
});
document.getElementById('show_lab').addEventListener('change', function() {
  document.getElementById('show_image').checked = false;
  document.getElementById('show_btn').checked = false;
});

