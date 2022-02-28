import Head from 'next/head';
import Image from 'next/image';
import ConnectWallet from '../components/ConnectWallet';
import styles from '../styles/Home.module.css';
import data from './data.json';

export default function Home() {
    console.log(data);
    return (
        <div className={styles.container}>
            <Head>
                <title>Hikari</title>
                <meta name="description" content="Hikari Game Personalization" />
                <link rel="icon" href="/images/logo.jpg" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </Head>

            <main className={styles.main}>
                <ConnectWallet />
            </main>
        </div>
    );
}
