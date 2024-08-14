const fs = require("fs");
const {functions} = require("./functions");
const {decomp, modifyFunc, replaceLib, build, replaceStringInManifest} = require("./utils");
const settings = require("./settings.json");

const decompName = "RabbitLauncher0517";
const base = `${decompName}_decompile_xml`;

const appVersion = "20240615.10-dirty";

decomp();

if(settings.server_ip !== "") {
    functions.functions.push({
        location: "smali/classes/tech/rabbit/r1launcher/RLApp.smali",
        code: [
            "sget-object v0, Ltech/rabbit/r1launcher/wss/WebSocketManager;->INSTANCE:Ltech/rabbit/r1launcher/wss/WebSocketManager;",
            `const-string v2, "${settings.serverIP}"`,
            "invoke-virtual {v0, v2}, Ltech/rabbit/r1launcher/wss/WebSocketManager;->setRabbitServiceUrl(Ljava/lang/String;)V"        
        ]
    })
    let file = fs.readFileSync(`./${base}/AndroidManifest.xml`).toString();
    file = file.split("\n");
    file.forEach(line => {
        if(line.includes("<application")) {
            const lineIndex = file.indexOf(line);
            // +2 because 0 makes it so that it's behind the <application> tag
            file.splice(lineIndex+2, 0, `android:usesCleartextTraffic="true"`);
        }
    })
    fs.writeFileSync(`./${base}/AndroidManifest.xml`, file.join("\n"));
}

if(settings.r1_mode === true) {
    functions.functions[3].code[5] = "const/16 p0, 0x50"
    functions.functions[4].code[2] = "const/16 p0, 0x50"
}

functions.functions.forEach(func => {
    modifyFunc(`./${base}/`+func.location, func.code)
})

replaceStringInManifest("android:versionName", `${appVersion}`)
replaceLib("./libbase.so", "libbase.so");

if(fs.existsSync(`./${decompName}_out.apk`)) fs.rmSync(`./${decompName}_out.apk`);
if(fs.existsSync(`./${decompName}_Patched.apk`)) fs.rmSync(`./${decompName}_Patched.apk`);

build();

fs.renameSync(
    `${base}_out-aligned-debugSigned.apk`,
    `${decompName}_Patched.apk`
);

fs.rmdirSync(base, { force: true, recursive: true});
fs.rmSync(`${base}_out.apk`);

console.log(`Your patched apk filename is: ${decompName}_Patched.apk !`)