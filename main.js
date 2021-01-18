require('dotenv').config()

const discord = require('discord.js');
const client = new discord.Client();
/*必須*/

client.on('ready', () => {
    console.log('bot ready!');
});
/*起動に成功したらコンソールに"bot ready!"と表示します*/

client.on('message', message =>{

    if(message.content === "こんにちは"){
        message.reply("こんにちは！")
    }
/*もし送られたメッセージがこんにちはならこんにちは！と返します*/

})
/*messageが送られたときに反応します*/

client.login(process.env.DISCORD_TOKEN);
/*ここにさっきコピーしたTOKENを入れましょう*/
console.log(process.env.DISCORD_TOKEN)