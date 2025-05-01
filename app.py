from flask import Flask, jsonify, request, render_template
# from dotenv import load_dotenv
# import mysql.connector
# import os
# from swagger.swaggerui import setup_swagger
# import random
# import string
import requests

app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')

# Set up Swagger
# setup_swagger(app)


# @app.route('/', methods=['GET'])
# def index():
#     return jsonify({"message": "Welcome to the appfinity API"})

@app.route('/read', methods=['GET'])
def read():
    name = request.args.get('name')
    if not name:
        return jsonify({"error": "Missing 'name' parameter"}), 400

    data = {
        "name": name,
        "section": "A",
        "status": "IN"
    }

    response = requests.post(
        "http://152.42.247.62:9000/log_karen_attendance",
        json=data,
        headers={"Content-Type": "application/json"}
    )

    return jsonify({
        "sent_data": data,
        "external_response": response.text,
        "status_code": response.status_code
    })
    
@app.route('/', methods=['GET'])
def index():
    # Render the HTML template
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
