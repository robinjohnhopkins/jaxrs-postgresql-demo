

export default class Client {
    numbers(){
        let result = new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("GET","http://wildfly-app-wildfly-demo.apps-crc.testing/jaxrs-postgresql-demo/api/rest/numbers");
            request.onreadystatechange = () => {
                if(request.readyState === XMLHttpRequest.DONE) { // 4
                    var status = request.status;
                    if (status === 0 || (200 <= status && status < 400)) {
                        // The request has been completed successfully
                        let objectified = [];
                        let raw = request.responseText;
                        if (raw.length>0){
                            objectified = JSON.parse(raw);
                        }
                        resolve(objectified);
                    } else {
                        // Oh no! There has been an error with the request!
                        reject();
                    }
                }
            }
            request.send();
        });
        return result;
    }
}
