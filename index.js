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


replaceLib("./libbase.so", "libbase.so");

if(fs.existsSync(`./${decompName}_out.apk`)) fs.rmSync(`./${decompName}_out.apk`);
if(fs.existsSync(`./${decompName}_Patched.apk`)) fs.rmSync(`./${decompName}_Patched.apk`);

build();

fs.renameSync(
    `${base}_out-aligned-debugSigned.apk`,
    `${decompName}_Patched.apk`
);

fs.rmSync(`./${base}`, { recursive: true, force: true });
fs.rmSync(`${base}_out.apk`);