import { getDb } from './_get-db-client';
import decisions from './../../data/decisions.json';

const handler = async (req, res) => {
    const { address, token } = req.query;
    const tokenID = parseInt(token);
    const db = await getDb();
    const states = await db.collection('players');
    const state = await states.findOne({ address, tokenID });
    const decision = decisions.find(d => d.id === state.currentDecision);

    let manaRanking = null;
    if (decision.id === 700) {
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
                $match: { tokenID: 2 },
            },
            {
                $project: { tokenID: 1, mana: 1, manaRank: 1 },
            },
        ]).toArray();
    }

    res.status(200).json({ state, decision, manaRanking } || {});
}

export default handler;
