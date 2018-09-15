const updatePrefix = () => {
    document.getElementById('cmd-prefix').innerText = `${user.username}@gate${user._id} >`;
}

updatePrefix();

window.addEventListener('click', function(e) {
    document.getElementById('command').focus();
});