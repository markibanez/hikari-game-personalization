import { ethers } from "ethers";

export const validateSignature = (address, message, signature) => {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return address === recoveredAddress;
}