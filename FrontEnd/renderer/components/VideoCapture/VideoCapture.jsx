import React, { useState } from "react";
import Webcam from "react-webcam";
import styles from "./VideoCapture.module.css";

const VideoCapture = ({ src }) => {
    const [photo, setPhoto] = useState(null);

    return (
        <>
            <Webcam />
        </>
    );
};

export default VideoCapture;
