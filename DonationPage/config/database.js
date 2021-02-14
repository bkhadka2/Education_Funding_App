if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb+srv://removed-for-security-reason'
    }
}
else {
    module.exports = {
        mongoURI: 'mongodb://localhost/Donation'
    }

}
