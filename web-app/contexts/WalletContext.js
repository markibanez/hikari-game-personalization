import {
    ReactNode,
    useState,
    createContext,
    useEffect
} from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Web3Modal from 'web3modal';
import { useSnackbar } from 'notistack';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Typography } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WalletContext = createContext({});

const walletTypes = {
    'metamask': { display: 'MetaMask' },
    'walletconnect': { display: 'WalletConnect' }
}

const networks = {
    1: {
        name: 'Ethereum Mainnet'
    },
    3: {
        name: 'Ropsten Testnet'
    },
    4: {
        name: 'Rinkeby Testnet'
    },
    5: {
        name: 'Goerli Testnet'
    },
    42: {
        name: 'Kovan Testnet'
    },
    137: {
        name: 'Polygon Mainnet'
    },
    80001: {
        name: 'Polygon Mumbai Testnet'
    }
};

let web3Modal;
export function WalletProvider({ children }) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: '9c36c1ad9b8b45459b40c15aeb2449a2'
                }
            }
        };

        web3Modal = new Web3Modal({
            // cacheProvider: true,
            providerOptions
        });

        // if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) connect();
    }, []);

    const [address, setAddress] = useState(null);
    const [network, setNetwork] = useState(null);
    const [ethersProvider, setEthersProvider] = useState(null);
    const [ethersSigner, setEthersSigner] = useState(null);
    const [walletType, setWalletType] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [selectedToken, setSelectedToken] = useState(null);
    const [gettingTokens, setGettingTokens] = useState(false);
    const [groupedTokens, setGroupedTokens] = useState([]);

    const requiredNetwork = 1;
    const connect = async () => {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: '9c36c1ad9b8b45459b40c15aeb2449a2'
                }
            }
        };

        web3Modal = new Web3Modal({
            // cacheProvider: true,
            providerOptions
        });

        const instance = await web3Modal.connect();

        if (instance.networkVersion != requiredNetwork) {
            enqueueSnackbar((<Typography sx={{ fontSize: '2.5vmin' }}>{`You are not in the correct network. Please switch your wallet to ${networks[requiredNetwork]?.name}`}</Typography>), { variant: 'error' });
            return;
        }

        web3Modal.clearCachedProvider();
        instance.on('accountsChanged', (accounts) => {
            router.reload(window.location.pathname);
        });

        instance.on('chainChanged', (chainId) => {
            router.reload(window.location.pathname);
        });

        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();

        let walletType = null;
        if (instance.isMetaMask) walletType = 'metamask';
        if (instance.isWalletConnect) walletType = 'walletconnect';

        let userAddress;
        switch (walletType) {
            case 'metamask':
                userAddress = ethers.utils.getAddress(instance.selectedAddress); break;
            case 'walletconnect':
                userAddress = ethers.utils.getAddress(instance.accounts[0]); break;
        }

        setNetwork(instance.networkVersion);
        setWalletType(walletType);
        setEthersProvider(provider);
        setEthersSigner(signer);
        setAddress(userAddress);
    };

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();

        setAddress(null);
        setNetwork(null);
        setEthersProvider(null);
    };

    const getNFTs = async () => {
        if (!address) throw 'not-connected';
        if (!ethersProvider) throw 'no-provider';

        setGettingTokens(true);

        try {
            const abi = [
                "function balanceOf(address owner) view returns (uint256 balance)",
                "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint tokenId)",
                "function tokenURI(uint tokenId) view returns (string tokenUri)",
            ]

            const contractAddress = process.env.NEXT_PUBLIC_ERC721_ADDRESS;
            const contract = new ethers.Contract(contractAddress, abi, ethersProvider);

            const balance = await contract.balanceOf(address);

            const tokenMetadata = []
            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(address, i);
                // const tokenURI = await contract.tokenURI(tokenId);

                // const response = await fetch(tokenURI);
                // const metadata = await response.json();
                const metadata = {};
                metadata.tokenId = tokenId;
                tokenMetadata.push(metadata);
            }

            setTokens(tokenMetadata);
            if (tokenMetadata.length === 0) {
                enqueueSnackbar((<h2>{`Sorry but your wallet ${address} does not own any Hikari NFTs`}</h2>), { variant: 'error', persist: true } );
            }
        } catch (err) {
            console.log(err);
        } finally {
            setGettingTokens(false);
        }
    }

    const getNFT = async (tokenId) => {
        if (!ethersProvider) throw 'no-provider';
        const abi = ["function tokenURI(uint tokenId) view returns (string tokenUri)"]

        const contractAddress = process.env.NEXT_PUBLIC_ERC721_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, ethersProvider);

        // const tokenURI = await contract.tokenURI(tokenId);

        // const response = await fetch(tokenURI);
        // const metadata = await response.json();
        const metadata = {};
        metadata.tokenId = tokenId;

        return metadata;
    }

    const getNFTOwner = async (tokenId) => {
        if (!ethersProvider) throw 'no-provider';
        const abi = ["function ownerOf(uint tokenId) view returns (address owner)"]

        const contractAddress = process.env.NEXT_PUBLIC_ERC721_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, ethersProvider);

        return (await contract.ownerOf(tokenId));
    }

    return (
        <WalletContext.Provider
            value={{
                address,
                network,
                walletType,
                ethersProvider,
                ethersSigner,
                networks,
                walletTypes,
                tokens,
                selectedToken,
                gettingTokens,
                connect,
                disconnect,
                getNFTs,
                getNFT,
                getNFTOwner
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
