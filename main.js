require('dotenv').config()
const discord = require('discord.js');
const firebase = require('firebase');
const { firestore } = require('firebase-admin');
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
        message.reply("pong")
        console.log(message.channel.id)
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
                    total_get: 20,
                    userName: message.author.username
                }).then(()=>{
                    message.reply(':coin: SabaSabaServer内の共通通貨、"サバコイン"の世界へようこそ！'+message.author.username+'さんのサバコイン口座を開設しました！:coin:')
                }).catch(err=>{
                    message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                    console.log(err)
                })
            } else {
                message.reply("ひょっとして、もう口座の開設済みとかじゃない？ サバコイン残高の確認は→ `!coin`")
            }
        }).catch((err)=>{
            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
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
            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
            console.log(err)
        })
    } else if( message.content.startsWith(`!throw`)  ) {
        //送金機能
        let fromUserCoinAccount = db.collection('test').doc(message.author.id);
        console.log("判定",Boolean(message.mentions.users.keys().length))
        if( message.mentions.users.keys().length ) {
            message.mentions.users.map((user)=>{
                let toUserCoinAccount = db.collection('test').doc(user.id);
                if( !(message.author.id == user.id) ) {
                    // 送り先が送り主と別の人だった場合
                    fromUserCoinAccount.get().then( fromRes => {
                        if ( fromRes.exists  ) {
                            // 送り元の口座が存在した場合
                            toUserCoinAccount.get().then( toRes => {
                                if ( toRes.exists  ) {
                                    // 送り先の口座が存在した場合
                                    if( fromRes.data().balance > 0 ) {
                                        //送り主に残高があった場合
                                        fromUserCoinAccount.update({ balance: firebaseAdmin.firestore.FieldValue.increment( -1 ) }).then(()=>{
                                            toUserCoinAccount.update({ balance: firebaseAdmin.firestore.FieldValue.increment( 1 ), total_get: firebaseAdmin.firestore.FieldValue.increment( 1 ) }).then(()=>{
                                                message.reply(':money_with_wings: '+user.username+' さんにサバコインを送りました！ サバコイン残高の確認は→ `!coin`')                        
                                            }).catch(err=> {
                                                message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                                console.log(err)
                                            })
                                        }).catch(err=> {
                                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                            console.log(err)
                                        })
                                    } else {
                                        //送り主に残高がなかった場合
                                        message.reply(':weary: '+message.author.username+' さんのサバコインがもう無いよ、なんとか集めてきて！')
                                    }
                                } else {
                                    // 送り先の口座が存在しなかった場合
                                    message.reply(':weary: '+message.author.username+' さんのサバコイン口座がまだできていないっぽい... `!register` で作れることを教えてあげてみて')
                                }
                            })
                        } else {
                            // 送り元の口座が存在しなかった場合
                            message.reply(':weary: '+user.username+' さんのサバコイン口座がまだできていないっぽい まずは口座の開設から→ `!register`')
                    }
                    })
                } else {
                    // 送り先が送り主だった場合
                        message.reply(':smirk:自分にはコインを送れないよ')
                }
            })
        } else {
            message.reply(':face_with_monocle: コインを送るには `!throw`から始めて送りたいユーザーをメンションしてみてね')
        }
    } else if( message.content==='!slot-machine' | ':slot_machine:' ) {
        //カジノ部屋でのルーレットマシン機能
        let slot_pattern = [
            ':seven:',
            ':watermelon:',':watermelon:',':watermelon:',':watermelon:',':watermelon:',
            ':fish:',':fish:',':fish:',':fish:',
            ':cherries:',':cherries:',':cherries:',':cherries:',':cherries:',':cherries:',':cherries:',':cherries:',':cherries:',
            ':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',':mushroom:',
            ':green_heart:',':green_heart:',
        ]
        function rolling_slot_pattern (){ return slot_pattern[ Math.floor(Math.random() * slot_pattern.length) ] }
        if( message.channel.id == "802336954640891936" ) {
            //カジノ部屋だった場合
            let userCoinAccount = db.collection('test').doc(message.author.id);
            userCoinAccount.get().then( res => {
                if(res.exists) {
                    // 口座が存在した場合
                    if( res.data().balance >= 3 ) {
                        //残高があった場合
                        userCoinAccount.update({balance: firebaseAdmin.firestore.FieldValue.increment(-3)}).then(()=>{
                            message.reply(':slot_machine:スロットマシーンスタート！').then(res=>{
                                setTimeout(()=> {
                                    res.edit(rolling_slot_pattern() +rolling_slot_pattern() +rolling_slot_pattern() ).then(res2=>setTimeout(()=>{
                                        res2.edit(rolling_slot_pattern() +rolling_slot_pattern() +rolling_slot_pattern() ).then(res3=>setTimeout(()=>{
                                                    res3.edit(rolling_slot_pattern() +rolling_slot_pattern() +rolling_slot_pattern() ).then(res6=>setTimeout(()=>{
                                                        const slot_pattern_A = rolling_slot_pattern();
                                                        const slot_pattern_B = rolling_slot_pattern();
                                                        const slot_pattern_C = rolling_slot_pattern();
                                                        res6.edit(slot_pattern_A +slot_pattern_B +slot_pattern_C ).then(resSlot=>{
                                                            if ( slot_pattern_A == slot_pattern_B == slot_pattern_C ) {
                                                                switch (slot_pattern_A) {
                                                                    case ':seven:':
                                                                        userCoinAccount.update({
                                                                            balance: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                            total_get: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                        }).then(()=> {
                                                                            resSlot.reply(':seven:'+'大当たり！ おめでとうございます:partying_face: '+message.author.username+'さんが、スロットマシーンで:seven:を揃えて77コインを獲得しました！:seven:')
                                                                        }).catch(err=> {
                                                                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                                                        })
                                                                        break;
                                                                    case ':watermelon:':
                                                                        userCoinAccount.update({
                                                                            balance: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                            total_get: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                        }).then(()=> {
                                                                            resSlot.reply(':watermelon:'+'当たり！ おめでとうございます:yum: '+message.author.username+'さんが、スロットマシーンで:watermelon:を揃えて16コインを獲得しました！:watermelon:')
                                                                        }).catch(err=> {
                                                                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                                                        })
                                                                        break
                                                                    case ':fish:':
                                                                        userCoinAccount.update({
                                                                            balance: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                            total_get: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                        }).then(()=> {
                                                                            resSlot.reply(':fish:'+'当たり！ おめでとうございます:yum: '+message.author.username+'さんが、スロットマシーンで:fish:を揃えて40コインを獲得しました！:fish:')
                                                                        }).catch(err=> {
                                                                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                                                        })
                                                                        break
                                                                    case ':cherries:':
                                                                        userCoinAccount.update({
                                                                            balance: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                            total_get: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                        }).then(()=> {
                                                                            resSlot.reply(':cherries:'+'当たり！ おめでとうございます:yum: '+message.author.username+'さんが、スロットマシーンで:fish:を揃えて5コインを獲得しました！:fish:')
                                                                        }).catch(err=> {
                                                                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                                                        })
                                                                        break
                                                                    case ':green_heart:':
                                                                        userCoinAccount.update({
                                                                            balance: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                            total_get: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                        }).then(()=> {
                                                                            resSlot.reply(':fish:'+'当たり！ おめでとうございます:yum: '+message.author.username+'さんが、スロットマシーンで:fish:を揃えて30コインを獲得しました！:fish:')
                                                                        }).catch(err=> {
                                                                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                                                        })
                                                                        break
                                                                    case ':mushroom:':
                                                                        userCoinAccount.update({
                                                                            balance: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                            total_get: firebaseAdmin.firestore.FieldValue.increment(77),
                                                                        }).then(()=> {
                                                                            resSlot.reply(':mushroom:'+'当たり！ おめでとうございます:yum: '+message.author.username+'さんが、スロットマシーンで:mushroom:を揃えて3コインを獲得しました！:mushroom:')
                                                                        }).catch(err=> {
                                                                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                                                                        })
                                                                        break
                                                                }
                                                            } else {
                                                                resSlot.reply(':zany_face: はずれ！ また挑戦してみてね スロットマシーンのスタートは→ `!slot-machine`')
                                                            }
                                                        })
                                                    }),300)
                                        }),300)
                                    }),300)
                                },600)
                            })
                        }).catch(err => {
                            message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                            console.log(err)
                        })
                    } else {
                        // 残高がなかった場合
                        message.reply(':weary: サバコインが足り無いよ、なんとか集めてきて！')
                    }
                } else {
                    //口座が無かった場合
                    message.reply(':weary: '+message.author.username+' さんのサバコイン口座がまだできていないっぽい... `!register` で作れることを教えてあげてみて')
                }
            }).catch(err=>{
                message.reply(':thermometer_face:サバコイン データベースとの接続に障害が発生しています。時間を置いて試してみてください')
                console.log(err)
            })
        } else {
            //カジノ部屋じゃなかった場合
            message.reply(':weary: ルーレットは #カジノ部屋 でできるよ！ #カジノ部屋 に移動して `!slot-machine` ってやってみて！')
        }
    }

})

client.login(process.env.DISCORD_TOKEN);
/*ここにさっきコピーしたTOKENを入れましょう*/

function returnDate () {

}