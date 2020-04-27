# jaxrs-postgresql-demo

Simple JAXRS application demo using JPA. It expects a data source bound under java:jboss/datasources/PostgreSQLDS

When it is deployed, it loads a set of test data that can be retrieved via the following URL: http://servername/jaxrs-postgresql-demo/api/tasks


## openshift 4 running locally deploy this demo

https://github.com/robinjohnhopkins/springrest/blob/wildfly/wildfly/openshift-jee-sample1/wildflypostgresopenshift/README.md

## change source git branch

```
oc get buildconfig.build.openshift.io/wildfly-app -o json > build2.json


vim build2.json

        "source": {
            "git": {
                "uri": "https://github.com/robinjohnhopkins/jaxrs-postgresql-demo.git",
                "ref":"addgui"
            },
            "type": "Git"
        },


oc replace  buildconfig.build.openshift.io/wildfly-app -f  build2.json

oc start-build buildconfigs/wildfly-app

```

new url to check branch working:

```
http://wildfly-app-wildfly-demo.apps-crc.testing/jaxrs-postgresql-demo/api/rest/numbers

["1581476052091","1581476052094","1581476052094","1581476052094","1581476052094","1581476052094","1581476052094","1581476052094","1581476052094","1581476052094"]
```

## add index.html to jakarta app

Add new file:
src/main/webapp/WEB-INF/web.xml

```
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://xmlns.jcp.org/xml/ns/javaee" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd" version="3.1">
    <display-name>bottom-up-web-service</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
        <welcome-file>index.htm</welcome-file>
        <welcome-file>index.jsp</welcome-file>
        <welcome-file>default.html</welcome-file>
        <welcome-file>default.htm</welcome-file>
        <welcome-file>default.jsp</welcome-file>
    </welcome-file-list>
</web-app>
```

