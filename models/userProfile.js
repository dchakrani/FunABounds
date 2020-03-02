//userProfile data object defined with userID, userConnections
var userProfile = function userProfile(userID, userConnections) {
    this.userID = userID;
    this.userConnections = userConnections;
}

module.exports.userProfile = userProfile;