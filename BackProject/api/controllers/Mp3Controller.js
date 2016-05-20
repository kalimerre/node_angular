/**
 * Mp3Controller
 *
 * @description :: Server-side logic for managing mp3s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');

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

  updateMetaData:function(req,res){

    console.log("cool je suis la apres update");
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
        var artistEsc = artiste;
      }

      if(album != null){
        var albumEsc = album.replace(/\0/g, '');
      }
      else{
        var albumEsc = album;
      }

      if(title != null){
        var titleEsc = title.replace(/\0/g, '');
      }
      else{
        var titleEsc = title;
      }

      if(pathDatabase != null){
        var pathDatabaseEsc = pathDatabase.replace(/\0/g, '');
      }
      else{
        var pathDatabaseEsc = pathDatabase;
      }

      var ID3Writer = require('browser-id3-writer');
      var songBuffer = fs.readFileSync(pathDatabaseEsc);
      var writer = new ID3Writer(songBuffer);
      writer.setFrame('TIT2', titleEsc)
        .setFrame('TPE1', [artistEsc])
        .setFrame('TPE2', artistEsc)
        .setFrame('TALB', albumEsc);
      writer.addTag();

      var taggedSongBuffer = new Buffer(writer.arrayBuffer);
      fs.writeFileSync(pathDatabaseEsc, taggedSongBuffer);
      



    });

  }


};
