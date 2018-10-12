/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = (os, [action]) => {
    if (!action) {
        os.help();
    }

    if (action === 'create') {
        os.setState();
        os.input('Challenge name:');
    }
}

/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.state = (os, value) => {
    if(!os.state.data.name) {
        os.setState({ name: value });
        os.input('Challenge description:', 'textarea');
        return;
    }

    if(!os.state.data.description) {
        os.setState({ description: value, i: 1 });
        os.input(`Input length:`, 'number');
        return;
    }

    if(!os.state.data.input) {
        const input = new Array(parseInt(value));
        os.setState({ input, i: 0 });
        return;
    }

    if(!os.state.data.input[os.state.data.i]) {
        

        if(os.state.data.input.length > os.state.data.i + 1) {
            os.state.data.i++;
        }
    }
}