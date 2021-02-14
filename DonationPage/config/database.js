if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb+srv://bishal:bishal@donationcluster.cakhv.mongodb.net/<dbname>?retryWrites=true&w=majority'
    }
}
else {
    module.exports = {
        mongoURI: 'mongodb://localhost/Donation'
    }

}