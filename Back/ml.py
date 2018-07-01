from flask import Flask, Response
from threading import Thread
import requests
import urllib
import cv2
import numpy as np
import time
from time import sleep
import subprocess

url_face='http://10.1.138.145:8080/photo.jpg'

app = Flask(__name__)

stop_run = False


def my_function():
    global stop_run
    while not stop_run:
        sleep(1)
        urllib.urlretrieve(url_face,"./checking/x.jpeg")
        print ("Picture Captured")
        p = subprocess.Popen(["face_recognition", "./db", "./checking"], stdout=subprocess.PIPE)
        output = p.communicate()[0]
        if not output:
           print "Face not detected!"
        else:
            name = output.rsplit(',', 1)[1]
            name = name.replace(" ", "")
	    name = name.replace("\n", "");
            print name
            q = subprocess.Popen(["node", "mug.js"], stdout=subprocess.PIPE)
            mug_value = q.communicate()[0]
            mug_value = mug_value.replace("\n", "");
            print mug_value
            if mug_value == "1":
                 time.sleep(0.01)
                 event = "http://10.1.138.147:6660/found/" + name + "/1"
                 time.sleep(0.01) 
                 r = requests.get(event)
                 print r.status_code
            else:
                 print "Mug not detected!"
        print("Done!")
        #stop_run = True


t = Thread(target=my_function)
t.start()


@app.route("/stop", methods=['GET'])
def set_stop_run():
    global stop_run
    stop_run = True
    return "Application stopped"



if __name__ == "__main__":
    app.run("127.0.0.1",5000)
