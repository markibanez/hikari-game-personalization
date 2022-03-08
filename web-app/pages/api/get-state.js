import { getDb } from './_get-db-client';
import decisions from './../../data/decisions.json';

const handler = async (req, res) => {
    const { address, token } = req.query;
    const tokenID = parseInt(token);
    const db = await getDb();
    const states = await db.collection('players');
    const state = await states.findOne({ address, tokenID });
    const decision = decisions.find(d => d.id === state.currentDecision);

    res.status(200).json({ state, decision } || {});
}

export default handler;
