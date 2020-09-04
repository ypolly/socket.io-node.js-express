function formatMessage(username, text){
    return{
        username,
        text
    }
};

function formatGif(username, url){
    return{
        username,
        url
    }
};
module.exports = {formatMessage, formatGif};