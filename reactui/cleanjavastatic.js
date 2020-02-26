var fs = require('fs');


function deleteFolderRecursive(path) {
    if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        console.log(`Deleting directory "${path}"...`);
        fs.rmdirSync(path);
    }
};

console.log("Cleaning java webapp static files...");

deleteFolderRecursive("../src/main/webapp/static");

let dirtotidy='../src/main/webapp/';
fs.readdir(dirtotidy, (error, files) => {
    if (error) throw error;
    let regex = /precache.*$/
    files.filter(name => regex.test(name)).forEach(n => fs.unlink(dirtotidy+n));
});

console.log("Successfully java webapp files!");
