const updatePrefix = () => {
    document.getElementById('cmd-prefix').innerText = `root@${username} >`;
}

window.addEventListener('click', function(e) {
    document.getElementById('command').focus();
});