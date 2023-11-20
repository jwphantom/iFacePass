import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "./home.module.css";
import { useRouter } from "next/router";

export default function HomePage() {
    const router = useRouter();

    const [message, setMessage] = React.useState("No message found");

    React.useEffect(() => {
        window.ipc.on("message", (message) => {
            setMessage(message);
        });
    }, []);

    const routeTo = (route) => {
        router.push(route);
    };

    return (
        <React.Fragment>
            <Head>
                <title>Auth Mode</title>
            </Head>
            <div className={styles.authModeContainer}>
                <div className={styles.content}>
                    {/* Logo */}
                    <Image
                        src="/images/logo-w.png"
                        width={150}
                        height={200}
                        alt=""
                    />
                    {/* Boutons */}
                    <div className={styles.buttonsContainer}>
                        <Link href="/facial/recognition">
                            <button className={styles.faceIDButton}>
                                <Image
                                    src="/images/face.png"
                                    width={20}
                                    height={20}
                                    alt=""
                                    className={styles.ButtonIcon}
                                />
                                <span>&nbsp;Continue with FaceID</span>
                            </button>
                        </Link>

                        <button className={styles.keyButton}>
                            <Image
                                src="/images/key-chain.png"
                                width={20}
                                height={20}
                                alt=""
                                className={styles.ButtonIcon}
                            />
                            <span>&nbsp;Continue with Identifier</span>
                        </button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
