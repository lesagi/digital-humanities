# Instructions on Topic Modeling
## Importing libraries
```python
import pathlib
import os
import codecs
import csv
import json
import requests
from collections import Counter
from datetime import datetime
from bidi import algorithm as bidialg
import numpy as np
import pandas as pd
import re
import pickle

# Gensim
import gensim
from gensim import corpora
from gensim.models import CoherenceModel

# Plotting tools
import matplotlib.pyplot as plt
%matplotlib inline
```
## Setting the paths for the project
We use 2 main folders: ```resources```, ```output```. The ```resources``` folder is where we put all the resources we need to make the program running. The ```output``` folder is where we save all the output of the running script. 
```python
# path of the project folder
base_path = pathlib.Path().absolute()

# Setting the path to the Output folder
output_path = os.path.join(base_path, "output")
if not os.path.exists(output_path):
	os.makedirs(output_path)
	
# Setting the path to the Resources folder
resources_path = os.path.join(base_path, "resources")
if not os.path.exists(resources_path):
	os.makedirs(resources_path)
	
# Defining getter
def  get_resource_file_path(filename):
	return os.path.join(resources_path,"{}".format(filename))
	
def  get_output_file_path(filename):
	return os.path.join(output_path,"{}".format(filename))
	
def  get_file_content(file_path):
	with  open(file_path, mode="r", encoding="utf-8") as infile:
	return json.load(infile)
``` 
## Load the necessary files
From this point on, for each file or directory, we will define the path to the file, and then read it, using the getters defined before.
```python
# lemmatized_corpus is the the pre-processed corpus
lemmatized_corpus_path = get_resource_file_path("laws_corpus_lemmatized.json")
lemmatized_corpus = get_file_content(lemmatized_corpus_path)

# laws_index represents the files' order constructed by the iteration of python over the 'akn' folder
laws_index_path = get_resource_file_path("laws_index.json")
laws_index = get_file_content(laws_index_path)
``` 
  ## Cleaning the corpus
You need to construct your list of stopwords. To make it easier for you, I have already created a file that contains all the words in the corpus and the number of times each one appears in it. The file called ```laws_words_count.csv``` and it is located under the ```resources``` folder

Make sure to put your list in a file called ```stopwords.txt``` under the ```resources``` folder.

When you are done, load the stopwords to memory. This will later be used to clean the corpus for the Topic Modeling.
```python
# Set the path to the stopwords text file
stopwords_path = get_resource_file_path("stopwords.txt")

# Loading stopwords to memory
stopwords = get_stopwords(stopwords_path)

# getting all laws and clean them for LDA
clean_corpus = get_cleaned_corpus(lemmatized_corpus)
```
## Preparing for running the model
```python
# Create Dictionary
id2word = corpora.Dictionary(clean_corpus)

# Create Corpus
texts = clean_corpus

# Term Document Frequency
corpus = [id2word.doc2bow(text) for text in texts]
```
Since we are using ```Mallet``` as wrapper for ```gensim```, we need to load it to memory

```python
# Setting up the folder path and adding as env variable
mallet_dir_path = get_resource_file_path("mallet-2.0.8")

os.environ['MALLET_HOME'] = mallet_dir_path

# Setting up the path to the mallet folder
mallet_path = os.path.join(mallet_dir_path,"bin","mallet") # 
```
## Choosing the Optimal Model
We will run the model for various options, and then we will choose the configuration that optimized the Topic Modeling proccess
```python
# start - minimum number of topics to test the model on
# limit- maximum number of topics to test the model on
# step- testing all number between [start,limit) with difference of 'step' from one to another
start=24; limit=26; step=2;

# Running the model for this range
model_list, coherence_values = compute_coherence_values(dictionary=id2word,corpus=corpus, texts=lemmatized_corpus, start=start, limit=limit, step=step)

# Showing the results for choosing the optimal model
x = range(start, limit, step)
plt.plot(x, coherence_values)
plt.xlabel("Num Topics")
plt.ylabel("Coherence score")
plt.legend(("coherence_values"), loc='best')
plt.show()

# Print the coherence scores
for m, cv in  zip(x, coherence_values):
	print("Num Topics =", m, " has Coherence Value of", round(cv, 4))
```
Then you will have to choose the optimal model for you by referring to it's position in the array of all tested models.
Set the numebr of topics that corresponds to the chosen model
```python
# Choose and Reference the optimal model in a variable
# Replace 0 with the right index
optimal_model = model_list[0] 

# Replace both values with the correspond values to the chosen model
num_topics=24; num_words=40;
```
## Identifying the Topics
We will extract all of the words clusters to an external ```topics_divisions.csv``` file, so we will be able to identify the topic for each cluster.

