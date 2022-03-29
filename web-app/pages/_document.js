import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="description" content="Hikari Game Personalization" />
                <link rel="icon" href="/images/logo.jpg" />
                {/* <link rel="stylesheet" href="/MyFontsWebfontsKit.css" /> */}
                {/* <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                /> */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
