
// content_script与inject_script的消息通知通过postMessage进行
// 监听inject_script发出的消息
window.addEventListener("message", (e) => {
  if (!e.data || Object.keys(e.data).length === 0) {
    return;
  }

  // 发消息给background.js，并接收其回复
  chrome.runtime.sendMessage({ data: e.data }, {}, function (res) {
    console.log('获取到整页数据');
  })


}, false);



