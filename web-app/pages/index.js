import Head from 'next/head';
import Image from 'next/image';
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
            </Head>

            <main className={styles.main}>

            </main>
        </div>
    );
}
