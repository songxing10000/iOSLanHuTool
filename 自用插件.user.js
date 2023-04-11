// ==UserScript==
// @name         自用插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function () {

        // 获取当前网页地址
        var currentURL = window.location.href

        if(currentURL.includes('jianshu.com')){

            // 简书 把评论放到推荐的八卦上面来
            let commentDiv = document.getElementById('note-page-comment')
            let bgDiv = document.getElementsByClassName('ouvJEz')[1]
            function exchange(el1, el2) {
                let ep1 = el1.parentNode;
                let ep2 = el2.parentNode;
                let index1 = Array.prototype.indexOf.call(ep1.children, el1);
                let index2 = Array.prototype.indexOf.call(ep2.children, el2);
                ep2.insertBefore(el1, ep2.children[index2]);
                ep1.insertBefore(el2, ep1.children[index1]);
            }
            exchange(commentDiv, bgDiv)
        }
        else if(currentURL.includes('csdn')){

            document.body.contentEditable = 'true'
        } else if(currentURL.includes('cnblogs')) {

            let titleElement = document.getElementById('cb_post_title_url')
            let dateElement = document.getElementById('post-date')
            let title = titleElement.innerText
            titleElement.innerText = title + ' 发布日期：' + dateElement.innerText
        }else if (currentURL.includes('pgyer.com')) {

            let div = document.getElementsByClassName('span12 gray-text')[1]
            let versionDiv = document.getElementsByTagName('li')[0]
            versionDiv.innerText = versionDiv.innerText.split('(')[0]
            div.append(versionDiv)
            let desDiv = document.getElementsByClassName('tag-box margin-bottom-40')[0]
            div.append(desDiv)
        } else {

            document.body.contentEditable = 'false'
        }

    }

})();