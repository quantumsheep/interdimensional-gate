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
        os.setState({ description: value });
        os.input('');
        return;
    }
}