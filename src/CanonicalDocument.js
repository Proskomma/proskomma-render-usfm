const {ScriptureParaDocument} = require('proskomma-render');

class CanonicalDocument extends ScriptureParaDocument {

    constructor(result, context, config) {
        super(result, context, config);
        addActions(this);
    }

    outputLine(str) {
        process.stdout.write(`${str}\n`);
    }

    outputChars(str) {
        process.stdout.write(`${str}`);
    }

}

const addActions = (dInstance) => {

    dInstance.addAction(
        'startDocument',
        context => true,
        (renderer, context) => {
            for (const field of ['id', 'usfm', 'ide', 'h', 'toc', 'toc2', 'toc3']) {
                if (field in context.document.headers) {
                    renderer.outputLine(`\\${field === 'toc' ? 'toc1' : field} ${context.document.headers[field]}`);
                }
            }
        }
    );

    dInstance.addAction(
        'endDocument',
        context => true,
        (renderer, context) => {
            renderer.outputLine('');
        }
    );

    dInstance.addAction(
        'blockGraft',
        context => true,
        (renderer, context, data) => {
            renderer.renderSequenceId(data.payload);
        }
    );

    dInstance.addAction(
        'startBlock',
        context => true,
        (renderer, context, data) => {
            const bsTag = data.bs.payload.split('/')[1];
            const sequenceType = context.sequenceStack[0].type;
            if (['title'].includes(sequenceType)) {
                renderer.outputChars(`\n\\${bsTag} `);
            } else {
                renderer.outputLine(`\n\\${bsTag}`);
            }
        },
    );

    dInstance.addAction(
        'scope',
        (context, data) => data.subType === 'start' && ['chapter', 'verses'].includes(data.payload.split('/')[0]),
        (renderer, context, data) => {
            const scopeBits = data.payload.split('/');
            renderer.outputChars(`\n\\${scopeBits[0][0]} ${scopeBits[1]}${scopeBits[0] === 'chapter' ? "\n" : " "}`);
        },
    );

    dInstance.addAction(
        'token',
        context => true,
        (renderer, context, data) => {
            const payload = ['lineSpace', 'eol'].includes(data.subType) ? ' ' : data.payload;
            renderer.outputChars(payload);

        }
    );

}

module.exports = CanonicalDocument;
