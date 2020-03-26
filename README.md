# jaxrs-postgresql-demo

Simple JAXRS application demo using JPA. It expects a data source bound under java:jboss/datasources/PostgreSQLDS

When it is deployed, it loads a set of test data that can be retrieved via the following URL: http://servername/jaxrs-postgresql-demo/api/tasks


## openshift 4 running locally deploy this demo

https://github.com/robinjohnhopkins/springrest/blob/wildfly/wildfly/openshift-jee-sample1/wildflypostgresopenshift/README.md


## deploy to real open shift with mysql rather than postgres

on branch mysql is the only code change needed:

```
src/main/resources/META-INF/persistence.xml 
@@ -2,11 +2,12 @@
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="2.2"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd">
    <persistence-unit name="demo-PU">
        <jta-data-source>java:jboss/datasources/PostgreSQLDS</jta-data-source>
        <jta-data-source>java:jboss/datasources/MysqlDS</jta-data-source>
        <properties>
            <property name="javax.persistence.schema-generation.database.action" value="drop-and-create"/>
            <property name="javax.persistence.sql-load-script-source" value="META-INF/sql/data.sql" />
            <property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect"/>
            <property name="hibernate.dialect" value="org.hibernate.dialect.MySQL5Dialect"/>
            <!--<property name="hibernate.dialect" value="org.hibernate.dialect.PostgreSQLDialect"/>-->
            <property name="hibernate.show_sql" value="true"/>
        </properties>
    </persistence-unit>
```
    
Then my starting point was JBoss Web Server 3.1 Apache Tomcat 8 + MySQL (with https) on OpenShift

https://github.com/robinjohnhopkins/openshift-quickstarts/tree/master/todolist

which already had mysql setup.

turn the tomcat deploy to zero instances.

create a wildfly build

```
kind: BuildConfig
apiVersion: build.openshift.io/v1
metadata:
  name: wildfly
  namespace: tomtest
  selfLink: /apis/build.openshift.io/v1/namespaces/tomtest/buildconfigs/wildfly
  uid: c5d302ee-6ba0-11ea-be3b-0a580a820009
  resourceVersion: '218378806'
  creationTimestamp: '2020-03-21T18:21:24Z'
  labels:
    app: wildfly
    app.kubernetes.io/component: wildfly
    app.kubernetes.io/instance: wildfly
    app.kubernetes.io/name: wildfly
    app.kubernetes.io/part-of: wildfly-app
    app.openshift.io/runtime: wildfly
    app.openshift.io/runtime-version: '17.0'
  annotations:
    app.openshift.io/vcs-ref: master
    app.openshift.io/vcs-uri: 'https://github.com/openshift/openshift-jee-sample.git'
spec:
  nodeSelector: null
  output:
    to:
      kind: ImageStreamTag
      name: 'wildfly:latest'
  resources:
    limits:
      cpu: 100m
      memory: 1Gi
  successfulBuildsHistoryLimit: 5
  failedBuildsHistoryLimit: 5
  strategy:
    type: Source
    sourceStrategy:
      from:
        kind: ImageStreamTag
        namespace: openshift
        name: 'wildfly:17.0'
  postCommit: {}
  source:
    type: Git
    git:
      uri: 'https://github.com/robinjohnhopkins/jaxrs-postgresql-demo'
      ref: mysql
  triggers:
    - type: Generic
      generic:
        secretReference:
          name: wildfly-generic-webhook-secret
    - type: ImageChange
      imageChange:
        lastTriggeredImageID: >-
          image-registry.openshift-image-registry.svc:5000/openshift/wildfly@sha256:5a20dd8d9bfe99d9c192c2385fa55daa929ee488068de4ad0b95d397d3cc46a5
    - type: ConfigChange
  runPolicy: Serial
status:
  lastVersion: 7
```

Then for the deploy, nick the env vars and secret from the tomcat

