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
