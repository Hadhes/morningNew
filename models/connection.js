const mongoose = require('mongoose')

const options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true
}

mongoose.connect('mongodb+srv://mongotest:mongotest@cluster0.0qy9h.mongodb.net/morningnews?retryWrites=true&w=majority',
    options,
    function(err){
        if(err) {
            console.log('erreur :',err)
        } else {
            console.log('Connexion OK')
        }
    }
)

module.exports = mongoose