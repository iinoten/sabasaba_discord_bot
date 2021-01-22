require('dotenv').config()
var fs       = require('fs');
const discord = require('discord.js');
var Canvas   = require('canvas'); // node-canvasをrequireする

const client = new discord.Client();
/*必須*/

function canvas_saver() {
    
}

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
        var baseImg = new Canvas.Image();
        baseImg.src = fs.readFileSync('./Image/amongus_icon.jpg');
        var overImg = new Canvas.Image();
        overImg.src = "https://cdn.discordapp.com/avatars/" + message.author.id + '/' + message.author.avatar + '.png';

        var canvas = Canvas.createCanvas(baseImg.width,baseImg.height);
        var ctx = canvas.getContext('2d');
            
        // Canvas上に2つの画像を描画する
        ctx.drawImage(baseImg,0,0);
        ctx.drawImage(overImg,0,0);

        canvas_saver.save(ctx, "monochrome.png", function(){
            console.log("画像保存完了したよ!!");
        });
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