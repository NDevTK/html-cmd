var errorCode = 0;
var environment = new Map()
.set("ALLUSERSPROFILE", "C:\\ProgramData")
.set("APPDATA", "C:\\Users\\NDevTK\\AppData\\Roaming")
.set("CLIENTNAME", "ndev.tk")
.set("CommonProgramFiles", "C:\\Program Files\\Common Files")
.set("CommonProgramFiles(x86)", "C:\\Program Files (x86)\\Common Files")
.set("CommonProgramW6432", "C:\\Program Files\\Common Files")
.set("COMPUTERNAME", "ndev.tk")
.set("ComSpec", "C:\\Windows\\system32\\cmd.exe")
.set("DriverData", "C:\\Windows\\System32\\Drivers\\DriverData")
.set("HOMEDRIVE", "C:")
.set("HOMEPATH", "\\Users\\NDevTK")
.set("LOCALAPPDATA", "C:\\Users\\NDevTK\\AppData\\Local")
.set("LOGONSERVER", "\\\\ndev.tk")
.set("NUMBER_OF_PROCESSORS", "1337")
.set("OS", "Windows_NT")
.set("Path","C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;C:\\Windows\\System32\\OpenSSH\\;C:\\Users\\NDevTK\\AppData\\Local\\Microsoft\\WindowsApps;")
.set("PATHEXT", ".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.CPL")
.set("PROCESSOR_ARCHITECTURE", "AMD64")
.set("PROCESSOR_IDENTIFIER", "NDevTK CPU, GenuineIntel")
.set("PROCESSOR_LEVEL", "1337")
.set("PROCESSOR_REVISION", "1337")
.set("ProgramData", "C:\\ProgramData")
.set("ProgramFiles", "C:\\Program Files")
.set("ProgramFiles(x86)", "C:\\Program Files (x86)")
.set("ProgramW6432", "C:\\Program Files")
.set("PROMPT", "$P$G")
.set("PSModulePath", "C:\\Users\\NDevTK\\Documents\\WindowsPowerShell\\Modules;C:\\Program Files\\WindowsPowerShell\\Modules;C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules")
.set("PUBLIC", "C:\\Users\\Public")
.set("SESSIONNAME", "ndev.tk")
.set("SystemDrive", "C:")
.set("SystemRoot", "C:\\Windows")
.set("TEMP", "C:\\Users\\NDevTK\\AppData\\Local\\Temp")
.set("TMP", "C:\\Users\\NDevTK\\AppData\\Local\\Temp")
.set("USERDOMAIN", "ndev.tk")
.set("USERDOMAIN_ROAMINGPROFILE", "ndev.tk")
.set("USERNAME", "NDevTK")
.set("USERPROFILE", "C:\\Users\\NDevTK")
.set("windir", "C:\\Windows");

internel = new Map()
.set("RANDOM", random)
.set("%__APPDIR__%", appdir)
.set("%__CD__%", current)
.set("%CD%", current2)
.set("%=C:%", current2)
.set("FIRMWARE_TYPE", firmware_type)
.set("HIGHESTNUMANODENUMBER", HIGHESTNUMANODENUMBER)
.set("CMDCMDLINE", CMDCMDLINE)
.set("CMDEXTVERSION", CMDEXTVERSION)
.set("ERRORLEVEL", ERRORLEVEL)

function firmware_type() {
    return "UEFI";
}

function current() {
    return dir.innerText;
}

function current2() {
    return current().slice(0, -1);
}

function appdir() {
    return "C:\\WINDOWS\\system32\\";
}

function HIGHESTNUMANODENUMBER() {
    return "0";
}

function CMDCMDLINE() {
    return '"C:\\WINDOWS\\system32\\cmd.exe"';
}

function CMDEXTVERSION() {
    return "2";
}

function ERRORLEVEL() {
    return errorCode;
}

async function Header(version = "10.0.19042.985") {
output.innerText =
`Microsoft Windows [Version ${version}]
(c) Microsoft Corporation. All rights reserved.

`}

function getType() {
    if(navigator.connection === undefined) return "Wireless";
    let type = (navigator.connection.type === undefined) ? navigator.connection.type : navigator.connection.effectiveType;
    return (type === "ethernet") ? "Ethernet" : "Wireless LAN";
}

async function HELPLookup(command) {
    let end = (command) ? "RAW/" + command.toUpperCase() : "Summary";
    let resp = await fetch("https://cmddoc.ndev.tk/" + end);
    if (!resp.ok) return 'This command is not supported by the help utility.  Try "' + command + ' /?".\n'
    let text = await resp.text();
    return text;
}

async function Ping(host) {
    let resp = await fetch("https://steakovercooked.com/api/ping/?host=" + encodeURI(host));
    if (!resp.ok) return 'API error :(';
    let text = await resp.json();
    if(text === null) return "Ping request could not find host "+host+" Please check the name and try again.";
    return text;
}

