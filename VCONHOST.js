async function Header(version = "10.0.18363.535", year = 2019) {
output.innerText =
`Microsoft Windows [Version ${version}]
(c) ${year} Microsoft Corporation. All rights reserved.

`}

async function HELPLookup(command) {
    let end = (command) ? "RAW/" + command.toUpperCase() : "Summary";
    let resp = await fetch("https://cmddoc.ndev.tk/" + end);
    if (!resp.ok) return 'This command is not supported by the help utility.  Try "' + command + ' /?".'
    let text = await resp.text();
    return text;
}

async function Ping(host) {
    let resp = await fetch("https://steakovercooked.com/api/ping/?host=" + host);
    if (!resp.ok) return 'Ping error'
    let text = await resp.json();
    return text;
}

help = new Map();
commands = new Map();
colors = new Map();
hcount = 0;
hdata = [];
running = false;
telnet_actions = /\[[A-z]/g;

document.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
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
    return output.innerText += line;
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
            history(true);
            break;
        case "ArrowUp":
            history(false);
            break;
    }
});

function clear() {
    output.innerText = "";
}

close = null;
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
    args = input.innerText.split(" "); // echo,hello,world 
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
        case "nslookup":
            if (args.length > 1 && args.length < 3) {
                await nslookup(args[1]);
            } else {
                await HELP("nslookup");
            }
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
                await HELP(args[1])
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
