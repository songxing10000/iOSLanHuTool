// 通用写法：url适配时亮显page_action
chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([
        {
          conditions: [
            // 监听域名匹配
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { urlContains: 'lanhuapp' },
            })
          ],
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });

  let savedData;
// 接收到拦截的响应，将器发送到requestUrl变量配置的地址上
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  savedData = request.data;
    // 异步响应sendMessage的写法：
    // 异步接收要求返回turn，从而使sendMessage可以异步接收回应消息
    return true;
  });
function fetchSavedData(){
  return savedData;
}