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
            // network: 'mainnet',
            cacheProvider: true,
            providerOptions
        });
    }, []);

    const [address, setAddress] = useState(null);
    const [network, setNetwork] = useState(null);
    const [ethersProvider, setEthersProvider] = useState(null);
    const [ethersSigner, setEthersSigner] = useState(null);
    const [walletType, setWalletType] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [selectedToken, setSelectedToken] = useState(null);

    const connect = async () => {
        const instance = await web3Modal.connect();
        instance.on('accountsChanged', (accounts) => {
            setAddress(ethers.utils.getAddress(accounts[0]));
        });

        instance.on('chainChanged', (chainId) => {
            const networkId = parseInt(chainId, 16);
            setNetwork(networkId);
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

        enqueueSnackbar('Wallet connected', { variant: 'success' });
    };

    const disconnect = async () => {
        web3Modal.clearCachedProvider();

        setAddress(null);
        setNetwork(null);
        setEthersProvider(null);
    };

    const getNFTs = async () => {
        if (!address) throw 'not-connected';
        if (!ethersProvider) throw 'no-provider';

        const abi = [
            "function balanceOf(address owner) view returns (uint balance)",
            "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint tokenId)"
        ]

        const contractAddress = process.env.NEXT_PUBLIC_ERC721_ADDRESS;
        const contract = new ethers.Contract(contractAddress, abi, ethersProvider);

        const balance = await contract.balanceOf(address);

        // for (let i = 0; i < balance; i++) {
        //     const tokenId = await contract.tokenOfOwnerByIndex(address, i + 1);
        //     console.log(tokenId);
        // }
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
                connect,
                disconnect,
                getNFTs
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}
