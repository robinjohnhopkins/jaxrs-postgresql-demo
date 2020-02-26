

export default class Client {
    numbers(){
        let result = new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open("GET","http://wildfly-app-wildfly-demo.apps-crc.testing/jaxrs-postgresql-demo/api/rest/numbers");
            request.onreadystatechange = () => {
                let raw = request.responseText;
                let objectified = [];
                if (raw.length>0){
                    objectified = JSON.parse(raw);
                }
                resolve(objectified);
            }
            request.send();
        });
        return result;
    }
}
