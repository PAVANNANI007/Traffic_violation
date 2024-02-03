from __future__ import division, print_function
# coding=utf-8
import os
import numpy as np
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'    # Suppress TensorFlow logging (1)
import pathlib
import tensorflow as tf
import cv2

from PIL import Image
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings('ignore')   # Suppress Matplotlib warnings


import time
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils


tf.get_logger().setLevel('ERROR')           # Suppress TensorFlow logging (2)

# Enable GPU dynamic memory allocation
gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)
# Flask utils
from flask import Flask, jsonify, redirect, request, render_template
from werkzeug.utils import secure_filename

# Define a flask app
app = Flask(__name__)

# Model saved with Keras model.save()
MODEL_PATH = "saved_model"
PATH_TO_LABELS = 'label_map.pbtxt'

print('Loading model...', end='')
start_time = time.time()

# Load your trained model
model = tf.saved_model.load(MODEL_PATH)
detect_fn = model.signatures['serving_default']

end_time = time.time()
elapsed_time = end_time - start_time
print('Done! Took {} seconds'.format(elapsed_time))
category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS,
                                                                    use_display_name=True)
#model._make_predict_function()          # Necessary
print('Model loaded. Check http://127.0.0.1:5000/')

def load_image_into_numpy_array(path):
    
    return np.array(Image.open(path))



def model_predict(image_path, model):
    image_np = load_image_into_numpy_array(image_path)
    out = cv2.imread(image_path)
    input_tensor = tf.convert_to_tensor(image_np)
    input_tensor = input_tensor[tf.newaxis, ...]

    
    detections = detect_fn(input_tensor)

    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
              for key, value in detections.items()}
    detections['num_detections'] = num_detections

    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

    image_np_with_detections = out.copy()

    viz_utils.visualize_boxes_and_labels_on_image_array(
          image_np_with_detections,
          detections['detection_boxes'],
          detections['detection_classes'],
          detections['detection_scores'],
          category_index,
          use_normalized_coordinates=True,
          max_boxes_to_draw=200,
          min_score_thresh=.30,
          agnostic_mode=False)
    no_violation = False
    violation_2=0
    violation_3=0
    classes = detections['detection_classes']
    scores = detections['detection_scores']

    for i in range(len(classes)):
    
        if(classes[i]==2 and scores[i]>=0.3):
            violation_2+=1
        elif(classes[i]==3 and scores[i]>=0.3):
            violation_3+=1

    if(violation_2==0 and violation_3==0):
        no_violation = True

    return [image_np_with_detections,no_violation,violation_2,violation_3]

@app.route('/', methods=['GET'])
def index():
    # Main page
    return render_template('user.html')

@app.route('/login', methods=['POST'])
def login():
    # Perform login logic here
    # Assuming the login is successful, redirect to user.html with login_success=true

    return redirect('/?login_success=true')

@app.route('/main.html', methods=['GET'])
def main():
    # Render the main.html template where image upload can be done
    return render_template('main.html')

@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)
        
        res,nv,n1,n2 = model_predict(file_path, model)
        print("hi")
        cv2.imwrite('static/img.jpg',res)
        result = {
            'path' : 'static/img.jpg',
            'nv': nv,
            'n1': n1,
            'n2': n2
        }
        return jsonify(result)
    return None



if __name__ == '__main__':
    app.run(debug=True)