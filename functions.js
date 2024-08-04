const {generateIMEI} = require("./utils");
const settings = require("./settings.json");

const imei = settings.imei=="" ? generateIMEI() : settings.imei;

const getOSVersion = {
    location: "smali/classes/tech/rabbit/r1launcher/RLApp.smali",
    code: [
    `.method private final getOSVersion()Ljava/lang/String;`,
    `.locals 0`,
    `.line 49`,
    `const-string p0, "rabbit_OS_v0.8.103_20240620101341"`,
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
    "if-eq p1, p0, :set",
    "const/16 p0, 0x19",
    "if-eq p1, p0, :set",
    "const/16 p0, 0x13",
    "if-eq p1, p0, :cond_0",
    "const/16 p0, 0x14",
    "if-eq p1, p0, :cond_0",
    "packed-switch p1, :pswitch_data_0",
    "goto :goto_0",
    ":set",
    "const/16 p1, 0x1A",
    ":cond_0",
    ":pswitch_0",
    "sget-object p0, Ltech/rabbit/r1launcher/rabbit/KeyEventHandler;->TAG:Ljava/lang/String;"
]};

const onKeyDown = {
    location: "smali/classes/tech/rabbit/r1launcher/rabbit/KeyEventHandler.smali",
    code: [
    ".method public final onKeyDown(ILandroid/view/KeyEvent;)Z",
    ".locals 3",
    "const/16 p0, 0x18",
    "if-eq p1, p0, :set",
    "const/16 p0, 0x19",
    "if-eq p1, p0, :set",
    "const/16 p0, 0x13",
    "if-eq p1, p0, :cond_0",
    "const/16 p0, 0x14",
    "if-eq p1, p0, :cond_0",
    "packed-switch p1, :pswitch_data_0",
    "goto :goto_0",
    ":set",
    "const/16 p1, 0x1A",
    ":cond_0",
    ":pswitch_0",
    "sget p0, Ltech/rabbit/r1launcher/rabbit/KeyEventHandler;->lastKey:I"
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

const wssClientMethods = {
    location: "smali/classes/tech/rabbit/r1launcher/wss/WssClient.smali",
    code: [
        ".method public native getKey()Ljava/lang/String;",
        ".end method",
        ".method public native getHealth()Ljava/lang/String;",
        ".end method",
        ".method public getWebSocket()Lokhttp3/WebSocket;",
        ".locals 0",
        "iget-object p0, p0, Ltech/rabbit/r1launcher/wss/WssClient;->webSocket:Lokhttp3/WebSocket;",
        "return-object p0"
    ]
}

const wssClientConnection = {
    location: "smali/classes/tech/rabbit/r1launcher/wss/WssClient.smali",
    code: [
        `const-string v1, "App-Version"`,
	`const-string p3, "20240615.10-dirty"`,
        `invoke-virtual {v0, v1, p3}, Lokhttp3/Request$Builder;->addHeader(Ljava/lang/String;Ljava/lang/String;)Lokhttp3/Request$Builder;`,
        `move-result-object p3`,
        `const-string v1, "Device-Health"`,
        `invoke-virtual {p0}, Ltech/rabbit/r1launcher/wss/WssClient;->getHealth()Ljava/lang/String;`,
        `move-result-object p4`,
        `invoke-virtual {p3, v1, p4}, Lokhttp3/Request$Builder;->addHeader(Ljava/lang/String;Ljava/lang/String;)Lokhttp3/Request$Builder;`,
        `new-instance v0, Ljava/lang/StringBuilder;`,
        `const-string v0, "OS-Version"`,
        `const-string p4, "rabbit_OS_v0.8.103_20240620101341_MxA1cbwGjoZgqG54ggsYtg8t2RHX1DJ+LHzKtWLfwSSOim69dlKwt1FLnnWFtYeZ5cuSp2NNb+XhzOzIu0SJr1BnrbgpgGd+pXa5"`,
        `invoke-virtual {p3, v0, p4}, Lokhttp3/Request$Builder;->addHeader(Ljava/lang/String;Ljava/lang/String;)Lokhttp3/Request$Builder;`,
        `move-result-object p3`,
        `invoke-virtual {p3, p1}, Lokhttp3/Request$Builder;->url(Ljava/lang/String;)Lokhttp3/Request$Builder;`,
        `move-result-object p1`,
        `invoke-virtual {p1}, Lokhttp3/Request$Builder;->build()Lokhttp3/Request;`
    ]
}

const functions = {
    functions: [getOSVersion, getImei, getDeviceId, onKeyUp, onKeyDown, gotoConnectNetwork,
        wssClientMethods, wssClientConnection
    ]
}
module.exports = {functions}
