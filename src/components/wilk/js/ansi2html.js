function ansi2html_zz(ss) {
    var result = ''
    var isInAsic = false
    // 去除一下最开始的换行.TODO.
    for(var i = 0, len = ss.length; i < len; ++i) {
        if(ss.substring(i + 1, i + 4) == '[0m') {
            i = i + 3;
            isInAsic = false;
            result = result + '</span>'; // 关闭上一个
            continue;
        }
        if(ss.substring(i + 1, i + 8) == '[30;47m') {
            i = i + 7;
            result = solveAsic(result, isInAsic, "white");
            isInAsic = true
            continue;
        }
        if(ss.substring(i + 1, i + 8) == '[30;40m') {
            i = i + 7;
            result = solveAsic(result, isInAsic, "black");
            isInAsic = true
            continue;
        }
        if(ss.substring(i + 1, i + 5) == '[31m') {
            i = i + 4
            result = solveAsic(result, isInAsic, "red");
            isInAsic = true
            continue;
        }
        if(ss.substring(i + 1, i + 5) == '[32m') {
            i = i + 4
            result = solveAsic(result, isInAsic, "green");
            isInAsic = true
            continue;
        }
        if(ss[i] == '\r' && ss[i + 1] == '\n') { // 换行
            i = i + 1;
            result = result + '</br>';
            continue;
        }
        if(ss[i] == '\n') { // 换行
            result = result + '</br>';
            continue;
        }
        if(ss[i] == ' ') {
            result = result + '&nbsp;&nbsp;' // 这个得两个&nbsp;
            continue;
        }
        result = result + ss[i]; // 正常的文本
    }
    return result;
}

function decodeBase64Content(base64Content) {
    // base64 解码
    let commonContent = base64Content.replace(/\s/g, '+');
    commonContent = Buffer.from(commonContent, 'base64').toString();
    return commonContent;
}
  
function encodeBase64Content(commonContent) {
    // base64 编码
    let base64Content = Buffer.from(commonContent).toString('base64');
    return base64Content;
}

function solveAsic(result, isInAsic, color) {
    if(isInAsic) { // 关闭上一个，开始下一个
        result = result + '</span>' + '<span class = "span_' + color + '">';
    } else { // 开始
        result = result + '<span class = "span_' + color + '">';
    }
    return result;
}

export {
    ansi2html_zz,
    decodeBase64Content,
    encodeBase64Content
}