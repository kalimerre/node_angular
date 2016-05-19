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
  var watcher = chokidar.watch('incoming_songs', {
    ignored: /[\/\\]\./,
    persistent: true
  });



  watcher.on('add', function (path) {
    console.log('1 - File added : ' + path);
    addFileToExtract(path);
  });

  var files = [];
  var extracting = false;
  var endTimeout = 1000;

  function addFileToExtract(path) {

      files.push(path);
      console.log(files);
      fs.stat(path, function(err, stat){
        if(err) throw err;
        setTimeout(checkEnd, endTimeout, path, stat);
      });

  }

 /* function addFileToExtract(path) {
    files.push(path);
    console.log(files);
    extract();
  }*/

  function checkEnd(path, prev){
    fs.stat(path, function(err, stat){
      if(stat !== undefined && stat.mtime.getTime() === prev.mtime.getTime()){
        extract(path);
      }else{
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

      console.log("Extracting : " + pathFile);
      id3({file: pathFile, type: id3.OPEN_LOCAL}, function (err, tags) {
        //console.log(tags);

        var fileName = pathLib.basename(pathFile);
        var garbagePath = "./garbage/" + fileName;
        var mp3File = true;

        if(fileName.split('.').pop() != "mp3")
        {
          moveFile(pathFile, garbagePath);
          mp3File = false;
        }
        if (err) {
          console.log("2 - Erreur pendant l'extract : " + err);
        }


        //console.log(tags.album);

        if(mp3File) {
        console.log("2 bis - Extracted " + pathFile);


        var album = tags.album;

        if (album == '' || album == null) {
          var pathDatabase = "./inconnu/" + fileName;
          console.log("Ce MP3 n'a pas d'album !!");
        }
        else{
            var pathDatabase = "./" + album + "/" + fileName;
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
    var newPath = "./" + album + "/" + fileName;
    var pathIncoming = "./inconnu/" + fileName;
    console.log("3 - Album dans manageFile : " + album);


    if (album == null) {
      console.log("3bis - album est nul");
      moveFile(pathFile, pathIncoming)
    }
    else {
      fs.stat(album, function (error) {
        if (error) {
          console.log(album);
          createFile(album, pathFile, pathIncoming, newPath);
        }
        else {
          moveFile(pathFile, newPath)
        }
      });
    }
  }

  function createFile(album, pathFile, pathIncoming, newPath){
    fs.mkdir(album, 0777, function (error) {
      if (error) {
        moveFile(pathFile, pathIncoming)
      }else {
        moveFile(pathFile, newPath)
      }
    });
  }

  function moveFile(path, newPath) {
    fs.rename(path, newPath, function (error) {
      console.log("6 - deplacement du fichier");
      if (error) {
        console.log("7 - Erreur du move File",error);
        return;
      }
      console.log("8 - file moved to : " + newPath);
    });
  }

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
