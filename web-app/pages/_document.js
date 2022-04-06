import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="description" content="Hikari Game Personalization" />
                <meta name="viewport" content="initial-scale=1.0 , minimum-scale=1.0 , maximum-scale=1.0, user-scalable=0" />

                <link rel="icon" href="/images/logo.jpg" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
