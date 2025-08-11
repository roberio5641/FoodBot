import baileys from '@whiskeysockets/baileys';
const { default: makeWASocket, useMultiFileAuthState } = baileys;
import qrcode from "qrcode-terminal"


let waterInterval = null
let foodInterval = null

async function startBot() {
  const {state, saveCreds} = await useMultiFileAuthState("./auth")
  const sock = makeWASocket({auth: state})

  sock.ev.on("creds.update", saveCreds);

    // Coloca aqui o listener de conexão pra ver o QR e status
    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log('Escaneie esse QR code no WhatsApp para conectar.');
        }
        if (connection === 'open') {
            console.log('✅ Conectado ao WhatsApp!');
        }
        if (connection === 'close') {
            console.log('❌ Conexão fechada');
        }
    });

  sock.ev.on("messages.upsert", async message => {
    const msg = message[0]
    if (!msg.message) return;

    const text = (msg.message.conversation || "").toLocaleLowerCase();
    const jid = msg.key.remoteJid

    if(text.includes("acordei")){
      clearInterval(foodInterval)
      clearInterval(waterInterval)

      await sock.sendMessage(jid, {text : "Tomar agua em jejum antes de se alimentar e muito importante, faça isso"})

      waterInterval = setInterval(() => {
        sock.sendMessage(jid, {text : "Está na hora de dar um gole nessa sua agua ai paizão "})
      }, 20 * 60 * 1000);

      foodInterval = setInterval(() => {
        sock.sendMessage(jid, {text : "Paizão e a alimentação ai como que tamo, bora comer "})
      }, 3 * 60 * 1000);

      await sock.sendMessage(jid, { text: "Lembretes iniciados" });
    }

    if(text.includes("dormir")){
      clearInterval(foodInterval)
      clearInterval(waterInterval)
      await sock.sendMessage(jid, {text : "Boa noite, bebe so uma aguinha antes de ir dormir"})
    }
  });
}

startBot()