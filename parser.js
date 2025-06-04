const mineflayer = require('mineflayer');
const fs = require('fs');

const botConfigs = [
    { color: "\x1b[36m", surv: "epsilon", name: "6845937" },
    { color: "\x1b[92m", surv: "sigma", name: "9423868" },
    { color: "\x1b[35m", surv: "alpha", name: "54899743" },
    { color: "\x1b[38;5;214m", surv: "beta", name: "865949068"}
];

const serverHost = 'mc.mineblaze.net';
const serverPort = 25565;
const minecraftVersion = '1.19.4';
const pass = 'password';

const survCommands = {
    "epsilon": "/surv-1",
    "sigma": "/surv-4",
    "alpha": "/surv-5",
    "beta": "/surv-6",
    "omikron": "/surv-10"
};

const donateRanks = ["Помощник", "Опка", "Хелпер", "Блейз", "Делюкс", "Император", "АнтиГрифер"];
const donateFile = 'donate.json';

function loadDonateData() {
    if (!fs.existsSync(donateFile)) {
        fs.writeFileSync(donateFile, JSON.stringify({}, null, 4));
    }
    return JSON.parse(fs.readFileSync(donateFile));
}

function saveDonateData(data) {
    fs.writeFileSync(donateFile, JSON.stringify(data, null, 4));
}

const donateData = loadDonateData();

console.log("\x1b[2;36m" + time() + "\x1b[1;2m Script loading...\x1b[0m");

botConfigs.forEach((botConfig) => {
    const bot = mineflayer.createBot({
        host: serverHost,
        port: serverPort,
        version: minecraftVersion,
        username: botConfig.name
    });

    bot.on('message', (message) => {
        console.log(`${botConfig.color}${botConfig.name} \x1b[0m> ${message.toAnsi()}`);
        
        const messagestr = message.toString();

        if (messagestr.includes('| Зарегистрируйтесь » /reg [пароль]')) {
            register();
        }
        if (messagestr.includes('| Авторизируйтесь » /login [пароль]')) {
            login();
        }
        if (messagestr.includes('Важно для вашей безопасности!!!')) {
            setTimeout(() => {
                const portalCommand = survCommands[botConfig.surv];
                if (portalCommand) {
                    bot.chat(portalCommand);
                    console.log(`${botConfig.color}${botConfig.name} \x1b[0mпишет ${portalCommand}\x1b[0m`);
                }
            }, 1000);
        }

        parseDonateNick(messagestr);
    });

    function register() {
        bot.chat(`/reg ${pass}`);
    }

    function login() {
        bot.chat(`/login ${pass}`);
    }
});

function parseDonateNick(message) {
    const regex = /› Игрок \[(.*?)\] (\S+) зашел на сервер\./;
    const match = message.match(regex);
    if (match) {
        const rank = match[1];
        const nick = match[2];
        if (donateRanks.includes(rank)) {
            if (!donateData[rank]) {
                donateData[rank] = [];
            }
            if (!donateData[rank].includes(nick)) {
                donateData[rank].push(nick);
                saveDonateData(donateData);
                console.log(`Добавил: Ник ${nick} | Донат ${rank}`);
            }
        }
    }
}

function time() {
    var date = new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    return "[" + date + "] ";
}
