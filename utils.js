const { execSync } = require("child_process");
const fs = require("fs");
const decompName = "RabbitLauncher0517";
const base = `${decompName}_decompile_xml`;

//these next 2 functions are taken from
//https://annabelsandford.github.io/rabbit-r1-imeigen/imei_check_v1.html

function calculateChecksum(imeiWithoutChecksum) {
    let imeiArray = imeiWithoutChecksum.split("").map(Number);
    let sum = 0;
    let double = false;
    for (let i = 0; i < imeiArray.length; i++) {
        let digit = imeiArray[i];
        if (double) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        double = !double;
    }
    let checksum = (10 - (sum % 10)) % 10;
    return String(checksum);
}

function generateIMEI() {
    const TAC = "35847631";
    const serialNumberPrefix = "00";
    let serialNumber = serialNumberPrefix;
    for (let i = 0; i < 4; i++) {
        serialNumber += Math.floor(Math.random() * 10);
    }
    let imeiWithoutChecksum = TAC + serialNumber;
    let checksum = calculateChecksum(imeiWithoutChecksum);
    let generatedIMEI = imeiWithoutChecksum + checksum;
    return generatedIMEI;
}

function decomp() {
    execSync(
        `java -jar APKEditor.jar d -i ${decompName}.apk`,
        (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
        }
    );
}

function modifyFunc(path, modifyWith) {
    let start = -1;
    let end = -1;
    try {
        let data = fs.readFileSync(path, "utf8");
        let lineArr = data.split("\n");
        let iter = 0;

        lineArr.forEach((element) => {
            if (element.includes(modifyWith[0])) {
                start = lineArr.indexOf(element);
            }
            if (start > 0 && end < 0) {
                if (element.includes(modifyWith[modifyWith.length - 1])) {
                    end = iter;

                    for (let i = start; i <= end; i++) {
                        if (modifyWith[i - start] !== undefined)
                            lineArr[i] = modifyWith[i - start];
                        else lineArr[i] = "";
                    }
                }
            }
            element.replace("    ", "\n");
            iter++;
        });

        fs.writeFileSync(path, lineArr.join("\n"), "utf-8");
        console.log("File modified successfully");
    } catch (err) {
        console.error("Error reading or writing file", err);
    }
}

function replaceLib(newLibLocation, oldLib) {
    fs.copyFileSync(
        newLibLocation,
        `./${base}/root/lib/arm64-v8a/${oldLib}`
    );
}

function replaceStringInManifest(name, value) {
    const file = fs.readFileSync(`${base}/AndroidManifest.xml`);
    let content = file.toString()
    content = content.split("\n");
    content.forEach((line) => {
        const lineIndex = content.indexOf(line);
            if (line.includes(name)) {
                console.log(line)
                line = line.split(`"`);
                line[1] = value;
                line = line.join(`"`);
                content[lineIndex] = line;
            }
        });
    content = content.join("\n");
    fs.writeFileSync(`${base}/AndroidManifest.xml`, content);
}

function build() {
    execSync(`java -jar APKEditor.jar b -i ${base}`);

    execSync(
        `java -jar uber-apk-signer-1.2.1.jar -a ${base}_out.apk`
    );
}

module.exports = { generateIMEI, decomp, modifyFunc, replaceLib, build, replaceStringInManifest }