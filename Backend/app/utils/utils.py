import re
import cv2
import os
import shutil
import random
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf


from keras.models import Model
from keras.layers import Layer, Conv2D, Dense, MaxPooling2D, Input, Flatten

from PIL import Image


def preprocess(file_path):
    byte_img = tf.io.read_file(file_path)

    img = tf.io.decode_jpeg(byte_img)

    img = tf.image.resize(img, (105, 105))

    img = img / 255.0

    return img


class L1Dist(Layer):
    def __init__(self, **kwargs):
        super().__init__()

    def call(self, input_embedding, validation_embedding):
        return tf.math.abs(input_embedding - validation_embedding)


def getModel(url):
    iface_pass_model = tf.keras.models.load_model(
        url,
        custom_objects={
            "L1Dist": L1Dist,
            "BinaryCrossentropy": tf.losses.BinaryCrossentropy,
        },
    )
    return iface_pass_model


def verify(model, detection_threshold, verification_threshold):
    # Build results array
    results = []
    for image in os.listdir(os.path.join("application_data", "verification_images")):
        input_img = preprocess(
            os.path.join("application_data", "input_image", "input_image.jpg")
        )
        validation_img = preprocess(
            os.path.join("application_data", "verification_images", image)
        )

        # Make Predictions
        result = model.predict(
            list(np.expand_dims([input_img, validation_img], axis=1))
        )
        results.append(result)

    # Detection Threshold: Metric above which a prediciton is considered positive
    detection = np.sum(np.array(results) > detection_threshold)

    # Verification Threshold: Proportion of positive predictions / total positive samples
    verification = detection / len(
        os.listdir(os.path.join("application_data", "verification_images"))
    )
    verified = verification > verification_threshold

    return results, verified


def recognition():
    results, verified = verify(getModel("iface_passv2.h5"), 0.9, 0.7)
    print(verified)