Add html file
src/main/webapp/index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Spring boot index page example</title>
</head>
<body>
This is an index page available inside webapp/index.html
<br>
deployed here
<br>
http://wildfly-app-wildfly-demo.apps-crc.testing/jaxrs-postgresql-demo/index.html
</body>
</html>
```

## package.json entry affects static url prefix
```
{
  "name": "reactui",
  "version": "0.1.0",
  "private": true,
  "homepage": "/jaxrs-postgresql-demo",
```

## build js and css then add to java static content

```
    cd reactui
    REACT_APP_PUBLIC_URL='/jaxrs-postgresql-demo' npm run build
    cp -R  build/* ../src/main/webapp/
    cd ..


NB: just put above into a script, just run following each time you change the ui:

    ./build.js.and.css.then.add.to.java.static.content.sh
```

Then commit to git and build in openshift and deploy.

## install openjdk mac

```
$ brew tap AdoptOpenJDK/openjdk
```

The above will add more repositories to brew.

```
$ brew cask install adoptopenjdk8
```

## Debugging Java Applications On OpenShift and Kubernetes

on open shift ui
top right, click your Name, Copy Login Command

```
oc login --token=IYoRurL1V..._65_A --server=https://api.ca-central-1.starter.openshift-online.com:6443

oc get pods  # To get the name of the running pod you will sync to

oc port-forward <pod_name> 8787:8787 # Replace <pod_name> with the value from the previous step
```

In intellij
Run - edit configurations - '+' - Remote - Name remote, host: localhost, port 8787
debug and add breakpoints etc...

### breakpoints don't stop?

Please try Intellij - 'File (IDEA) - Invalidate Caches/Restart...'.
Worked for me. But then I also installed jdk11 that openshift was using AND redeployed, recreated routes.
So one of those things :)


## Example endpoints:

https://rt1-tomtest.apps.ca-central-1.starter.openshift-online.com/jaxrs-postgresql-demo/api/tasks

https://rt1-tomtest.apps.ca-central-1.starter.openshift-online.com/jaxrs-postgresql-demo/api/rest/task

https://rt1-tomtest.apps.ca-central-1.starter.openshift-online.com/jaxrs-postgresql-demo/api/rest/numbers

https://rt1-tomtest.apps.ca-central-1.starter.openshift-online.com/jaxrs-postgresql-demo/api/tasks/books

https://rt1-tomtest.apps.ca-central-1.starter.openshift-online.com/jaxrs-postgresql-demo/

# Use with s2i source to image - can be used with kubernetes and docker

## build s2i

OpenShift takes care of the details and creates a final image containing the server and the application.
Internally, it uses the Source-To-Image (S2I) tool. During this process, the WildFly server is 
provisioned by Galleon, and our demo JAX-RS application is built and copied into the 
$WILDFLY_HOME/deployments folder (openshift).

https://github.com/openshift/source-to-image

We do not need the full server to run our example, for example, we do not need the ejb3, 
remoting or messaging subsystems. We can specify a set of Galleon layers by using the 
GALLEON_PROVISION_LAYERS environment variable to reduce the server footprint. This 
environment variable contains a comma-separated list of layer names you want to use to 
provision your server during the S2I phase. It is important to understand that the server 
provisioning is done in OpenShift by a Build Config resource, so we need to make this 
variable available as a build environment variable. Notice that these details usually 
are hidden to you when you are using a template or an Operator.

note1: when running in container, this file exists
```
/opt/wildfly/bin/standalone.sh  # inside is a file that gets sourced(executed):
    RUN_CONF="$DIRNAME/standalone.conf"
```

note2:
```
if [ "${configureMode}" = "cli" ]; then		# must be set for MYSQL cli bit
```

note3:
```
function getDataSourceConfigureMode() {
  # THe extra +x makes this check whether the variable is unset, as '' is a valid value
  if [ -z ${DS_CONFIGURE_MODE+x} ]; then
    getConfigurationMode "<!-- ##DATASOURCES## -->" "DS_CONFIGURE_MODE"
  fi
  printf -v "$1" '%s' "${DS_CONFIGURE_MODE}"
}
```


note4: near end of build - more clues as to how the s2i works
```
INFO Copying deployments from target to /deployments...
'/tmp/src/target/jaxrs-postgresql-demo.war' -> '/deployments/jaxrs-postgresql-demo.war'
INFO Copying server to /s2i-output
INFO Linking /opt/wildfly to /s2i-output
Build completed successfully
. . .
Step 2/7 : COPY --from=myjaxrs-s2i-img:latest /s2i-output/server $JBOSS_HOME
```


note5: in running container - you can see the dir created in src compile step
```
echo $JBOSS_HOME
/opt/wildfly
[jboss@e4e23ab7b854 wildfly]$ ll $JBOSS_HOME
total 540
-rw-rw-r-- 1 jboss root  26530 Apr 24 10:21 LICENSE.txt
-rw-rw-r-- 1 jboss root   2224 Apr 24 10:21 README.txt
drwxrwxr-x 1 jboss root   4096 Apr 24 10:21 bin
-rw-rw-r-- 1 jboss root   2451 Apr 24 10:21 copyright.txt
drwxrwxr-x 1 jboss root   4096 Apr 24 10:21 docs
-rw-rw-r-- 1 jboss root 488837 Apr 24 10:21 jboss-modules.jar
drwxrwxr-x 1 jboss root   4096 Apr 24 10:21 modules
drwxrwxr-x 1 jboss root   4096 Apr 24 10:28 standalone
```

note6: build and specify mysql
```
cd ~/workspace/openshift-quickstarts/wildfly-s2i
build as per README
cd ~/workspace/openshift-quickstarts/wildfly-s2i/tools
./build-app-image.sh ~/workspace-spring-tool-suite/spring-rest/rjhRest/springrest/wildfly/openshift-jee-sample1/wildflypostgresopenshift/jaxrs-postgresql-demo/jaxrs-postgresql-demo --app-name=myjaxrs \
--galleon-layers=datasources-web-server,jaxrs-server,mysql-datasource  \
--wildfly-builder-image=wildfly/wildfly-centos7:dev
```

The missing bit was mysql-datasource, when specified it will modify standalone.xml
in the container to configure a mysql db. This can be replaced with postgresql-datasource
for a postgres db.


##create mysql in docker
```
docker run --name=testsql -p 3306:3306   -e MYSQL_ROOT_PASSWORD=password -d mysql
docker exec -it testsql  /bin/bash
mysql -p
create database wilddb;
exit
exit
```

## run and link to above - 'db' is virtual docker hostname of mysql server

```
docker run --link testsql:db  -p 8080:8080   --env OPENSHIFT_MYSQL_DB_HOST=db \
--env MYSQL_SERVICE_HOST=db --env MYSQL_SERVICE_PORT=3306  --env MYSQL_DATABASE=wilddb \
--env  DEFAULT_DATASOURCE=MysqlDS  --env MYSQL_DATASOURCE=MysqlDS --env  MYSQL_USER=root \
--env  MYSQL_PASSWORD=password     myjaxrs
```

### within standalone.xml this is the DB setup that maps to the above env settings

```
<datasource jndi-name="java:jboss/datasources/${env.OPENSHIFT_MYSQL_DATASOURCE,env.MYSQL_DATASOURCE:MySQLDS}" 
pool-name="MySQLDS" enabled="true" use-java-context="true" use-ccm="true" statistics-enabled="${wildfly.datasources.statistics-enabled:${wildfly.statistics-enabled:false}}">
<connection-url>jdbc:mysql://${env.MYSQL_SERVICE_HOST, env.OPENSHIFT_MYSQL_DB_HOST}:
${env.MYSQL_SERVICE_PORT,env.OPENSHIFT_MYSQL_DB_PORT}/
${env.MYSQL_DATABASE, env.OPENSHIFT_MYSQL_DB_NAME}
</connection-url>
```


### wildly variable expansion examples
```
${jboss.bind.address.management:127.0.0.1}
```
This means that the value should derive from a system property named jboss.bind.address.management 
and if it is not defined use as fallback 127.0.0.1.
```
<interface name="public">
    <inet-address value="${jboss.bind.address,env.HOST:192.168.10.1}"/>
</interface>
```
In the above example, at first the Java system property jboss.bind.address is evaluated and, 
if included, used. Otherwise the env.HOST Environment variable is checked. 
If none is used, the interface is assigned the fallback expression 192.168.10.1

```
<datasource jndi-name="java:jboss/datasources/MysqlDS” 
pool-name="MySQLDS" enabled="true" use-java-context="true" use-ccm="true" statistics-enabled="false">
<connection-url>jdbc:mysql://host.docker.internal:3306/wilddb
</connection-url>

                    <security>
                        <user-name>${env.MYSQL_USER,env.OPENSHIFT_MYSQL_DB_USERNAME}</user-name>
                        <password>${env.MYSQL_PASSWORD,env.OPENSHIFT_MYSQL_DB_PASSWORD}</password>
                    </security>
```


note7: test tcp python from inside docker - shows host.docker.internal usage and connection to mysql running localhost
```
#!/usr/bin/python

import sys, socket
from time import sleep

def fred():
    try:
        s = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        print("well")
        result = s.connect_ex(('host.docker.internal',3306))
        print("well")
        s.send(('hey sent'))
        print("rcving....")
        while True:
            data = s.recv(1024)
            if not data:
                break
            print("rcv")
            print(data)
        sleep(1)
        print("done rcving")
        s.close()
        print("closed well")
    except:
        print("fuzzing crashed")
        sys.exit(0)

fred()
```


note 8:    #docker images   # having tidied all docker and built two s2i images only
```
REPOSITORY                        TAG                 IMAGE ID            CREATED             SIZE
wildfly/wildfly-runtime-centos7   dev                 c732f8e1f6a1        4 minutes ago       443MB
wildfly/wildfly-runtime-centos7   latest              c732f8e1f6a1        4 minutes ago       443MB
wildfly/wildfly-centos7           dev                 bcf08c9e99ca        18 minutes ago      1.26GB
wildfly/wildfly-centos7           latest              bcf08c9e99ca        18 minutes ago      1.26GB
centos/s2i-base-centos7           latest              30b8e265b997        6 weeks ago         490MB
centos                            7                   5e35e350aded        5 months ago        203MB
```



note9:
turn off local mysql if necessary (mac)
```
vim /usr/local/opt/mysql@5.7//.bottle/etc/my.cnf
# Default Homebrew MySQL server config
[mysqld]
# Only allow connections from localhost 127.0.0.1
#bind-address = 127.0.0.1
bind-address            = 0.0.0.0             # any address

brew services list
Name           Status  User             Plist
docker-machine stopped                  
mysql@5.7      started robinjohnhopkins /Users/robinjohnhopkins/Library/LaunchAgents/homebrew.mxcl.mysql@5.7.plist
$ brew services restart mysql@5.7
Stopping `mysql@5.7`... (might take a while)
==> Successfully stopped `mysql@5.7` (label: homebrew.mxcl.mysql@5.7)
==> Successfully started `mysql@5.7` (label: homebrew.mxcl.mysql@5.7)
```



## Check this post to learn more about OpenShift and Galleon layers.
https://wildfly.org/news/2019/03/01/Galleon_Openshift/


For our demo example on OpenShift, we instruct Galleon to provision our server with these two Galleon Layers: jaxrs-server and postgresql-datasource.

The jaxrs-server layer provisions the server with some features needed to run our example e.g. cdi, jaxrs, jpa, undertow, transactions, datasources. It belongs to the default Galleon pack which is used to provision the default WildFly server.

The postgresql-datasource layer comes from WildFly Datasources Galleon Pack. This layer adds to the server the PostgreSQL drivers and specific PostgreSQL data source configuration. It allows us to configure the PostgreSQL data source by using the following variables:

POSTGRESQL_DATABASE

POSTGRESQL_SERVICE_PORT

POSTGRESQL_SERVICE_HOST

POSTGRESQL_PASSWORD

POSTGRESQL_USER

Let us create our WildFly container then configuring the data source to connect to our PostgreSQL server running in a different pod:

```
$ oc new-app --name wildfly-app \
     https://github.com/yersan/jaxrs-postgresql-demo.git \
     --image-stream=wildfly \
     --env POSTGRESQL_SERVICE_HOST=database-server \
     --env POSTGRESQL_SERVICE_PORT=5432 \
     --env POSTGRESQL_USER=postgre \
     --env POSTGRESQL_PASSWORD=admin \
     --env POSTGRESQL_DATABASE=demodb \
     --env POSTGRESQL_DATASOURCE=PostgreSQLDS \
     --build-env GALLEON_PROVISION_LAYERS=jaxrs-server,postgresql-datasource
--> Found image 38b29f9 (3 weeks old) in image stream "openshift/wildfly" under tag "latest" for "wildfly"
```
