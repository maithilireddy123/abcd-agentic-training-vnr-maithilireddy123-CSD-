from flask import Flask, render_template, request
from model import predict_crop_yield

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    result = None
    if request.method == "POST":
        rainfall = float(request.form["rainfall"])
        temperature = float(request.form["temperature"])
        soil_quality = float(request.form["soil_quality"])
        result = predict_crop_yield(rainfall, temperature, soil_quality)
    return render_template("index.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)
