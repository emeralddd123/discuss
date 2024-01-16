//NavBar
function hideIconBar(){
    var iconBar = document.getElementById("iconBar");
    var navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:none;");
    navigation.classList.remove("hide");
}

function showIconBar(){
    var iconBar = document.getElementById("iconBar");
    var navigation = document.getElementById("navigation");
    iconBar.setAttribute("style", "display:block;");
    navigation.classList.add("hide");
}

//Comment
function showReply(){
    var commentArea = document.getElementById("comment-area");
    commentArea.classList.remove("hide");
}

function hideReplyBox(){
    var commentArea = document.getElementById("comment-area");
    commentArea.classList.add("hide"); 
}

