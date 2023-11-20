import { useEffect, useState, useRef, useCallback } from "react";
import React from "react";

import styles from "./recognition.module.css";
import Webcam from "react-webcam";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import recognitionService from "../../services/recognition.service";
import Image from "next/image";
import { useRouter } from "next/router";

export default function recognition() {
    const router = useRouter();

    const webcamRef = useRef(null);

    const videoConstraints = {
        facingMode: "user"
    };

    const [clickCaputure, setClickCaputure] = useState(false);
    const [imageSrcState, setImageSrcState] = useState(false);

    const [loading, setLoading] = useState(false);

    const [statusAuth, setStatusAuth] = useState(false);

    const [infoUser, setInfoUser] = useState("");

    // État pour déterminer si la webcam est chargée
    const [isWebcamLoaded, setIsWebcamLoaded] = useState(false);

    const capture = useCallback(async () => {
        setClickCaputure(true);
        setLoading(true);
        const imageSrc = webcamRef.current.getScreenshot();
        setImageSrcState(webcamRef.current.getScreenshot());
        try {
            const recognition = new recognitionService();

            const response = await recognition.sendImage({ url: imageSrc });
            if (response.ok) {
                setLoading(false);
                const res = await response.json();
                console.log(res);

                // Vérifier le succès côté serveur
                if (res.infoUser) {
                    setStatusAuth(true);
                    //setClickCaputure(false);
                    setInfoUser(res.infoUser);
                    setTimeout(() => {
                        goToRoute("/home");
                    }, 3000);
                } else {
                    setClickCaputure(false);
                    setLoading(false);
                }
            } else {
                setClickCaputure(false);
                setLoading(false);
            }
        } catch (error) {
            setClickCaputure(false);
            setLoading(false);

            console.error(
                "Une erreur s'est produite lors de la requête :",
                error
            );
        }
    }, [webcamRef]);

    const goToRoute = (url) => {
        router.push(url);
    };

    useEffect(() => {
        if (webcamRef) {
            setTimeout(() => {
                setIsWebcamLoaded(true);
            }, 2000);
        }
    }, [webcamRef]);

    return (
        <>
            {!clickCaputure ? (
                <div className={styles.block}>
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={videoConstraints}
                        style={{
                            width: "100vw"
                        }}
                    ></Webcam>
                </div>
            ) : (
                <div className={styles.block}>
                    <Image
                        src={imageSrcState}
                        layout="fill"
                        objectFit="cover"
                        style={{
                            width: "100%"
                        }}
                    />
                </div>
            )}

            {isWebcamLoaded && !statusAuth && (
                <div className={styles.iconBottomBar}>
                    <div
                        className={`${styles.circleIcon} ${
                            clickCaputure && styles.disabledCapture
                        }`}
                        onClick={capture}
                    >
                        <FontAwesomeIcon icon={faCamera} />
                    </div>
                </div>
            )}

            {loading && (
                <div className={styles.overlay}>
                    <Image src="/images/loading.svg" width={100} height={100} />
                </div>
            )}

            {statusAuth && (
                <div className={styles.status}>
                    <div style={{ width: "80%" }}>
                        <h2>Informations</h2>
                        <table className={styles.infoTable}>
                            <tbody>
                                {infoUser.map((info, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td className={styles.infoLabel}>
                                                Nom:
                                            </td>
                                            <td className={styles.infoValue}>
                                                {info.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.infoLabel}>
                                                Matricule:
                                            </td>
                                            <td className={styles.infoValue}>
                                                {info.code}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.infoLabel}>
                                                Niveau:
                                            </td>
                                            <td className={styles.infoValue}>
                                                {info.level}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={styles.infoLabel}>
                                                Accès:
                                            </td>
                                            <td className={styles.infoValue}>
                                                {info.access}
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
