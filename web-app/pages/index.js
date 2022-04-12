import ConnectWallet from '../components/ConnectWallet';
import SelectToken from '../components/SelectToken';
import WalletInfo from '../components/WalletInfo';
import styles from '../styles/Home.module.css';

export default function Home() {

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <ConnectWallet />
                <SelectToken />
            </main>
        </div>
    );
}
