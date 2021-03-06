from flask import *
from .rules.rules import get_topics_data_json, id2topic, get_topics_data_table
import re
import pandas

app = Flask(__name__)

app.logger.info('Started')


@app.route('/data')
def get_current_time():

    dates = request.args.get('dates')
    if dates == None:
        dates = []
    else:
        dates = re.split(";", dates)
        dates = [re.split(",", range) for range in dates]
        dates = [(start, end) for [start, end] in dates]

    missing_values = request.args.get('missing_values')
    if missing_values == None or missing_values == 'True':
        missing_values = True
    elif missing_values == 'False':
        missing_values = False

    if request.args.get('format') == "csv":
        data = get_topics_data_table(missing_values=True, dates=dates)
        csv = data.to_csv(encoding='utf-8')
        return Response(
            csv,
            mimetype="text/csv",
            headers={"Content-disposition":
                     "attachment; filename=topic_distribution.csv"})

    data = get_topics_data_json(missing_values=missing_values, dates=dates)
    return jsonify(data)


@app.route('/topics')
def get_topics():
    return jsonify(id2topic)
