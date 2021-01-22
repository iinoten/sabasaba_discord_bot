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
        message.reply(":coin: lpong")
        
    } else if (message.content === "ちゃんと挨拶できてえらいねえアイスクリームちゃん" ) {
        message.reply("えっへん")
    } else if (message.content==="!report") {
        client.channels.cache.get( message.channel.id ).send("https://media1.tenor.com/images/a496903c9724d2b4fdbf228d74f6dd25/tenor.gif")
    } else if (message.content==='!register') {
        console.log(message.author.id)
        db.collection('test').doc(message.author.id).get().then((docSnapshot)=>{
            console.log(docSnapshot.exists)
            if(!docSnapshot.exists) {
                db.collection('test').doc(message.author.id).set({
                    balance: 20,
                    open_date: firebaseAdmin.firestore.Timestamp.now(),
                    total_get: 20
                }).then(()=>{
                    message.reply(':coin: SabaSabaServer内の共通通貨、"サバコイン"の世界へようこそ！'+message.author.username+'さんのサバコイン口座を開設しました！:coin:')
                }).catch(err=>{
                    message.reply(':confused:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                    console.log(err)
                })
            } else {
                message.reply("ひょっとして、もう口座の開設済みとかじゃない？ サバコイン残高の確認は→ `!coin`")
            }
        }).catch((err)=>{
            message.reply(':confused:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
            console.log(err)
        })
    } else if (message.content==='!coin') {
        db.collection('test').doc(message.author.id).get().then((docSnapshot)=>{
            if(docSnapshot.exists) {
                message.reply(message.author.username+'さんの残高は'+docSnapshot.data().balance+"サバコインです:coin:")
            } else {
                message.reply("もしかしてサバコインの口座を開いてないんじゃない？ まずは口座の開設から→ `!register`")
            }
        }).catch(err=>{
            message.reply(':confused:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
            console.log(err)
        })
    }
    
/*もし送られたメッセージがこんにちはならこんにちは！と返します*/

})
/*messageが送られたときに反応します*/

client.login(process.env.DISCORD_TOKEN);
/*ここにさっきコピーしたTOKENを入れましょう*/

function returnDate () {

}