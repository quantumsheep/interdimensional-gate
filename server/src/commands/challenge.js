/**
 * @param {import('../GateOS')} os 
 * @param {string[]} args
 */
exports.call = (os, [action]) => {
    if (!action) {
        os.help('challenge');
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
    if (!os.state.data.name) {
        os.setState({ name: value });
        return os.input('Challenge description:', 'textarea');
    }

    if (!os.state.data.description) {
        os.setState({ description: value, i: 1 });
        return os.input('Input length:');
    }

    if (!os.state.data.input) {
        if (isNaN(value)) {
            return os.row('Given length is not a number').input('Input length:');
        }

        const input = new Array(parseInt(value));
        os.setState({ input, i: 0 });
        return os.input('Input N°1:');
    }

    if (os.state.data.input.length > os.state.data.i && !os.state.data.input[os.state.data.i]) {
        os.state.data.input[os.state.data.i] = value;

        if (os.state.data.input.length > os.state.data.i + 1) {
            os.state.data.i++;
            return os.input(`Input N°${os.state.data.i + 1}:`);
        }

        return os.input('Wanted output length:');
    }

    if (!os.state.data.output) {
        if (isNaN(value)) {
            return os.row('Given length is not a number').input('Wanted output length:');
        }

        const output = new Array(parseInt(value));
        os.setState({ output, i: 0 });
        return os.input('Wanted onput N°1:');
    }

    if (os.state.data.output.length > os.state.data.i && !os.state.data.output[os.state.data.i]) {
        os.state.data.output[os.state.data.i] = value;

        if (os.state.data.output.length > os.state.data.i + 1) {
            os.state.data.i++;
            return os.input(`Wanted output N°${os.state.data.i + 1}:`);
        }

        return os.row('Challenge created!').end();
    }
}