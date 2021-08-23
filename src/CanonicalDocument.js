const {ScriptureParaDocument} = require('proskomma-render');

class CanonicalDocument extends ScriptureParaDocument {

    constructor(result, context, config) {
        super(result, context, config);
        addActions(this);
    }

}

const addActions = (dInstance) => {

    const selectedSequence = (renderer, context) =>
        (!renderer.config.sequenceId && context.sequenceStack[0].type === 'main') ||
        context.sequenceStack[0].id === renderer.config.sequenceId;

    dInstance.addAction(
        'startDocument',
        context => true,
        (renderer, context) => {
            console.log(context);
        }
    );

};

module.exports = CanonicalDocument;
