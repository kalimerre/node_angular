/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  //sails.fs = require('fs');
  //sails.chokidar = require('chokidar');
  var fs = require('fs');
  var id3 = require('id3js');
  var chokidar = require('chokidar');
  var pathLib = require('path');
  var folderCreated = false;


  var watcher = chokidar.watch("assets/incoming_songs", {
    ignored: /[\/\\]\./,
    persistent: true
  });
/*
  var watcherDelete = chokidar.watch("assets/inconnu", {
    ignored: /[\/\\]\./,
    persistent: true
  });
  */


  /*watcherDelete.on('unlink', function (path) {

    deleteFileToDb(path);

  });*/

  watcher.on('add', function (path) {
    console.log('1 - File added : ' + path);
    addFileToExtract(path);
  });

  var files = [];
  var extracting = false;
  var endTimeout = 1000;

  /*function deleteFileToDb(path){
    console.log("Path to delete");
    var pathEscape = path;
    console.log(pathEscape);
    Mp3.find({pathDatabase:pathEscape}).exec(function (err, mp3){
      if (err) {
        return res.negotiate(err);
      }
      console.log('Wow, there are song .  Check it out:', mp3.length, mp3);


      Mp3.destroy({id:mp3[0].id}).exec(function (err){
        console.log("Suppression du fichier en base");
        if (err) {
          return res.negotiate("Erreur suprr en base",err);
        }
        sails.log('Any mp3 named  have now been deleted in database.');
      });

    });
  }*/

  function addFileToExtract(path) {
      files.push(path);
      fs.stat(path, function(err, stat){
        if(err) throw err;
        console.log("time out");
        setTimeout(checkEnd, endTimeout, path, stat);
      });

  }

 /* function addFileToExtract(path) {
    files.push(path);
    console.log(files);
    extract();
  }*/

  function checkEnd(path, prev) {
      fs.stat(path, function (err, stat) {
        if (stat !== undefined && stat.mtime.getTime() === prev.mtime.getTime()) {
          extract(path);
        } else {
          setTimeout(checkEnd, endTimeout, path, prev);

        }
      });

  }

  function extract() {
    {

      if (extracting || files.length == 0)
        return;

      extracting = true;

      pathFile = files.pop();

      id3({file: pathFile, type: id3.OPEN_LOCAL}, function (err, tags) {
        //console.log(tags);

        var fileName = pathLib.basename(pathFile);
        var garbagePath = "./assets/garbage/" + fileName;
        var mp3File = true;

        if(fileName.split('.').pop() != "mp3")
        {
          moveFile(pathFile, garbagePath);
          mp3File = false;
        }
        if (err) {
          console.log("Erreur pendant l'extract : " + err);
        }


        //console.log(tags.album);

        if(mp3File) {
        console.log("Extracted " + pathFile);


        var album = tags.album;

          console.log("test album",album);
        if (album == "" || album == null) {
          var pathDatabase = "assets/inconnu/" + fileName;
          console.log("Ce MP3 n'a pas d'album !!");
          album = "unknown";
        }
        else{
            var pathDatabase = "assets/" + album + "/" + fileName;
            album = album.replace(/\0/g, '');
        }

          Mp3.create({album:album,title:tags.title,artist:tags.artist,year:tags.year,pathDatabase :pathDatabase}).exec(function createCB(err, created){   console.log('Created mp3 with name ' + created); });
          manageFile(album, pathFile, fileName);
        }

        extracting = false;

        setTimeout(extract, 600);
      });
    }
  }


  function manageFile(album, pathFile, fileName) {
    var newPath = "assets/" + album + "/" + fileName;
    var pathIncoming = "assets/inconnu/" + fileName;


    if (album == null || album == "unknown" || album == "") {

      moveFile(pathFile, pathIncoming)
    }
    else {
      fs.stat("assets/" + album, function (error) {
        if (error) {
          console.log(album);
          createFile(album, pathFile, pathIncoming, newPath);
        }
        else {
          console.log("album move",album);
          moveFile(pathFile, newPath)
        }
      });
    }
  }

  function createFile(album, pathFile, pathIncoming, newPath){
    fs.mkdir("assets/" + album, 0777, function (error) {
      console.log("album creation mkdir",album);
      if (error) {
        moveFile(pathFile, pathIncoming)
      }else {
        moveFile(pathFile, newPath)
      }
    });
  }

  function moveFile(path, newPath) {
    fs.rename(path, newPath, function (error) {
      console.log("Path : ",path);
      console.log("New Path : ",newPath);

      if (error) {
        console.log("11 - Erreur du move File",error);
        return;
      }
    });
  }

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
