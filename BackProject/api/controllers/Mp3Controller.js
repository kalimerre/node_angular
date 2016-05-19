/**
 * Mp3Controller
 *
 * @description :: Server-side logic for managing mp3s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  destroy:function(req, res) {
    console.log("requete",req.params);
    console.log("res",res);
  }

};
