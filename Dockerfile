FROM node:8.6.0

ENV work_dir /usr/src/app/

WORKDIR ${work_dir}

#Optimize building time. Cache npm install on this layer so that it is cached between code updates.
ADD src/package.json ${work_dir}
RUN npm install

ADD src/ ${work_dir}

CMD ["npm", "start"]
