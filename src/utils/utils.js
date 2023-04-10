/*
 * @Description: 通用工具类
 * @Author: admin
 * @Date: 2020-03-06 09:45:52
 * @LastEditors: wucuiyi
 * @LastEditTime: 2023-03-09 10:44:59
 */
import pathToRegexp from 'path-to-regexp';
import { Base64 } from 'js-base64';
// 引入加密解密插件
import { JSEncrypt } from 'jsencrypt';
// 引入加密所需公钥 引入解密所需私钥
import { cryptKey } from '@/config/global';
import { getFontSize } from './user';

/**
 * 获取元素距离可视区域顶部、左部的距离
 * @param {*} ele
 * @returns
 */
export const getOffset = ele => {
  var top = ele.offsetTop;
  var left = ele.offsetLeft;
  while (ele.offsetParent) {
    ele = ele.offsetParent;
    if (window.navigator.userAgent.indexOf('MSTE 8') > -1) {
      top += ele.offsetTop;
      left += ele.offsetLeft;
    } else {
      top += ele.offsetTop + ele.clientTop;
      left += ele.offsetLeft + ele.clientLeft;
    }
  }
  return {
    left: left,
    top: top,
  };
};

/**
 * 获取窗口信息
 * @returns
 */
export const getSize = () => {
  let windowW, windowH, contentH, contentW, scrollT;
  windowH = window.innerHeight;
  windowW = window.innerWidth;
  scrollT = document.documentElement.scrollTop || document.body.scrollTop;
  contentH =
    document.documentElement.scrollHeight > document.body.scrollHeight
      ? document.documentElement.scrollHeight
      : document.body.scrollHeight;
  contentW =
    document.documentElement.scrollWidth > document.body.scrollWidth
      ? document.documentElement.scrollWidth
      : document.body.scrollWidth;
  return { windowW, windowH, contentH, contentW, scrollT };
};

export const decode = input => {
  let _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let chr1, chr2, chr3;
  let enc1, enc2, enc3, enc4;
  let i = 0;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  while (i < input.length) {
    enc1 = _keyStr.indexOf(input.charAt(i++));
    enc2 = _keyStr.indexOf(input.charAt(i++));
    enc3 = _keyStr.indexOf(input.charAt(i++));
    enc4 = _keyStr.indexOf(input.charAt(i++));
    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;
    output = output + String.fromCharCode(chr1);
    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }
  }
  output = _utf8_decode(output);
  return output;
};

export const encode = input => {
  let _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  let i = 0;
  input = _utf8_encode(input);
  while (i < input.length) {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);
    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output =
      output +
      _keyStr.charAt(enc1) +
      _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) +
      _keyStr.charAt(enc4);
  }
  return output;
};

// private method for UTF-8 encoding
export const _utf8_encode = function(string) {
  string = string.replace(/\r\n/g, '\n');
  let utftext = '';
  for (let n = 0; n < string.length; n++) {
    let c = string.charCodeAt(n);
    if (c < 128) {
      utftext += String.fromCharCode(c);
    } else if (c > 127 && c < 2048) {
      utftext += String.fromCharCode((c >> 6) | 192);
      utftext += String.fromCharCode((c & 63) | 128);
    } else {
      utftext += String.fromCharCode((c >> 12) | 224);
      utftext += String.fromCharCode(((c >> 6) & 63) | 128);
      utftext += String.fromCharCode((c & 63) | 128);
    }
  }
  return utftext;
};

function _utf8_decode(utftext) {
  let string = '';
  let i = 0;
  let c = 0;
  let c1 = 0;
  let c2 = 0;
  let c3 = 0;
  while (i < utftext.length) {
    c = utftext.charCodeAt(i);
    if (c < 128) {
      string += String.fromCharCode(c);
      i++;
    } else if (c > 191 && c < 224) {
      c2 = utftext.charCodeAt(i + 1);
      string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      i += 2;
    } else {
      c2 = utftext.charCodeAt(i + 1);
      c3 = utftext.charCodeAt(i + 2);
      string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
      i += 3;
    }
  }
  return string;
}

//添加key
export const DateUtil = {
  dateAddKey: function(date) {
    var localCounter = 1;
    date.forEach(el => {
      el.key = localCounter++;
    });
    return date;
  },
  dataFormat: function(time) {
    //时间戳转时间 => yyyy-mm-dd hh:mm:ss
    let now = new Date(time);
    let year = now.getFullYear();
    let month = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
    let date = now.getDate() >= 10 ? now.getDate() : '0' + now.getDate();
    let hour = now.getHours() >= 10 ? now.getHours() : '0' + now.getHours();
    let minute = now.getMinutes() >= 10 ? now.getMinutes() : '0' + now.getMinutes();
    let second = now.getSeconds() >= 10 ? now.getSeconds() : '0' + now.getSeconds();
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
  },
};

/**
 * GBK字符集实际长度计算
 * @param {*} str
 * @returns
 */
export const getStrLength = str => {
  let realLength = 0;
  let len = str.length;
  let charCode = -1;
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      // 如果是中文则长度加2
      realLength += 2;
    }
  }
  return realLength;
};

