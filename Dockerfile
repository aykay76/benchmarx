FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/
COPY insights/ /usr/share/nginx/html/insights/
COPY platform-engineering/ /usr/share/nginx/html/platform-engineering/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY wds/ /usr/share/nginx/html/wds/
