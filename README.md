# r1-apk-patcher
tool to patch a clean rabbit apk into a working one
To use this repo you need to download [nodeJS](https://nodejs.org/en/download/package-manager/current) and java. \
If anyone wants to make a fix for vision mode not working for many people, DM me on Discord, @meowstercatel (smali / java knowledge recommended ofc)

how to run:
1. download nodejs [here](https://nodejs.org/en/download/package-manager/current)
2. if you have your own apk that you want to patch, change it in settings.json
4. finally run `node index.js`
5. your patched apk will have the original filename and "_Patched" added to it.

to run the apk you need to execute this command first (adb): `adb shell pm grant tech.rabbit.r1launcher.r1 android.permission.WRITE_SECURE_SETTINGS`
or in termux `pm grant tech.rabbit.r1launcher.r1 android.permission.WRITE_SECURE_SETTINGS`