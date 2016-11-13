from flask import Flask, render_template, request
app = Flask(__name__)

import stockApp.api
