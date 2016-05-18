/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');
var chokidar = require('chokidar');
// 1 - charger le fichier data.txt
// lire le contenu

var watcher = chokidar.watch('datas',{ignored: /[\/\\]\./});

watcher.on('add', function (path) {
  parsefile(path);
});

//Call to load a file extract data and delete
//parsefile("data.txt");

var folderCreated = false;

function parsefile(file){
  fs.readFile(file, 'utf8', function(error, data){
    

    fs.unlink(file);
    if (error)
    {
      console.log(error);
      return;
    }

    var content = data;

    var users = content.split("\n");

    for (var i = 0; i < users.length; i++ )
    {
      var user = users[i];

      if (user.charAt(0) == "L")
        console.log( user );
    }

    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < letters.length; i++)
    {
      var letter = letters[i];


      var str = "";

      for (var j = 0; j < users.length; j++ )
      {
        var user = users[j];

        if (user.charAt(0) == letter)
        {
          str += user + "\n";
        }
      }

      manageFile(letter,str);
    }

  });}


function manageFile(letter,str)
{
  fs.stat("generated",function(error,stats)
  {
    if(error) {
      if(!folderCreated){
        fs.mkdir("generated");
        console.log("folder created");
      }
      folderCreated = true;

      console.log("when creating file " + letter);
      fs.writeFile("generated/" + letter + ".txt", str, 'utf8', function(error){

      });
    }

  });
}

module.exports = {


};

