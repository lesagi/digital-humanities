#!/usr/bin/env python
# coding: utf-8

import warnings
import pandas as pd
import pathlib
import os
import re
import json

# Enable logging for gensim - optional
import logging
logging.basicConfig(
    format='%(asctime)s : %(levelname)s : %(message)s', level=logging.ERROR)

warnings.filterwarnings("ignore", category=DeprecationWarning)

####### SETTING PATHS ########
base_path = pathlib.Path().absolute()

resources_path = os.path.join(
    str(base_path.parent.parent), "Step_2-Topic_Modeling", "resources")

output_path = os.path.join(str(base_path.parent.parent),
                           "Step_2-Topic_Modeling", "output")

topic_distribution_path = os.path.join(output_path, "dominant_topic_df.csv")

id2topic_file_path = os.path.join(resources_path, "id2topic.txt")

#### LOADING FILES ########
# topic distribution for all corpus
dominant_topic_df = pd.read_csv(topic_distribution_path, encoding='utf-8')
# Load the associated topic for each index from external file
id2topic_file = open(id2topic_file_path, 'r', encoding='utf-8')
id2topic_lines = id2topic_file.readlines()
id2topic_file.close()
id2topic = {}
# Strips the newline character
# adjusting indeices to start count from 0
for line in id2topic_lines:
    split = re.split("\t", line.strip())
    if len(split) == 2:
        [topic, topic_id] = split
        id2topic[int(topic_id)-1] = topic.strip()


def get_topic_distribution(df):
    # Number of Documents for Each Topic
    topic_counts = df['Dominant_Topic'].value_counts()

    # Percentage of Documents for Each Topic
    topic_contribution = round(topic_counts/topic_counts.sum(), 4)

    topic_distibution = pd.concat([topic_counts, topic_contribution], axis=1)
    topic_distibution = topic_distibution.reset_index()
    topic_distibution.columns = ['Topic_ID', 'Num_Documents', 'Perc_Documents']

    # Add the topic name to the DF
    topic_distibution['Topic'] = topic_distibution.apply(
        lambda row: id2topic[row['Topic_ID']], axis=1)
    return topic_distibution


def filter_dates(df, dates):
    filter_col = df['date'] == dates[0]
    for date_range in dates:
        start, end = date_range
        filter_col = filter_col | (start <= df['date']) & (df['date'] <= end)
    return df[filter_col]


# adding all topics to the data frame
# so they will be represented in the bar chart
def add_missing_topics(df):
    existed_topic_ids = set(df['Topic_ID'].tolist())
    for topic_id in id2topic.keys():
        if topic_id not in existed_topic_ids:
            df = df.append({'Topic_ID': topic_id, 'Num_Documents': 0, 'Perc_Documents': 0,
                            'Topic': u'{}'.format(id2topic[topic_id])}, ignore_index=True)
    return df


def get_topics_distribution_by_dates(dominant_topic_df, dates=[]):
    dominant_topic_date_filtered = dominant_topic_df
    if len(dates) != 0:
        # leave only specific dates from the whole table (without aggregation)
        dominant_topic_date_filtered = filter_dates(dominant_topic_df, dates)

    # aggregate all laws by their topic
    return get_topic_distribution(dominant_topic_date_filtered)


def get_topics_data_table(dominant_topic_df=dominant_topic_df, missing_values=True, dates=[]):

    topics_distribution = get_topics_distribution_by_dates(
        dominant_topic_df, dates)

    if missing_values:
        topics_distribution = add_missing_topics(topics_distribution)

    return topics_distribution


def get_topics_data_json(missing_values=True, dates=[]):
    res = []
    aggregated_dominant_topic_df = get_topics_data_table(
        dominant_topic_df, missing_values=missing_values, dates=dates)
    json_df = aggregated_dominant_topic_df.to_json(
        orient='index', force_ascii=False)
    json_df = json.loads(json_df)
    for key in json_df:
        res.append(json_df[key])
    return res
