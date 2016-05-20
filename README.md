# Simple secured chat

This is a simple RSA secured socket.io chat with server and client in node.js.

Server is working in socket.io with RSA key refreshing every 10 seconds. Every client is authenticated with their RSA. Each exchange between server and client or between a client and another client is first encrypted by client with server RSA, then server decrypts and encrypt with receiver RSA.

John === Encrypt with server RSA ===> server === Encrypt with Jane RSA ===> Jane

Client is also in node.js using Blessed ui.

# Install
Server:
```sh
cd path/to/project/server
npm install
node app.js
```

Client:
```sh
cd path/to/project/client
npm install
node client.js
```

# Configuration

For server configuration in config.json, you can modify port and RSA key length (128, 256, 512, 1024...).
There is also the list of the active modules used.

For client configuration in config.json, you can modify the maximum of lines displayed in the client.
There is also the list of the active modules and socket modules used.

# Commands

Client has multiple commands, here is the list :

Help :  <br/>
    command : /help (command) <br/>
    description : Displays the help text of a command. If no command provided (/help), displays all the commands and their help text. <br/>

Exit :  <br/>
    command : /exit <br/>
    description : Leaves the app <br/>

Load RSA : <br/>
    command : /loadRSA (path/to/rsa/private/key) <br/>
    description : loads the RSA private key. If none provided, will generate one. <br/>

Connect :  <br/>
    command : /connect serverIp:serverPort <br/>
    description : Connects to the simple chat server (requires to load RSA first). <br/>

Disconnect : <br/>
    command : /disconnect <br/>
    description : Disconnects from simple chat server (requires to be connected first). <br/>

Timelog : <br/>
    command : /timelog <br/>
    description : Enable or disable display of time before messages. <br/>

Mute : <br/>
    command : /mute <br/>
    description : Enable or disable sounds in app. <br/>

Nick :  <br/>
    command : /nick newName <br/>
    description : Request to server to change your nickname (requires to be connected first). <br/>

Join :  <br/>
    command : /join roomName <br/>
    description : Request to server to join a room (requires to be connected first). If the room does not exist, a room will be created and you will be set admin of this room. <br/>

Set Admin : <br/>
    command : /setAdmin nameOfUser <br/>
    description : Sets user as admin of the room (requires to be connected first, in a room and admin of the room). <br/>

Kick : <br/>
    command : /kick nameOfUser <br/>
    description : Kick user from the room (requires to be connected first, in a room and admin of the room). He can come back to the room. <br/>

Ban : <br/>
    command : /ban nameOfUser <br/>
    description : Ban user from the room (requires to be connected first, in a room and admin of the room). He will no longer be able to join the room. <br/>

Unban : <br/>
    command : /unban nameOfUser <br/>
    description : Unban user from the room (requires to be connected first, in a room, admin of the room). He will be able to join the room again.

Message : <br/>
    command : Message to send <br/>
    description : Send the message to your current room (requires to be connected and in a room). <br/>

Whisper : <br/>
    command : /whisper nameOfUser Message  <br/>
              /w nameOfUser Message <br/>
    description : Send a private message to the specified user (requires to be connected). <br/>

Wizz : <br/>
    command : /wizz nameOfUser  <br/>
    description : Send a wizz to the specified user (requires to be connected). <br/>

