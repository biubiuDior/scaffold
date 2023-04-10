#!/bin/bash
#Date:nginx-1.12.1.tar.gz nginx-1.12.1.tar.gz 9:13 2017-9-18
#Author:nginx-1.12.1.tar.gz Create By Lingyuwang
#Mail:nginx-1.12.1.tar.gz nginx-1.12.1.tar.gz lingyuwang@ly-sky.com
#Function:nginx-1.12.1.tar.gz start nginx
#Version:nginx-1.12.1.tar.gz 1.0

###############################
#########CAS 激活状态配置##########
###############################
casEnable=false

if   [ $Cas_Enable ];
then
    casEnable=$Cas_Enable
fi

echo "casEnable=$casEnable"

sed -i 's/_casStatus/'"$casEnable"'/g' /usr/share/nginx/html/index.html

###############################
#########CAS 登录地址配置##########
###############################
casLoginUrl=""

if   [ $Cas_LoginURL ];
then
    casLoginUrl=$Cas_LoginURL
fi

echo "casLoginUrl=$casLoginUrl"

sed -i 's|_casLoginUrl|'"$casLoginUrl"'|g' /usr/share/nginx/html/index.html


###############################
#########CAS 登出地址配置##########
###############################
casLogoutUrl=""

if   [ $Cas_LogoutURL ];
then
    casLogoutUrl=$Cas_LogoutURL
fi

echo "casLogoutUrl=$casLogoutUrl"

sed -i 's|_casLogoutUrl|'"$casLogoutUrl"'|g' /usr/share/nginx/html/index.html

###############################
######### 网关##########
###############################
gateway_version=""

if   [ $Gateway_Version ];
then
    gateway_version=$Gateway_Version
fi

echo "$gatewayVersion=$Gateway_Version"

sed -i 's|_gateway_version|'"$gateway_version"'|g' /usr/share/nginx/html/index.html

###############################
######### 状态##########
###############################
casStatus=""

if   [ $Cas_Status ];
then
    casStatus=$Cas_Status
fi

echo "casStatus=$Cas_Status"

sed -i 's|_casStatus|'"$casStatus"'|g' /usr/share/nginx/html/index.html

###############################
######### Case_URL##########
###############################
cas_url=""

if   [ $Cas_URL ];
then
    cas_url=$Cas_URL
fi

echo "cas_url=$Cas_URL"

sed -i 's|_cas_url|'"$cas_url"'|g' /usr/share/nginx/html/index.html

###############################
######### 运维监控 激活状态配置 ###########
###############################
apmEnable=""

if   [ $ApmEnable ];
then
    apmEnable=$ApmEnable
fi

echo "apmEnable=$ApmEnable"

sed -i 's|_apmEnable|'"$apmEnable"'|g' /usr/share/nginx/html/index.html

###############################
######### 运维监控 apm服务地址 ###########
###############################
apmHost=""

if   [ $ApmHost ];
then
    apmHost=$ApmHost
fi

echo "apmHost=$ApmHost"

sed -i 's|_apmHost|'"$apmHost"'|g' /usr/share/nginx/html/index.html

sleep 3s
echo 'abcd'
RUN yum -y install fontconfig ttmkfdir wget \
&& wget -O /usr/share/fonts/simsun.ttc http://docker.abc.com/download/fonts/simsun.ttc \
&& chmod -R 755 /usr/share/fonts/ \
&& ttmkfdir -e /usr/share/X11/fonts/encodings/encodings.dir \
&& fc-cache
/usr/sbin/nginx -g  "daemon off;"


