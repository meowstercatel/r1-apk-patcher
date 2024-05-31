const fs = require("fs");
const {functions} = require("./functions");
const {decomp, modifyFunc, replaceLib, build} = require("./utils");
const settings = require("./settings.json");

const decompName = settings.apkFileName;

const base = `${decompName}_decompile_xml`;

decomp();

functions.functions.forEach(func => {
    modifyFunc(`./${base}/`+func.location, func.code)
})

// modifyFunc(
//     `./${base}/smali/classes/tech/rabbit/r1launcher/RLApp.smali`,
//     getOSVersion
// );

// modifyFunc(
//     `./${base}/smali/classes/tech/rabbit/r1launcher/settings/utils/SystemControllerUtil.smali`,
//     getImei
// );

// modifyFunc(`./${base}/smali/classes/AppConfig.smali`, getDeviceId);

// modifyFunc(
//     `./${base}/smali/classes/tech/rabbit/r1launcher/rabbit/KeyEventHandler.smali`,
//     onKeyUp
// );
// modifyFunc(
//     `./${base}/smali/classes/tech/rabbit/r1launcher/rabbit/KeyEventHandler.smali`,
//     onKeyDown
// );

// modifyFunc(
//     `./${base}/smali/classes/tech/rabbit/r1launcher/initstep/InitStepActivity.smali`,
//     gotoConnectNetwork
// );

replaceLib("./libbase.so", "libbase.so");

if(fs.existsSync(`./${decompName}_out.apk`)) fs.rmSync(`./${decompName}_out.apk`);
if(fs.existsSync(`./${decompName}_Patched.apk`)) fs.rmSync(`./${decompName}_Patched.apk`);

build();

fs.renameSync(
    `${base}_out-aligned-debugSigned.apk`,
    `${decompName}_Patched.apk`
);

fs.rmdirSync(`./${base}`, { recursive: true, force: true });
fs.rmSync(`${base}_out.apk`);