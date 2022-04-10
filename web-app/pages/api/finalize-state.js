import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';
import decisions from './../../data/decisions.json';

const handler = async (req, res) => {
    const { address, token, signature } = req.query;
    const tokenID = parseInt(token);

    const db = await getDb();
    const players = await db.collection('players');

    // check signature and create initial state
    const validSignature = validateSignature(address, 'finalize-state', signature);
    console.log(validSignature);
    if (validSignature) {
        await players.updateOne({ address, tokenID }, { $set: { finalized: true }});
    } else {
        res.status(401).send('invalid-signature');
        return;
    }

    res.status(200).json({ result: 'success' });
};

export default handler;
