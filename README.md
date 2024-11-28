# r1-apk-patcher
# THIS DOESN'T WORK AND IDK IF IT EVER WILL
tool to patch a clean rabbit apk into a working one

how to run:
1. download nodeJS [here](https://nodejs.org/en/download/package-manager/current), and Java.
2. changing the settings:  
2.1 if you want to use the patched app with your r1, set "r1_mode" to true.  
2.2 if you have your own r1 IMEI that you'd want to use, put it in the imei value.  
2.3 if you have your own rabbit backend set up, you can set the URL of it in the server_ip value. Example value: `ws://192.168.0.110:3000`  
3. finally run `node index.js`
4. your patched apk will have the original filename and "_Patched" added to it.
5. run a command to grant the r1 app the secure settings permission  
5.1. adb command: `adb shell pm grant tech.rabbit.r1launcher.r1 android.permission.WRITE_SECURE_SETTINGS`
OR
5.2 termux:  (needs root in order to work): `pm grant tech.rabbit.r1launcher.r1 android.permission.WRITE_SECURE_SETTINGS`
