function Header(version = "10.0.18362.116", year = 2019) {
output.innerText =
`Microsoft Windows [Version ${version}]
(c) ${year} Microsoft Corporation. All rights reserved.`
}

async function HELP(command) {
    command ? end = "RAW/" + command.toUpperCase() : end = "Summary";
    resp = await fetch("https://cmddoc.ndev.tk/" + end);
    if (!resp.ok) return 'This command is not supported by the help utility.  Try "' + command + ' /?".'
    text = await resp.text();
    return text;
}
var help = new Map();
var commands = new Map();
var colors = new Map();
var hcount = 0;
var hdata = [];

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
    codes = LowerCase(codes);
    if (colors.has(codes[1])) {
        document.body.style.color = colors.get(codes[1]);
    }
    if (color.has(colors[2])) {
        document.body.style.backgroundColor = colors.get(colors[2]);
    }
}

function getDisplayable(args, silce) {
    return args.slice(silce).join(" ");
}
async function HELPCommand(command) {
    reply = await HELP(command);
    EchoLine(reply);
    SeparateLine("For more information on tools see the command-line reference in the online help.");
    return;
}
command = document.getElementById("command")
output = document.getElementById("output");
Header();
input = document.getElementById("input");
if (IsTouch) {
    input.isContentEditable = true;
}

function OSK() {
    if (IsTouch) {
        input.focus();
    }
}

function echo(line) {
    return output.innerText += line;
}

function SeparateLine(line) {
    echo("\n" + line + "\n");
}

function EchoLine(line) {
    echo("\n" + line);
}

function NewLine() {
    echo("\n");
}
document.addEventListener('keydown', function(e) {
    if (e.key.length === 1) {
        input.innerText += e.key;
        return
    }
    txt = command.innerText.trim();
    switch (e.code) {
        case "Enter":
            EchoLine(command.innerText);
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

function process(command) {
    tmp = command.split(/>(.*)/);
    path = tmp[0]; // C:\WINDOWS\system32
    args = input.innerText.split(" "); // echo,hello,world 
    displayable = getDisplayable(args, 1);
    switch (args[0].toLowerCase()) {
        case "cls":
            output.innerText = "";
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

        case "help":
            HELPCommand(args[1])
            break;

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
}
