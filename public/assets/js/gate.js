const terminal = {
    prefix: document.getElementById('cmd-prefix'),
    content: document.getElementById('cmd-content'),
    input: document.getElementById('cmd-input'),
}

const updatePrefix = () => {
    terminal.prefix.innerText = `root@${username} >`;
}

window.addEventListener('click', function (e) {
    terminal.input.focus();
});

terminal.input.addEventListener('input', function (e) {
    terminal.content.innerText = this.value;
});

document.getElementById('terminal').addEventListener('submit', function (e) {
    e.preventDefault();

    terminal.input.value = '';
    terminal.content.innerText = '';
});