/**
 * 格式化时间
 * @param {*} date
 * @returns
 */
export const transformDate = date => {
  var createAt = new Date(date);
  var time = new Date().getTime() - createAt.getTime(); //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return '';
  } else if (time / 1000 < 60) {
    return '刚刚';
  } else if (time / 60000 < 60) {
    return parseInt(time / 60000) + '分钟前';
  } else if (time / 3600000 < 24) {
    return parseInt(time / 3600000) + '小时前';
  } else if (time / 86400000 < 31) {
    return parseInt(time / 86400000) + '天前';
  } else if (time / 2592000000 < 12) {
    return parseInt(time / 2592000000) + '月前';
  } else {
    return parseInt(time / 31536000000) + '年前';
  }
};

/**
 * 获取路径权限
 * @param {*} pathname
 * @param {*} routeData
 * @returns
 */
export const getRouterAuthority = (pathname, routeData) => {
  let routeAuthority = ['noAuthority'];
  const getAuthority = (key, routes) => {
    routes.map(route => {
      if (route.path === key) {
        routeAuthority = route.authority;
      } else if (route.routes) {
        routeAuthority = getAuthority(key, route.routes);
      }
      return route;
    });
    return routeAuthority;
  };
  return getAuthority(pathname, routeData);
};

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
/**
 * 是否url
 * @param {*} path
 * @returns
 */
export const isUrl = path => {
  return reg.test(path);
};

/**
 * 获取url参数
 * @param {*} name
 * @returns
 */
export const getHashParam = name => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
    queryString = window.location.href.split('?')[1] || '',
    result = queryString.match(reg);
  return result ? decodeURIComponent(result[2]) : null;
};

/**
 * 转化url为列表
 * @param {*} url
 * @returns
 */
export const urlToList = url => {
  const urllist = url.split('/').filter(i => i);
  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
};

/**
 * 获取当前路径信息
 * @param {*} pathname
 * @param {*} breadcrumbNameMap
 * @returns
 */
export const matchParamsPath = (pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  return breadcrumbNameMap[pathKey];
};

/**
 * 校验密码
 * @param {*} value
 * @returns [0:小于6位不合格，1:弱，2: 中，3:强]
 */
export const checkPassword = value => {
  if (value === undefined || value === null) {
    return 0;
  }
  var strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g');
  var mediumRegex = new RegExp(
    '^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$',
    'g'
  );
  var enoughRegex = new RegExp('(?=.{6,}).*', 'g');
  let strong = 1;
  if (enoughRegex.test(value) == false) {
    //密码小于六位的时候
    strong = 0;
  } else if (strongRegex.test(value)) {
    //密码为八位及以上并且字母数字特殊字符三项都包括,强度最强
    strong = 3;
  } else if (mediumRegex.test(value)) {
    //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
    strong = 2;
  }
  return strong;
};

export const arrayMoveMutate = (array, from, to) => {
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
};
/**
 * 交换数组内两个值的位置
 * @param {*} array
 * @param {*} from
 * @param {*} to
 * @returns
 */
export const arrayMove = (array, from, to) => {
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
};

/**
 * 将数组按固定长度分割
 * @param {*} array
 * @param {*} subLength
 * @returns
 */
export const cutArray = (array, subLength) => {
  let index = 0;
  let newArr = [];
  while (index < array.length) {
    newArr.push(array.slice(index, (index += subLength)));
  }
  return newArr;
};

/**
 * 按指定长度分段字符串
 * @param str 传入的字符串(非空)
 * @param num 指定长度(正整数)
 * @returns Array(字符串数组)
 */
export function splitString(str, num) {
  if (str == null || str == undefined) return null;
  if (!/^[0-9]*[1-9][0-9]*$/.test(num)) return null;
  var array = new Array();
  var len = str.length;
  for (var i = 0; i < len / num; i++) {
    if ((i + 1) * num > len) {
      array.push(str.substring(i * num, len));
    } else {
      array.push(str.substring(i * num, (i + 1) * num));
    }
  }
  return array;
}

// 兼容requestAnimationFrame
export const compatibleAnimationFrame = () => {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
};

/**
 * 图片转化
 * @param {*} file
 * @returns
 */
export const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * 创建script标签加载js
 * @param {string} [url='']
 * @returns
 */
export const createScript = (url = '') => {
  let scriptTags = window.document.querySelectorAll('script');
  let len = scriptTags.length;
  let i = 0;
  // 截取字符串,去掉可能url是相对路径的
  url = url.indexOf('.') === 0 ? url.substr(1) : url;
  let _url = location.origin + url;
  return new Promise((resolve, reject) => {
    var isHas = false;
    for (i = 0; i < len; i++) {
      var src = scriptTags[i].src;
      if (src && src === _url) {
        isHas = true;
        resolve();
        // scriptTags[i].parentElement.removeChild(scriptTags[i]);
      }
    }
    if (!isHas) {
      let node = document.createElement('script');
      node.type = 'text/javascript';
      node.src = url;
      node.onload = resolve;
      document.body.appendChild(node);
    }
  });
};

