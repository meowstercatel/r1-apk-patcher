const {generateIMEI} = require("./utils");

const imei = generateIMEI();

const getOSVersion = {
    location: "smali/classes/tech/rabbit/r1launcher/RLApp.smali",
    code: [
    `.method private final getOSVersion()Ljava/lang/String;`,
    `.locals 0`,
    `.line 49`,
    `const-string p0, "rabbit_OS_v0.8.86_20240523151103"`,
    `return-object p0`,
    `.end method`,
]};

const getImei = {
    location: "smali/classes/tech/rabbit/r1launcher/settings/utils/SystemControllerUtil.smali",
    code: [
    `.method public final getImei(Landroid/content/Context;)Ljava/lang/String;`,
    `.locals 0`,
    `.line 49`,
    `const-string p0, "${imei}"`,
    `return-object p0`,
    `.end method`,
]};

const getDeviceId = {
    location: "smali/classes/AppConfig.smali",
    code: [
    `.method public final getDeviceId()Ljava/lang/String;`,
    `.locals 0`,
    `.line 34`,
    `const-string p0, "${imei}"`,
    `return-object p0`,
    `.end method`,
]};

const onKeyUp = {
    location: "smali/classes/tech/rabbit/r1launcher/rabbit/KeyEventHandler.smali",
    code: [
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
]};

const onKeyDown = {
    location: "smali/classes/tech/rabbit/r1launcher/rabbit/KeyEventHandler.smali",
    code: [
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
]};

const gotoConnectNetwork = {
    location: "smali/classes/tech/rabbit/r1launcher/initstep/InitStepActivity.smali",
    code: [
    ".method public final gotoConnectNetwork(Ltech/rabbit/r1launcher/initstep/process/ConnectNetworkFragment$ShowType;)V",
    ".locals 2",
    `const-string v0, "rabbit explode"`,
    "invoke-virtual {p0, v0}, Ltech/rabbit/r1launcher/initstep/InitStepActivity;->connectWifiSuccess(Ljava/lang/String;)V",
    "return-void",
    ".end method",
]};

const functions = {
    functions: [getOSVersion, getImei, getDeviceId, onKeyUp, onKeyDown, gotoConnectNetwork]
}
module.exports = {functions}