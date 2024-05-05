import sqlite3
from flask import Flask, g, current_app
import click
from flask.cli import with_appcontext

app = Flask(__name__)
DATABASE = './storage.db'


### DATABASE FUNCTIONS ###
@app.route("/num-visitors")
def num_visitors():
    db = get_db()
    cur_visitors = db.execute('SELECT num_visit FROM counter')
    num_visitors = cur_visitors.fetchone()[0] + 1
    db.execute('UPDATE counter SET num_visit = ?', (num_visitors,))
    db.commit()

    return str(num_visitors)


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