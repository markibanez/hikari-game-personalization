import { getDb } from './_get-db-client';
import { ethers } from 'ethers';

const handler = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        res.status(400).json({ error: 'no token provided' });
        return;
    }

    const tokenID = parseInt(token);

    if (isNaN(tokenID)) {
        res.status(400).json({ error: 'invalid token' });
        return;
    }

    const contractAddress = process.env.NEXT_PUBLIC_ERC721_ADDRESS;
    const contractNetwork = 'rinkeby';

    const abi = ['function tokenURI(uint256 tokenID) view returns (string uri)'];
    const provider = ethers.providers.getDefaultProvider(contractNetwork);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const tokenURI = await contract.tokenURI(tokenID);
        const db = await getDb();
        const states = await db.collection('players');
        const state = await states.findOne({ tokenID });

        if (!state) {
            res.json({ minted: true, genuStarted: false });
            return;
        }

        delete state._id;
        delete state.logs;
        res.json({ minted: true, genuStarted: true, currentState: state });
    } catch (err) {
        if (err.reason === 'Token does not exist') res.json({ minted: false });
        else res.status(500).json(err);
    }
}

export default handler;