```python
# getting the topics list as strings
model_topics = optimal_model.print_topics(num_topics=num_topics, num_words=num_words)

# extracting the words list for each topic
topics_list = __get_words_per_topic(model_topics)

# path for the desired output
topics_division_path = get_output_file_path("topics_divisions.csv")

# Export topics words to CSV file
export_topics_to_csv(topics_division_path, topics_list, num_words)
```
## Assignning a title for Identified Topic
After you identified the title for each words' cluster, you'll construct a file (sort of a dictionary) to associate a cluster with a title. Write your result to the ```id2topic.txt``` file in the ```resources``` folder.
>**Important**: please check the current 'id2topic.txt' file to see an example of the desired output. You should write your own file according to this example as well. 
```python
# Constructing the path
id2topic_path = get_resource_file_path('id2topic.txt')

# Load the associated topic for each index from external file
id2topic_file = open(id2topic_path, 'r', encoding='utf-8')
id2topic_lines = id2topic_file.readlines()
id2topic_file.close()
id2topic = {}

for line in id2topic_lines:
	split = re.split("\t",line.strip())
	if  len(split) == 2:
		[topic, topic_id] = split
		id2topic[int(topic_id)-1] = topic.strip()
```
## Finding the Dominant Topic for each document in the Corpus
You can check the dominant topic of each document and review and verify your topic identification.
>```include_topic_title``` is for showing the title-topic you set in previous steps. 
> ```include_relative_path``` is for showing the path of each document in the ```akn``` folder.
```python
dominant_topic_df = get_dominant_topic_df(optimal_model, corpus, texts,include_topic_title=True, include_relative_path = True)
dominant_topic_df
```
  ## Generate Topic Distribution
  If you are satisfied with your topic's identification, you can now check the topics' distribution over time.
```python
# Generating DataFrame of topic distribution over 'dominant_topic_df'
topic_distribution_df = get_topic_distribution(dominant_topic_df)
topic_distribution_df

# Getting the topic distribution to a subset of times
# pass a list of tuples of ranges [(start_date,end_date)
get_topics_distribution_by_dates(dominant_topic_df, [('2012-01-01','2013-01-01')])
```
You can save both tables to external ```.csv``` file for checking the results in a more convinient environment:
```python
# Saving the dominant_topic_df table to CSV if needed
dominant_topic_df.to_csv(get_output_file_path('dominant_topic_df.csv'), encoding='utf-8')

# Saving the topic_distribution table to CSV if needed
dominant_topic_df.to_csv(get_output_file_path('topic_distribution_df.csv'), encoding='utf-8')
```
 # Converters Interface
 You can convert your results to DataFrame, JSON, ot matplotlib chart
```python
# Data Table
get_topics_data_table(dominant_topic_df=filtered_dominant_topic_df, missing_topics=True, dates=[])

# JSON
get_topics_data_json(dominant_topic_df=filtered_dominant_topic_df, missing_topics=True, dates=[])

# matplotlib Chart
topics_distribution_chart = get_topics_distribution_chart(topic_distribution_df, ordered = False, missing_topics=True)
```