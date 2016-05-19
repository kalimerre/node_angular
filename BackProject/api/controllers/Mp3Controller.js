/**
 * Mp3Controller
 *
 * @description :: Server-side logic for managing mp3s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {

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
      //addFileToExtract(path);
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
            console.log(err);
            return;
          }


          console.log(tags.album);


          console.log("Extracted " + pathFile);


          var album = tags.album;
          if (album == '') {
            console.log("Ce MP3 n'a pas d'album !!");
            return;
          }
          var fileName = pathLib.basename(pathFile);
          console.log("Album : " + album);
          console.log("Filename : " + fileName);
          Mp3.create({
            title: data.title,
            resume: data.resume,
            description: data.description,
            collaboratorNumber: data.collaboratorNumber,
            status: Project.getStatusExpectation(),
            owner: user}).exec(function(err, project){

          });
          manageFile(album, pathFile, fileName);

          extracting = false;

          setTimeout(extract, 100);
        });
      }
    }


    function manageFile(album, pathFile, fileName) {
      var newPath = album + "/" + fileName;

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

    function moveFile(path, newPath) {
      fs.rename(path, newPath, function (error) {
        if (error) {
          console.log(error);
          return;
        }

        console.log("file moved to : " + newPath);
      });
    }
  }
};
