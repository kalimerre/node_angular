/**
 * Mp3Controller
 *
 * @description :: Server-side logic for managing mp3s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var ffmetadata = require("ffmetadata");
var ffmpeg = require('ffmpeg');

module.exports = {

  destroy:function(req, res) {

    //Recherche du fichier
    Mp3.find({id:req.params.id}).exec(function (err, mp3){
      if (err) {
        return res.negotiate(err);
      }
      console.log('Wow, there are %d users named mp3.  Check it out:', mp3.length, mp3);

      fs.unlink(mp3[0].pathDatabase, function(err){
        if (err){ console.log("Erreur delete fichier",err);}
      });
      console.log("Fichier supprime du dossier");
    });


    //Delete du fichier
    Mp3.destroy({id:req.params.id}).exec(function (err){
      console.log("Suppression du fichier en base");
      if (err) {
        return res.negotiate("Erreur suprr en base",err);
      }
      sails.log('Any mp3 named  have now been deleted, if there were any.');
      return res.ok();
    });

    //Delete mp3 in database

  },

  update:function(req,res){


    Mp3.find({id:req.params.id}).exec(function (err, mp3){
      if (err) {
        return res.negotiate("Erreur ouverture fichier",err);
      }
      var artiste = mp3[0].artist;
      var album = mp3[0].album;
      var title = mp3[0].title;
      var pathDatabase = mp3[0].pathDatabase;

      if(artiste != null){
        var artistEsc = artiste.replace(/\0/g, '');
      }
      else{
        var artistEsc = "";
      }

      if(album != null){
        var albumEsc = album.replace(/\0/g, '');
      }
      else{
        var albumEsc = "";
      }

      if(title != null){
        var titleEsc = title.replace(/\0/g, '');
      }
      else{
        var titleEsc = "";
      }

      if(pathDatabase != null){
        var pathDatabaseEsc = pathDatabase.replace(/\0/g, '');
      }
      else{
        var pathDatabaseEsc = "";
      }



      var data = {
        artist: "Maxime"
      };

      ffmetadata.write('The Weeknd - The Hills.mp3', data, function(err) {
        if (err) console.error("Error writing metadata", err);
        else console.log("Data written");
      });

      Mp3.update({artist: artistEsc}, {album: albumEsc}, {title: titleEsc}).exec(function afterwards(err, updated){
        if (err) {
          console.log("Erreur updatefichier",err);
          return;
        }

        console.log('Updated user to have name ' + updated[0].name);
      });


    })


  }


};