```
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
  annotations:
    app.openshift.io/vcs-ref: master
    app.openshift.io/vcs-uri: 'https://github.com/openshift/openshift-jee-sample.git'
  selfLink: /apis/apps.openshift.io/v1/namespaces/tomtest/deploymentconfigs/wildfly
  resourceVersion: '218401669'
  name: wildfly
  uid: c5d46ab3-6ba0-11ea-be3b-0a580a820009
  creationTimestamp: '2020-03-21T18:21:24Z'
  generation: 27
  namespace: tomtest
  labels:
    app: wildfly
    app.kubernetes.io/component: wildfly
    app.kubernetes.io/instance: wildfly
    app.kubernetes.io/name: wildfly
    app.kubernetes.io/part-of: wildfly-app
    app.openshift.io/runtime: wildfly
    app.openshift.io/runtime-version: '17.0'
spec:
  strategy:
    type: Rolling
    rollingParams:
      updatePeriodSeconds: 1
      intervalSeconds: 1
      timeoutSeconds: 600
      maxUnavailable: 25%
      maxSurge: 25%
    resources: {}
    activeDeadlineSeconds: 21600
  triggers:
    - type: ImageChange
      imageChangeParams:
        automatic: true
        containerNames:
          - wildfly
        from:
          kind: ImageStreamTag
          namespace: tomtest
          name: 'wildfly:latest'
        lastTriggeredImage: >-
          image-registry.openshift-image-registry.svc:5000/tomtest/wildfly@sha256:59fe60be49c7aae718d9d32c0751504a00d7238c3eea5a350bea7918b4b9077a
    - type: ConfigChange
  replicas: 1
  revisionHistoryLimit: 10
  test: false
  selector:
    app: wildfly
    deploymentconfig: wildfly
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: wildfly
        deploymentconfig: wildfly
    spec:
      volumes:
        - name: jws-certificate-volume
          secret:
            secretName: jws-app-secret
            defaultMode: 420
      containers:
        - resources: {}
          terminationMessagePath: /dev/termination-log
          name: wildfly
          env:
            - name: DB_SERVICE_PREFIX_MAPPING
              value: jws-app-mysql=DB
            - name: DB_JNDI
              value: 'java:jboss/datasources/MysqlDS'
            - name: DB_USERNAME
              value: useryFs
            - name: DB_PASSWORD
              value: nB1l0nMb
            - name: DB_DATABASE
              value: root
            - name: DB_MIN_POOL_SIZE
            - name: DB_MAX_POOL_SIZE
            - name: DB_TX_ISOLATION
            - name: JWS_HTTPS_CERTIFICATE_DIR
              value: /etc/jws-secret-volume
            - name: JWS_HTTPS_CERTIFICATE
              value: server.crt
            - name: JWS_HTTPS_CERTIFICATE_KEY
              value: server.key
            - name: JWS_HTTPS_CERTIFICATE_PASSWORD
            - name: JWS_ADMIN_USERNAME
              value: BOjpmkLH
            - name: JWS_ADMIN_PASSWORD
              value: mr4pY65t
            - name: CACERTFILENAME
              value: /etc/jws-secret-volume/server.crt
            - name: CLIENTCERTFILENAME
              value: /etc/jws-secret-volume/server.crt
            - name: CLIENTKEYFILENAME
              value: /etc/jws-secret-volume/server.key
            - name: DEBUG
              value: 'true'
          ports:
            - containerPort: 8080
              protocol: TCP
            - containerPort: 8778
              protocol: TCP
          imagePullPolicy: Always
          volumeMounts:
            - name: jws-certificate-volume
              readOnly: true
              mountPath: /etc/jws-secret-volume
          terminationMessagePolicy: File
          image: >-
            image-registry.openshift-image-registry.svc:5000/tomtest/wildfly@sha256:59fe60be49c7aae718d9d32c0751504a00d7238c3eea5a350bea7918b4b9077a
      restartPolicy: Always
      terminationGracePeriodSeconds: 30
      dnsPolicy: ClusterFirst
      securityContext: {}
      schedulerName: default-scheduler
status:
  observedGeneration: 27
  details:
    message: manual change
    causes:
      - type: Manual
  availableReplicas: 1
  unavailableReplicas: 0
  latestVersion: 10
  updatedReplicas: 1
  conditions:
    - type: Progressing
      status: 'True'
      lastUpdateTime: '2020-03-26T20:01:16Z'
      lastTransitionTime: '2020-03-26T20:01:13Z'
      reason: NewReplicationControllerAvailable
      message: replication controller "wildfly-10" successfully rolled out
    - type: Available
      status: 'True'
      lastUpdateTime: '2020-03-26T20:01:51Z'
      lastTransitionTime: '2020-03-26T20:01:51Z'
      message: Deployment config has minimum availability.
  replicas: 1
  readyReplicas: 1
```

This is the gui

http://wildfly-app-wildfly-demo.apps-crc.testing/jaxrs-postgresql-demo/

this is a rest call

http://wildfly-app-wildfly-demo.apps-crc.testing/jaxrs-postgresql-demo/api/tasks

