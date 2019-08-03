const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
//const auth = require('./auth.json');
const fs = require('fs');

let lastNyoomCommandUser = "NyoomBot";
var lastNyoomCommandDate = new Date();
var randomDelay = Math.floor((Math.random()*1*1*1)+1)


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(config.token);

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if (command === 'nyoom') {
    message.reply('nyoom');
  }

  if(command === "ping") {
    if(!message.member.roles.some(r=>["Sqagtastical Magimancer"].includes(r.name)) )
      return;
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "add"){
    const newPerson = args.join(" ");
    if(!message.member.roles.some(r=>["Sqagtastical Magimancer"].includes(r.name)) )
      return;
    fs.writeFile(`${newPerson}.txt`, "0", (err) => { 
      	  if (err) throw err; 
    });
    message.channel.send(`${newPerson} has made a NyoomPoints account`);
    
  }

  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    if(!message.member.roles.some(r=>["Sqagtastical Magimancer"].includes(r.name)) )
      return;
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if(command === 'np') {
    nyoomPoints(message);
  }
  if(command === 'mynp') {
    getNyoompoints(message);
  }

  if(command === "rekt"){
    if(!message.member.roles.some(r=>["Sqagtastical Magimancer"].includes(r.name)) )
      return;
    const sayMessage = args.join(" ");
    message.channel.send(`wow ${sayMessage} you got rekt`);

    
  }
  if(command === "adminaboose"){
    if(message.member.roles.some(r=>["Sqagtastical Magimancer"].includes(r.name)) )
      return;
    message.channel.send("Admin let the plebs have fun commands");

    
  }


});



function nyoomPoints(message) {
  const now = new Date();
  const name = message.author.username; 
  if (now - lastNyoomCommandDate > 1 * 60 * 1000 + randomDelay) {
    // It's been more than 60 seconds + random delay
    var pGained = Math.floor((Math.random()*10)+1)
    if (fs.existsSync(`${name}.txt`)){
      message.channel.send(`You gained ${pGained} Nyoom Points`);
      fs.readFile(`${name}.txt`,(err, data) => {
        if (err) throw err;
        num = parseInt(data);
        total = num+pGained;
        fs.writeFile(`${name}.txt`, total, (err) => { 
      	  if (err) throw err; 
        });
      })
    lastNyoomCommandDate = now;
    lastNyoomCommandUser = name;
    randomDelay = Math.floor((Math.random()*1000*60*3)+1)
    }
    else{
      message.channel.send("Ask the admin make you a NyoomPoints account")
    }
  } 
  else {
    message.reply(`Command last used by ${lastNyoomCommandUser} at ${lastNyoomCommandDate}`);
  }
}

function getNyoompoints(message) {
  const name = message.author.username;
  if (fs.existsSync(`${name}.txt`)){
    fs.readFile(`${name}.txt`,(err, data) => {
      if (err) throw err;
      num = parseInt(data);
      message.reply(`You have ${num} NyoomPoints.`);
    })
  }
  else{
    message.reply("You don't have a NyoomPoints account.")
  }
}