help = new Map();
commands = new Map();
colors = new Map();
hcount = 0;
hdata = [];
running = false;
telnet_actions = /\[[A-z]/g;

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    insert_clipboard();
    return false;
}, false);

function insert_clipboard() {
    navigator.clipboard.readText().then(text => {
        input.innerText += text;
    }).catch(err => {
        console.info('Clipboard access denied');
    });
}

function NSL(domain, ip) {
    return `Server:  dns.google
Address:  8.8.8.8
    
Non-authoritative answer:
Name:    ${domain}
Addresses:  ${ip}`
}

function NSLFail(domain) {
    return `Server:  dns.google
Address:  8.8.8.8

*** dns.google can't find ${domain}: Non-existent domain`
}

function getLocal() {
return new Promise((resolve, reject) => {
// NOTE: window.RTCPeerConnection is "not a constructor" in FF22/23
var RTCPeerConnection = /*window.RTCPeerConnection ||*/ window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

if (RTCPeerConnection) (function () {
    var rtc = new RTCPeerConnection({iceServers:[]});
    if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
        rtc.createDataChannel('', {reliable:false});
    };
    
    rtc.onicecandidate = function (evt) {
        // convert the candidate to SDP so we can run it through our general parser
        // see https://twitter.com/lancestout/status/525796175425720320 for details
        if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
    };
    rtc.createOffer(function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
    }, function (e) { console.warn("offer failed", e); });
    
    
    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;
    function updateDisplay(newAddr) {
        if (newAddr in addrs) return;
        else addrs[newAddr] = true;
        var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
        resolve(displayAddrs.join(" or perhaps ") || "n/a");
    }
    
    function grepSDP(sdp) {
        var hosts = [];
        sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
            if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                    addr = parts[4],
                    type = parts[7];
                if (type === 'host') updateDisplay(addr);
            } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                var parts = line.split(' '),
                    addr = parts[2];
                updateDisplay(addr);
            }
        });
    }
})();
});
}

function ipconfig(localip = "192.168.1.5", subnet = "255.255.255.0", gateway = "192.168.1.1") {
    return `${getType()} adapter Local Area Connection* 1:

   Connection-specific DNS Suffix  . : lan
   IPv6 Address. . . . . . . . . . . : ${localip}
   Subnet Mask . . . . . . . . . . . : ${subnet}
   Default Gateway . . . . . . . . . : ${gateway}`
}

async function nslookup(domain) {
    let response = await fetch('https://dns.google/resolve?name='.concat(encodeURI(domain)));
    let json = await response.json();
    let result = (json.Status === 0) ? NSL(domain, json.Answer[0].data) : NSLFail(domain);
    EchoLine(result);
    NewLine();
}

const telnet_command = "[";

function telnet_run(actions) {
    Array.from(actions).forEach((command, index) => {
        switch(command[0].substr(2)) {
            case "H":
                clear();
                break;
        }
    })
}

function telnet_close(address) {
    tShocket.close();
}

function telnet(address) {
    close = telnet_close;
    tShocket = new WebSocket("wss://telnetproxy.herokuapp.com");
    clear();
    setRunning("telnet");
    tShocket.onopen = function() {
        tShocket.send(address);
    };
    tShocket.onmessage = function(event) {
        if(event.data.includes(telnet_command)) {
            telnet_run(event.data.matchAll(telnet_actions));
        }
        let display = event.data.replace(telnet_actions, "");
        EchoLine(display);
    };
}

function IsTouch() {
    var match = window.matchMedia || window.msMatchMedia;
    if (match) {
        var mq = match("(pointer:coarse)");
        return mq.matches;
    }
    return false;
}

function history(down) {
    if (hdata.length < 1) return;
    if (down) {
        if (hcount > 1) {
            hcount -= 1;
            input.innerText = hdata[hdata.length - hcount];
        }
    } else {
        if (hdata.length > hcount) {
            hcount += 1;
            input.innerText = hdata[hdata.length - hcount];
        }
    }

}
colors.set('0', 'Black')
    .set('1', 'Blue')
    .set('2', 'Green')
    .set('3', 'Aqua')
    .set('4', 'Red')
    .set('5', 'Purple')
    .set('6', 'Yellow')
    .set('7', 'White')
    .set('8', 'Gray')
    .set('9', 'LightBlue')
    .set('a', 'Green')
    .set('b', 'Aqua')
    .set('c', 'LightRed')
    .set('d', 'LightPurple')
    .set('e', 'LightYellow')
    .set('f', 'White')

function LowerCase(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].toLowerCase()
    }
    return array
}

function ColorParser(codes) {
    if(codes.length === 1) {
        document.body.style.color = "silver";
        document.body.style.backgroundColor = "black";
        return
    }
    codes = LowerCase(codes);
    if (colors.has(codes[1])) {
        document.body.style.color = colors.get(codes[1]);
    } else {
       return HELP("color");
    }
    if (colors.has(colors[2])) {
        document.body.style.backgroundColor = colors.get(colors[2]);
    }
}

