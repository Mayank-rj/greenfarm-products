
const verifyUser = async (req, res) => {
    res.status(200).send({ success: true, message: "Token verified" })
}

module.exports = {
    verifyUser
}