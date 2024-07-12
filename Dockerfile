FROM node:16-alpine as build

WORKDIR /app

COPY package*.json yarn*.lock ./

# Set enviroments
ENV REACT_APP_STARCOIN_API_URL=https://doapi.stcscan.io
ENV REACT_APP_STARCOIN_NETWORKS=main,barnard,proxima,halley,vega

COPY . .

# Build project
RUN yarn install && yarn build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
