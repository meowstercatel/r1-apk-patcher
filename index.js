const fs = require("fs");
const { execSync } = require("child_process");
const { Litterbox } = require("node-catbox");

const litterbox = new Litterbox();

//CHANGE THESE
let decompName = "RabbitLauncher0517"; //.apk file name without .apk
let uploadToLitterBox = false;
//CHANGE THESE ^^^^^^^^^^

let base = `${decompName}_decompile_xml`;

let imei = generateIMEI();

const getOSVersion = [
    `.method private final getOSVersion()Ljava/lang/String;`,
    `.locals 0`,
    `.line 49`,
    `const-string p0, "rabbit_OS_v0.8.86_20240523151103"`,
    `return-object p0`,
    `.end method`,
];

const getImei = [
    `.method public final getImei(Landroid/content/Context;)Ljava/lang/String;`,
    `.locals 0`,

    `.line 49`,
    `const-string p0, "${imei}"`,

    `return-object p0`,
    `.end method`,
];

const getDeviceId = [
    `.method public final getDeviceId()Ljava/lang/String;`,
    `.locals 0`,

    `.line 34`,
    `const-string p0, "${imei}"`,

    `return-object p0`,
    `.end method`,
];

const onKeyUp = [
    ".method public final onKeyUp(ILandroid/view/KeyEvent;)Z",
    ".locals 3",

    "const/4 p0, -0x1",

    "sput p0, Ltech/rabbit/r1launcher/rabbit/KeyEventHandler;->lastKey:I",

    "sput p1, Ltech/rabbit/r1launcher/rabbit/KeyEventHandler;->lastUpKey:I",

    "const/16 p0, 0x18",
    "if-eq p1, p0, :setter",

    "const/16 p0, 0x19",
    "if-eq p1, p0, :setter",

    "const/16 p0, 0x13",

    "if-eq p1, p0, :cond_0",

    "const/16 p0, 0x14",

    "if-eq p1, p0, :cond_0",

    "packed-switch p1, :pswitch_data_0",

    "goto :goto_0",

    ":setter",
    "const/16 p1, 0x1A",
    ":cond_0",
    ":pswitch_0",
];

const onKeyDown = [
    ".method public final onKeyDown(ILandroid/view/KeyEvent;)Z",
    ".locals 3",
    "const/16 p0, 0x18",
    "if-eq p1, p0, :setter",
    "const/16 p0, 0x19",
    "if-eq p1, p0, :setter",
    "const/16 p0, 0x13",
    "if-eq p1, p0, :cond_0",
    "const/16 p0, 0x14",
    "if-eq p1, p0, :cond_0",
    "packed-switch p1, :pswitch_data_0",
    "goto :goto_0",
    ":setter",
    "const/16 p1, 0x1A",
    ":cond_0",
    ":pswitch_0",
];

decomp();

modifyFunc(
    `.\\${base}\\smali\\classes\\tech\\rabbit\\r1launcher\\RLApp.smali`,
    getOSVersion
);

modifyFunc(
    `.\\${base}\\smali\\classes\\tech\\rabbit\\r1launcher\\settings\\utils\\SystemControllerUtil.smali`,
    getImei
);

modifyFunc(`.\\${base}\\smali\\classes\\AppConfig.smali`, getDeviceId);

modifyFunc(
    `.\\${base}\\smali\\classes\\tech\\rabbit\\r1launcher\\rabbit\\KeyEventHandler.smali`,
    onKeyUp
);
modifyFunc(
    `.\\${base}\\smali\\classes\\tech\\rabbit\\r1launcher\\rabbit\\KeyEventHandler.smali`,
    onKeyDown
);

replaceLib(".\\libbase.so", "libbase.so");

build();

fs.renameSync(
    `${base}_out-aligned-debugSigned.apk`,
    `${decompName}_Patched.apk`
);

fs.rmdirSync(`.\\${base}`);
fs.rmSync(`${base}_out.apk`);

if (uploadToLitterBox) {
    console.log("Uploading to LitterBox");
    litterbox
        .upload({
            path: `${decompName}_Patched.apk`,
            duration: "24h", // or omit to default to 1h
        })
        .then((response) =>
            console.log("Output uploaded to LitterBox! Link: " + response)
        );
}

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
            console.log("decompiled");
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
        `.\\${base}\\root\\lib\\arm64-v8a\\${oldLib}`
    );
}

function build() {
    execSync(`java -jar APKEditor.jar b -i ${base}`);

    execSync(
        `java -jar uber-apk-signer-1.2.1.jar -a ${decompName}_decompile_xml_out.apk`
    );
}
