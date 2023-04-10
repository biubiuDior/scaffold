#基础镜像
FROM 192.168.2.78:5000/library/nginx:latest

# 作者
MAINTAINER Kevin kevin@ly-sky.com

# VOLUME["/data/mcp"]

#工作目录
WORKDIR /usr/share/nginx

# 添加文件
ADD ly-ui-scaffold.tar.gz /usr/share/nginx/html

ADD nginx.conf /etc/nginx/nginx.conf

#添加启动脚本到容器中
ADD run.sh /opt/run.sh

#赋予脚本可执行权限
RUN chmod u+x /opt/run.sh

# 开放端口
EXPOSE 80

#连接时执行的命令
CMD ["/bin/bash"]

#启动时执行的命令
ENTRYPOINT /opt/run.sh
