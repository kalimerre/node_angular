/**
 * Mp3Controller
 *
 * @description :: Server-side logic for managing mp3s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var ffmetadata = require("ffmetadata");

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

      artistEsc = mp3[0].artist.replace(/\0/g, '');
      albumEsc = mp3[0].album.replace(/\0/g, '');
      titleEsc = mp3[0].title.replace(/\0/g, '');
      pathDatabaseEsc = mp3[0].pathDatabase.replace(/\0/g, '');
      
      var data = {
        artist: artistEsc,
        album: albumEsc,
        title: titleEsc
      };

      ffmetadata.write(pathDatabaseEsc, data, function(err) {
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