function getDisplayable(args, silce) {
    return args.slice(silce).join(" ");
}
async function HELP(command) {
    reply = await HELPLookup(command);
    echo(reply);
    return;
}

Header();
if (IsTouch) {
    input.isContentEditable = true;
}

function OSK() {
    if (IsTouch) {
        input.focus();
    }
}

function echo(line = "") {
    output.innerText += line;
    window.scrollTo(0, document.body.scrollHeight);   
}

function EchoLine(line = "") {
    echo(line+"\n");
}

function NewLine() {
    echo("\n");
}

function Control(key) {
    switch(key) {
        case "C":
            setRunning();
            return true;
    }
}

function ModifyInput(e) {
    if(e.ctrlKey) {
        let key = e.key.toUpperCase();
        if(Control(key)) return null
        return "^"+key;
    } else {
        return e.key;
    }
}

function RemoveLB(message) {
    return message.replace( /[\r\n]+/gm, "" );
}

document.addEventListener('keydown', function(e) {
    if (e.key.length === 1) {
        let content = ModifyInput(e);
        if(content === null) return
        input.innerText += content;
        return
    }
    txt = RemoveLB(command.innerText);
    switch (e.code) {
        case "Enter":
            EchoLine(txt);
            process(txt);
            hdata.push(input.innerText);
            input.innerText = "";
            break;
        case "Backspace":
            input.innerText = input.innerText.slice(0, -1);
            break;
        case "Space":
            input.innerText += " ";
            break;
        case "ArrowDown":
            e.preventDefault();
            history(true);
            break;
        case "ArrowUp":
            e.preventDefault();
            history(false);
            break;
    }
});

function clear() {
    output.innerText = "";
}

close = null;

function getEnv(name) {
    if (environment.has(name)) {
        return environment.get(name);
    }
    let key = name.toUpperCase();
    // Failback to case insensitive check
    for (value of environment) {
        if (value[0].toUpperCase() === key) return value[1];
    }
}

async function setRunning(name = false) {
    if(name === false) {
        if(close !== null) {
            close();
            close = null;
        }
        input.innerText = "";
        EchoLine(dir.innerText);
    }
    dir.hidden = (name);
    running = name;
}

function random(min = 0, max = "32767") {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

async function process(command) {
    if (running) {
        switch (running) {
            case "telnet":
                tShocket.send(input.innerText);
                break;
        }
    }
    tmp = command.split(/>(.*)/);
    path = tmp[0]; // C:\WINDOWS\system32
    userinput = input.innerText;
    for (value of environment) userinput = userinput.replace(new RegExp(escapeRegExp("%"+value[0]+"%"), 'gi'), value[1]);
    for (value of internel) {
        userinput = userinput.replace(new RegExp(escapeRegExp("%"+value[0]+"%"), 'gi'), value[1]());
    }
    args = userinput.split(" "); // echo,hello,world
    displayable = getDisplayable(args, 1);
    switch (args[0].toLowerCase()) {
        case "cls":
            clear();
            break;
        case "telnet":
            if (args.length > 1 && args.length < 4) {
                telnet(args[1]);
            } else {
                await HELP("telnet");
            }
            break;
        case "set":
            if (args.length > 1) {
                if (args[1].includes("=")) {
                let data = args[1].split("=");
                environment.set(data[0], data[1]);
                let value = getEnv(args[1]);
                } else if (value !== undefined) {
                    EchoLine(value);
                } else {
                    EchoLine("Environment variable "+displayable+" not defined")
                }
            } else {
                for (value of environment) EchoLine(value[0] + "=" + value[1]);
            }
            break;
        case "nslookup":
            if (args.length > 1 && args.length < 3) {
                await nslookup(args[1]);
            } else {
                await HELP("nslookup");
            }
            break;
            
            case "ipconfig":
                let localIP = await getLocal();
                EchoLine(ipconfig(localIP));
                break;
            
            case "echo":
                if (args.length > 1) {
                    EchoLine(displayable);
                } else {
                    EchoLine("ECHO is on.")
                }
                break;
            case "color":
                ColorParser(args);
                break;
            
            case "ping":
                if (args.length > 1) {
                    let result = await Ping(args[1]);
                    EchoLine(result);
                } else {
                    await HELP("ping");
                }
                break;
            
            case "help":
                await HELP(args[1]);
                break;
            case "cd":
                if(args.length === 1) EchoLine(path.substring(0, path.length - 1));
                break;

            case "":
                return;

            case "title":
                if (args.length > 1) {
                    document.title = displayable
                }
                break;
            case "cd":
                break;
            default:
                if (!commands.has(args[0])) {
                    EchoLine("'" + args[0] + "' is not recognized as an internal or external command,\noperable program or batch file.");
                } else {
                    EchoLine(commands.get(args[0]));
                }
    }
    NewLine();
}
