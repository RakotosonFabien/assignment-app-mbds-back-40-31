let User = require('../model/user');

// Récupérer tous les assignments (GET)
function getUsersSansPagination(req, res){
    User.find((err, user) => {
        if(err){
            res.send(err)
        }

        res.send(user);
    });
}

function getUsers(req, res) {
    var aggregateQuery = User.aggregate();
    
    User.aggregatePaginate(aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, user) => {
        if (err) {
          res.send(err);
        }
        res.send(user);
      }
    );
   }
   
// Récupérer un user par son id (GET)
function getUser(req, res){
    let userID = req.params.id;

    User.findOne({id: userID}, (err, user) =>{
        if(err){res.send(err)}
        res.json(user);
    })
}

//authentification user
function loginUser(req, res){
    let userEmail = req.body.email;
    let userMdp = req.body.mdp;
    User.findOne({email : userEmail, mdp : userMdp}, (err, user) =>{
        if(err){res.send(err)}
        res.json(user);
    })
}

// Ajout d'un user (POST)
function postUser(req, res){
    let user = new User();
    user.id = req.body.id;
    user.nom = req.body.nom;
    user.dateDeRendu = req.body.dateDeRendu;
    user.rendu = req.body.rendu;

    console.log("POST user reçu :");
    console.log(user)

    user.save( (err) => {
        if(err){
            res.send('cant post user ', err);
        }
        res.json({ message: `${user.nom} saved!`})
    })
}

// Update d'un user (PUT)
function updateUser(req, res) {
    console.log("UPDATE recu user : ");
    console.log(req.body);
    
    User.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, user) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: user.nom + 'updated'})
        }

      // console.log('updated ', user)
    });

}

// suppression d'un user (DELETE)
function deleteUser(req, res) {

    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${user.nom} deleted`});
    })
}



module.exports = { getUsers, postUser, getUser, updateUser, deleteUser, loginUser };
