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
    console.log('File added : ' + path);
    addFileToExtract(path);
  });

  var files = [];
  var extracting = false;

  function addFileToExtract(path) {
    files.push(path);
    console.log(files);
    extract();
  }

  function extract() {
    {

      if (extracting || files.length == 0)
        return;

      extracting = true;

      pathFile = files.pop();

      console.log("Extracting : " + pathFile);
      id3({file: pathFile, type: id3.OPEN_LOCAL}, function (err, tags) {

        if (err) {
          console.log("Erreur pendant l'extract : " + err);
          return;
        }


        //console.log(tags.album);


        console.log("Extracted " + pathFile);


        var album = tags.album;
        if (album == '') {
          console.log("Ce MP3 n'a pas d'album !!");
          return;
        }
        var fileName = pathLib.basename(pathFile);
        console.log("Album : " + album);
        console.log("Filename : " + fileName);

        manageFile(album, pathFile, fileName);

        extracting = false;

        setTimeout(extract, 100);
      });
    }
  }


  function manageFile(album, pathFile, fileName) {
    var newPath = "albums/" + album + "/" + fileName;
    var pathIncoming = "albums/inconnu/" + fileName;
    console.log("Album dans manageFile : " + album);

    if (album == null) {
      moveFile(pathFile, pathIncoming)
    }
    else {
      fs.stat(album, function (error) {
        if (error) {
          fs.mkdir(album, function () {
            moveFile(pathFile, newPath)
          });
        }
        else {

          moveFile(pathFile, newPath)
        }

      });
    }
  }

  function moveFile(path, newPath) {
    fs.rename(path, newPath, function (error) {
      if (error) {
        console.log(error);
        return;
      }

      console.log("file moved to : " + newPath);
    });
  }

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
