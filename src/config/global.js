/*
 * @Description: 页面内数据、配置
 * @Author: admin
 * @Date: 2020-03-13 09:48:32
 * @LastEditors: lixiaoxin
 * @LastEditTime: 2021-08-04 15:31:01
 */
module.exports = {
  query: {
    'screen-xs': {
      maxWidth: 575,
    },
    'screen-sm': {
      minWidth: 576,
      maxWidth: 767,
    },
    'screen-md': {
      minWidth: 768,
      maxWidth: 991,
    },
    'screen-lg': {
      minWidth: 992,
      maxWidth: 1199,
    },
    'screen-xl': {
      minWidth: 1200,
      maxWidth: 1599,
    },
    'screen-xxl': {
      minWidth: 1600,
    },
  },
  // 加解密所需
  cryptKey: {
    pubKey:'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJ8DUCb0CEFATRWU8BtBL42RvsdFBcpxYNfsg0P1f7Rd1qKLtqLSBBVGrJu148CdCAkxwKOsjvj5D4eMeDQCd18CAwEAAQ==',
    privateKey:'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAnwNQJvQIQUBNFZTwG0EvjZG+x0UFynFg1+yDQ/V/tF3Woou2otIEFUasm7XjwJ0ICTHAo6yO+PkPh4x4NAJ3XwIDAQABAkBHjUQZ4yF7yyVkmrpYaUKun3CLVmG+sLn1L3X5tJScYg+GeKOw1hAcZm3yqMc67wE6AJSy/PCVrtEA68lVYkhBAiEA1NwoDgrqZFF9K0WvgfGAPWwMFphZH/SYS08dFfltcPECIQC/PWcy79gy1S3Rm41+IO/JygMBA2l8pAZtTzlrxIZtTwIhAIH6qc7hZX26sPdCh0iPAuL+3mbRwuKbhn++IKGxfN3RAiAi5ZqKUff6tqnowODd7jazdNh9e9jo9KlzkuxgfPkmwwIgFG2huL8+Sis5YoqTfCjpLtvM3gJfY+UvpcWvmf+E/K4='
  }
};
