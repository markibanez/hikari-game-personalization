import { getDb } from './_get-db-client';
import { validateSignature } from './_validate-signature';
import decisions from './../../data/decisions.json';

const handler = async (req, res) => {
    const { address, token, signature, option } = req.query;
    const tokenID = parseInt(token);

    const db = await getDb();
    const players = await db.collection('players');
    const player = await players.findOne({ address, tokenID }, { logs: 0 });

    let state = {};
    if (player) {
        state = player;
        if (!state.signed) {
            res.status(400).send('not-signed');
            return;
        }

        if (state.address !== address) {
            res.status(400).send('not-owner');
            return;
        }

        const currentDecision = decisions.find((d) => d.id === state.currentDecision);
        if (option) {
            let nextDecisionId;
            let rawEffects;
            const beforeStats = (({ red, blue, green, yellow, mana }) => ({ red, blue, green, yellow, mana }))(state);
            let logEntry = {
                beforeId: currentDecision.id,
                beforeStats,
                chosenOption: parseInt(option),
                randomized: { index: null, odds: null, number: null },
                afterId: null,
                afterStats: null,
            };

            switch (parseInt(option)) {
                case 1:
                    nextDecisionId = currentDecision.option1_id;
                    rawEffects = currentDecision.option1_effect;
                    break;
                case 2:
                    nextDecisionId = currentDecision.option2_id;
                    rawEffects = currentDecision.option2_effect;
                    break;
                case 3:
                    nextDecisionId = currentDecision.option3_id;
                    rawEffects = currentDecision.option3_effect;
                    break;
                case 4:
                    nextDecisionId = currentDecision.option4_id;
                    rawEffects = currentDecision.option4_effect;
                    break;
            }

            let isRandom = false;
            let randomSuccess = null;
            let newAchievement = null;
            if (typeof nextDecisionId === 'string') {
                const split = nextDecisionId.split(',').map((i) => i.trim());
                if (split.length === 2) {
                    isRandom = true;
                    const odds1 = split[0].split('-').map((i) => parseInt(i));
                    const odds2 = split[1].split('-').map((i) => parseInt(i));

                    const branch1Min = 1;
                    const branch1Max = odds1[2];
                    const branch2Min = branch1Max + 1;
                    const branch2Max = branch1Max + odds2[2];

                    const randomNumber = Math.floor(Math.random() * 100) + 1;
                    console.log(branch1Min, branch1Max, branch2Min, branch2Max, randomNumber);

                    const effectSplit = rawEffects.split(',').map((i) => i.trim());
                    if (branch1Max >= randomNumber && branch1Min <= randomNumber) {
                        randomSuccess = odds1[0] === 1;
                        nextDecisionId = odds1[1];
                        logEntry.randomized = { index: 0, odds: odds1[0], number: randomNumber };
                        rawEffects = effectSplit[0];
                    } else {
                        randomSuccess = odds2[0] === 1;
                        nextDecisionId = odds2[1];
                        logEntry.randomized = { index: 1, odds: odds2[0], number: randomNumber };
                        rawEffects = effectSplit[1];
                    }

                    console.log('nextDecisionId', randomNumber, nextDecisionId);
                } else {
                    isRandom = false;
                    nextDecisionId = parseInt(nextDecisionId);
                }
            }

            const nextDecision = decisions.find((d) => d.id === nextDecisionId);
            const effects = {};
            if (rawEffects) {
                const regex = new RegExp(/\b(?<property>red|blue|green|yellow|mana)\b(?<value>[+,-]\d{1,3})/gi);

                const matches = rawEffects.matchAll(regex);
                for (const m of matches) effects[`${m.groups.property?.toLowerCase()}`] = Number(m.groups.value);
            }

            logEntry.appliedEffects = effects;
            logEntry.afterId = nextDecision.id;

            if (nextDecision) {
                const updatePayload = {
                    $set: { currentDecision: nextDecisionId },
                    $inc: effects,
                    $push: { logs: logEntry },
                    $addToSet: {},
                };

                // random luck calculation variables
                if (isRandom) {
                    updatePayload.$inc.randomChoice = 1;
                    if (randomSuccess) updatePayload.$inc.randomSuccess = 1;
                    else updatePayload.$inc.randomFail = 1;
                }

                // story effects
                const storyEffects = currentDecision.story_effects;
                if (storyEffects) {
                    if (storyEffects === 'male') updatePayload.$set.gender = 'male';
                    else if (storyEffects === 'female') updatePayload.$set.gender = 'female';
                    else {
                        // achievements
                        const achievements = storyEffects.split(',').map((a) => a?.trim());
                        if (achievements.length === 1) {
                            updatePayload.$addToSet.achievements = storyEffects;
                            // newAchievement = storyEffects;
                        } else if (achievements.length === 4) {
                            const achievement = achievements[option - 1];
                            if (achievement) {
                                if (achievement !== 'x') {
                                    updatePayload.$addToSet.achievements = achievement;
                                    newAchievement = achievement;
                                }
                            }
                        } else {
                            console.log(`unknown achievement format ${storyEffects}`);
                        }
                    }
                }

                await players.updateOne({ address, tokenID }, updatePayload);

                if (effects?.mana !== undefined) state.mana += effects?.mana;

                state.currentDecision = nextDecisionId;
                state.isRandom = isRandom;
                state.randomSuccess = randomSuccess;
                state.randomEffects = effects;
                // state.newAchievement = 'senseis_tanto';
                state.newAchievement = newAchievement;
                // console.log(state);
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
                mana: 20,
                red: 0,
                yellow: 0,
                blue: 0,
                green: 0,
                randomChoice: 0,
                randomSuccess: 0,
                randomFail: 0,
                currentDecision: 1,
                finalized: false
            };
            await players.insertOne(state);
        } else {
            res.status(401).send('invalid-signature');
            return;
        }
    }

    const decision = decisions.find((d) => d.id === state.currentDecision);

    let manaRanking = null;
    if (decision.id >= 700 && decision.id <= 710) {
        manaRanking = await players.aggregate([
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
    res.status(200).json({ state, decision, manaRanking });
};

export default handler;
