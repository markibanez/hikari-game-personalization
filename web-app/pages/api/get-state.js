import { getDb } from './_get-db-client';
import decisions from './../../data/decisions.json';

const handler = async (req, res) => {
    const { address, token } = req.query;
    const tokenID = parseInt(token);
    const db = await getDb();
    const states = await db.collection('players');
    const state = await states.findOne({ address, tokenID }, { logs: 0 });
    const decision = decisions.find(d => d.id === state.currentDecision);

    let manaRanking = null;
    if (decision.id >= 700 && decision.id <= 710) {
        manaRanking = await states.aggregate([
            {
                $setWindowFields: {
                    sortBy: { mana: -1 },
                    output: {
                        manaRank: { $rank: {} },
                    },
                },
            },
            {
                $match: { tokenID },
            },
            {
                $project: { tokenID: 1, mana: 1, manaRank: 1 },
            },
        ]).toArray();
    }
    delete state.logs;
    res.status(200).json({ state, decision, manaRanking } || {});
}

export default handler;
