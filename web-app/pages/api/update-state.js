import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';
import decisions from './../../data/decisions.json';

const handler = async (req, res) => {
    const { address, token, signature, option } = req.query;
    const tokenID = parseInt(token);

    const db = await getDb();
    const players = await db.collection('players');
    const player = await players.findOne({ address, tokenID }); console.log(player, 'player');

    let state = {};
    if (player) {
        state = player; console.log(state, 'state');
        if (!state.signed) {
            res.status(400).send('not-signed');
            return;
        }

        if (state.address !== address) {
            res.status(400).send('not-owner');
            return;
        }

        const currentDecision = decisions.find(d => d.id === state.currentDecision);
        if (option) {
            let nextDecisionId;
            switch (parseInt(option)) {
                case 1:
                    nextDecisionId = currentDecision.option1_id;
                    break;
                case 2:
                    nextDecisionId = currentDecision.option2_id;
                    break;
                case 3:
                    nextDecisionId = currentDecision.option3_id;
                    break;
                case 4:
                    nextDecisionId = currentDecision.option4_id;
                    break;
            }

            const nextDecision = decisions.find(d => d.id === nextDecisionId);
            if (nextDecision) {
                await players.updateOne({ address, tokenID }, { $set: { currentDecision: nextDecisionId } });
                state.currentDecision = nextDecisionId;
            }

        }
    } else {
        // check signature and create initial state
        const validSignature = validateSignature(address, 'update-state', signature);
        console.log(validSignature);
        if (validSignature) {
            state = {
                address,
                tokenID,
                signed: true,
                mana: 0,
                red: 0,
                yellow: 0,
                blue: 0,
                green: 0,
                currentDecision: 1,
                decisionHistory: []
            };
            await players.insertOne(state);
        } else {
            res.status(401).send('invalid-signature');
            return;
        }
    }

    const decision = decisions.find(d => d.id === state.currentDecision);

    res.status(200).json({ state, decision });
}

export default handler;