/**
 * 获取UUID
 * @returns
 */
export const createUuid = () => {
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
};

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array, key, keyAlias = 'key') {
  if (!(array instanceof Array)) {
    return null;
  }
  const item = array.filter(_ => _[keyAlias] === key);
  if (item.length) {
    return item[0];
  }
  return null;
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(array, id = 'id', pid = 'pid', children = 'children') {
  let data = cloneDeep(array);
  let result = [];
  let hash = {};
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach(item => {
    let hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}

/**
 * getLabelValueTree
 * @version 171221 1.0
 * @param {Arr} data 数据源
 * @param {Arr} children 子类键名
 */
export const getLabelValueTree = (
  Data,
  label = 'label',
  value = 'value',
  children = 'children'
) => {
  var data = JSON.parse(JSON.stringify(Data));
  var tree = [];
  for (var i in data) {
    if (data[i][children] && data[i][children].length) {
      tree.push({
        label: data[i][label] || data[i][value],
        value: data[i][value],
        children: getLabelValueTree(data[i][children], label, value, children),
      });
    } else {
      tree.push({
        label: data[i][label] || data[i][value],
        value: data[i][value],
      });
    }
  }
  return tree;
};

/**
 * 根据label的值获取value
 * @version 171221 1.0
 * @param {Arr} data 数据源
 * @param {string} key label的值
 * @param {string} label label的键名
 * @param {string} value value的键名
 */
export const getValueFromArray = (Data = [], key = 'key', label = 'label', value = 'value') => {
  var data = JSON.parse(JSON.stringify(Data));
  let res = '';
  for (var i in data) {
    if (data[i][label] == key) {
      res = data[i][value];
      break;
    }
  }
  return res;
};

/**
 * 获取元素的属性
 * @version 171221 1.0
 * @param {node} obj 元素
 * @param {string} name 属性key
 */
export const getStyle = (obj, name) => {
  if (obj.currentStyle) {
    return obj.currentStyle[name];
  } else {
    return getComputedStyle(obj, false)[name];
  }
};

/**
 * 延时
 * @export
 * @param {*} timeout 延时时间ms
 * @returns
 */
export function delay(timeout = 700) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

/**
 * 文件转为字符串文件
 *
 * @export
 * @param {*} file
 * @returns
 */
export function transformFileToText(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}

/**
 * 兼容requestAnimationFrame
 *
 * @export
 */
export function animationFramePolyfill() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}

/**
 * 是否符合（中文、英文、汉字、汉字符号和 - _ 字符）
 * @param {*} text
 * @returns
 */
export function isAccordReg(text) {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5\~\！\@\#\￥\%\……\&\*\（\）\——\-\_\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、]+$/g;
  return reg.test(text);
}

/**
 * 是否符合（中文、英文和- _ 字符）
 * @param {*} text
 * @returns
 */
export function isSearchKeyReg(text) {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5\-\_]+$/g;
  return reg.test(text);
}

/**
 * 格式化数字 , 分隔
 *  689878 => 689,878
 * @export
 * @param {*} num
 * @returns
 */
export function toThousands(num) {
  var num = (num || 0).toString(),
    result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
}

/**
 * 在对象中查找是否存在某个字段
 * @param {Object} source 对象
 * @param {String} 路径，用逗号隔开(如 data,person,id为查找source.data.person.id)
 * @param {String} 未找到返回的值，默认返回undefined
 * @param {String} 字段间的间隔符号
 */
export function findValueFormObject(source, findStr, noVlaue = 'undefined', splitStr = ',') {
  var data = JSON.parse(JSON.stringify(source));
  let arr = findStr.split(splitStr);
  for (var i = 0; i < arr.length; i++) {
    if (data[arr[i]] != undefined) {
      data = data[arr[i]];
    } else {
      return noVlaue;
    }
  }
  return data;
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 加密
export function setEncrypt(val) {
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(cryptKey.pubKey);
  return encrypt.encrypt(val);
}

// 解密
export function getDecrypt(val) {
  let decrypt = new JSEncrypt();
  decrypt.setPrivateKey(cryptKey.privateKey);
  let decryptVal = decrypt.decrypt(val);
  return decryptVal;
}

/**
 * 如何用户没有设置字体大小，根据浏览器宽度设置根元素html的font-size
 * @param {Number} windowW 浏览器窗口宽度
 */
export function setRootFontSize(windowW = window.innerWidth) {
  let fontSizeCache = getFontSize();
  if (!fontSizeCache) {
    if (windowW < 1440) {
      fontSizeCache = 86;
    } else {
      fontSizeCache = 100;
    }
  }
  document.documentElement.style.fontSize = fontSizeCache + 'px';
}

/**
 * 根据根元素html的font-size对设计图的尺寸等比缩放
 * @param {Number} size 尺寸（设计图px值）
 * @returns 计算好的尺寸
 */
export function getPxToRemSize(size) {
  let rootFontSize = parseInt(document.documentElement.style.fontSize);
  return (size * rootFontSize) / 100;
}
