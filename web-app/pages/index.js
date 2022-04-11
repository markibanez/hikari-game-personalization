import ConnectWallet from '../components/ConnectWallet';
import SelectToken from '../components/SelectToken';
import WalletInfo from '../components/WalletInfo';
import styles from '../styles/Home.module.css';

export default function Home() {

    return (
        <div className={styles.container}>
            <main className={styles.main}>

                <video
                    playsInline
                    autoPlay
                    muted
                    loop
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                >
                    <source src="https://storage.googleapis.com/hikari-genu/homescreenvideo.mp4" type="" />
                </video>

                <ConnectWallet />
                <SelectToken />


            </main>
        </div>
    );
}
