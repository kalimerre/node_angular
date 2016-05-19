/**
 * Mp3Controller
 *
 * @description :: Server-side logic for managing mp3s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');

module.exports = {



  destroy:function(req, res) {
    console.log("requete",req.params);


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

    Mp3.destroy({id:req.params.id}).exec(function (err){
      console.log("Suppression du fichier en base");
      if (err) {
        return res.negotiate("Erreur suprr en base",err);
      }
      sails.log('Any mp3 named  have now been deleted, if there were any.');
      return res.ok();
    });

    //Delete mp3 in database

  }


};
