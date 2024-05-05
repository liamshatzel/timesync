import sqlite3
from flask import Flask, g, current_app, jsonify, request, make_response
from flask_cors import CORS, cross_origin
import click
from flask.cli import with_appcontext

app = Flask(__name__)
DATABASE = './storage.db'
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'


### DATABASE FUNCTIONS ###
@app.route("/num-visitors")
def num_visitors():
    db = get_db()
    cur_visitors = db.execute('SELECT num_visit FROM counter')
    num_visitors = cur_visitors.fetchone()[0] + 1
    db.execute('UPDATE counter SET num_visit = ?', (num_visitors,))
    db.commit()

    return _create_response("num_visitors: " + str(num_visitors)) 

@app.route("/update-time", methods=["POST"])
#add total time to database
def add_total_time():
    db = get_db()
    data = request.get_json()
    user_time = int(data['time'])

    cur_total_time = db.execute('SELECT tot_time FROM counter')

    tot_time = cur_total_time.fetchone()[0] + user_time
    db.execute('UPDATE counter SET tot_time = ?', (tot_time,))

    max_time = db.execute('SELECT max_time FROM counter')
    if(user_time > max_time.fetchone()[0]):
        db.execute('UPDATE counter SET max_time = ?', (user_time,))
    #print(max_time.fetchone()[0])
    db.commit()
    return _create_response("total_time: " + str(tot_time))

@app.route("/max-time")
def get_max_time():
    db = get_db()
    cur_max_time = db.execute('SELECT max_time FROM counter')
    max_time = cur_max_time.fetchone()[0]
    return _create_response("max_time: " + str(max_time))

def _create_response(data):
    response = make_response(jsonify(data))
    return response

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

def init_db():
    db = get_db()

    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    
@click.command('init-db')
@with_appcontext
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')

app.cli.add_command(init_db_command)

@app.route('/get')
def index():
    cur = get_db().cursor()