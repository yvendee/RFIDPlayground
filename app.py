from flask import Flask, jsonify, request, render_template
# from dotenv import load_dotenv
# import mysql.connector
# import os
# from swagger.swaggerui import setup_swagger
# import random
# import string


app = Flask(__name__, template_folder='templates', static_folder='static', static_url_path='/static')

# Set up Swagger
# setup_swagger(app)


# @app.route('/', methods=['GET'])
# def index():
#     return jsonify({"message": "Welcome to the appfinity API"})

@app.route('/', methods=['GET'])
def index():
    # Render the HTML template
    return render_template("index.html")


if __name__ == '__main__':
    app.run(debug=True)
