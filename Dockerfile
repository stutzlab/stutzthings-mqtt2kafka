FROM node:8.6.0

ENV work_dir /usr/src/app/
ENV KAFKA_ZOOKEEPER_CONNECT localhost:2181

WORKDIR ${work_dir}

#Optimize building time. Cache npm install on this layer so that it is cached between code updates.
ADD src/package.json ${work_dir}
RUN npm install

ADD src/ ${work_dir}
EXPOSE 1883 8883 80 443

CMD ["npm", "start"]
