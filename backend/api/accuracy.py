import matplotlib
matplotlib.use('Agg')  # Use a non-interactive backend for matplotlib
                        # Prevent GUI issues in Django

import pickle
import numpy as np
import cv2
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.svm import SVC
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

def evaluate_model():
    with open('data/faces_data.pkl', 'rb') as f:
        faces_data = pickle.load(f)

    with open('data/names.pkl', 'rb') as f:
        names = pickle.load(f)

    label_encoder = LabelEncoder()
    labels = label_encoder.fit_transform(names)

    X_train, X_test, y_train, y_test = train_test_split(faces_data, labels, test_size=0.2, random_state=42)

    clf = SVC(kernel='linear', probability=True)
    clf.fit(X_train, y_train)
    # # Predict on the test set
    # y_pred = clf.predict(X_test)

    # Predictions and metrics
    y_pred = clf.predict(X_test)
    conf_matrix = confusion_matrix(y_test, y_pred)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, target_names=label_encoder.classes_)

    
    conf_matrix_normalized = conf_matrix.astype('float') / conf_matrix.sum(axis=1)[:, np.newaxis]
    # class_report = classification_report(y_test, y_pred, target_names=label_encoder.classes_, output_dict=True)

    # Plot confusion matrices
    fig, axes = plt.subplots(1, 2, figsize=(20, 8))

    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues', xticklabels=label_encoder.classes_, yticklabels=label_encoder.classes_, ax=axes[0])
    axes[0].set_title('Confusion Matrix')
    axes[0].set_xlabel('Predicted')
    axes[0].set_ylabel('True')

    sns.heatmap(conf_matrix_normalized, annot=True, fmt='.2f', cmap='Blues', xticklabels=label_encoder.classes_, yticklabels=label_encoder.classes_, ax=axes[1])
    axes[1].set_title('Normalized Confusion Matrix')
    axes[1].set_xlabel('Predicted')
    axes[1].set_ylabel('True')

    plt.tight_layout()

    # Convert plot to base64 string
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    image_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    return {
        "accuracy": round(accuracy, 4),
        "report": report,
        "confusion_matrix_image": image_base64,
    }
