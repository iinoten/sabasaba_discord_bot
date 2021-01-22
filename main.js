require('dotenv').config()
const discord = require('discord.js');
const firebase = require('firebase')
const client = new discord.Client();
const firebaseAdmin = require('firebase-admin');
const ServiceAccount = require('./sabasabaserver-maneyforward-firebase-adminsdk-w7667-31b20c2f5d.json');
/*必須*/

firebaseAdmin.initializeApp({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTURL,
    credential: firebaseAdmin.credential.cert(ServiceAccount)
});
console.log(process.env.APIKEY,process.env.AUTHDOMAIN,process.env.PROJECTURL)
var db = firebaseAdmin.firestore();

client.on('ready', () => {
    console.log('bot ready!');
});
/*起動に成功したらコンソールに"bot ready!"と表示します*/

client.on('message', message =>{

    if(message.content === "こんにちは"){
        message.reply("こんにちは！")
    } else if( message.content === "アイコン出して") {
        message.reply("のアイコンは これ ↓ https://cdn.discordapp.com/avatars/" + message.author.id + '/' + message.author.avatar + '.png' )
    } else if( message.use === "好きだよ") {
        message.reply("可愛いね")
    } else if( message.content.startsWith(`ping`)  ) {
            message.reply("lpong")
            db.collection('users').doc('alovelace').set({
            first: 'Ada',
            last: 'Lovelace',
            born: 1815
          }).then(()=>{
            message.reply("完了")
          }).catch((err)=>{
            message.reply("ミスった")
            console.log(err)
          })
    } else if (message.content === "ちゃんと挨拶できてえらいねえアイスクリームちゃん" ) {
        message.reply("えっへん")
    } else if (message.content==="!report") {
        client.channels.cache.get( message.channel.id ).send("https://media1.tenor.com/images/a496903c9724d2b4fdbf228d74f6dd25/tenor.gif")

    }
    
/*もし送られたメッセージがこんにちはならこんにちは！と返します*/

})
/*messageが送られたときに反応します*/

client.login(process.env.DISCORD_TOKEN);
/*ここにさっきコピーしたTOKENを入れましょう*/

function returnDate () {

}