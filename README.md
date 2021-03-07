# Law's Topics' distribution
## Agenda
This project was built as part of Digital Humanities course at the BGU University with the assistance of the Ministry of Justice, to help investigate and identify topics distribution in laws over different periods in time.

## Project Overview
The project was made with unsupervised machine learning algorithm (LDA - Latend Dirichlet Algorithm) which excels in distributing a corpus to topics and determine the amount of contribution each topic has for a specific document in the corpus. 
This, however, was not the obvious choice since the laws are already been classified in the 'National Legislative Database' (מאגר החקיקה הלאומי) and I could have used the calssification suggested there. 
But, letting an ML algorithm to classify on its own can potentially suggests insightful results that couldn't have been accepted otherwise.
(i.e, classification that put all laws about 'religion' along with 'criminal justice' laws, might suggest that are some overlapping with how the government handle these manners, etc).

The project was assembled of 3 main steps:
1. **Pre-Processing:** Parsing the ```akn``` dataset, lemmatizing and tagging (using YAP) each word in each sentence. Then, combining a huge list to be used as corpus for phase 2, the Topic Modeling.
2. **Topic Modeling:** Cleaning the corpus by pin-pointing the stopwords, trying various of options for words' grouping, choosing the optimal model and assigning a topic title for each group of words.
3. **Visuazlie Data:** Running the web application that shows the topics ditribution for a custom periods in time.

## Project Structure
```
./
├── Step_2-Topic_Modeling
│   ├── Topic Modeling(LDA).ipynb
│   ├── output
│   │   ├── dominant_topic_df.csv
│   │   ├── optimal_lda_model.pk
│   │   ├── topic_distribution_df.csv
│   │   └── topics_divisions.csv
│   └── resources
│       ├── id2topic.txt
│       ├── laws_corpus_lemmatized.json
│       ├── laws_index.json
│       ├── laws_words_count.csv
│       └── stopwords.txt
├── Step_3-Visualize_Data
│   ├── api
│   │   ├── api.py
│   │   └── rules
│   │       └── rules.py
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── components
│   │   │   ├── NivoBarChart.js
│   │   │   ├── Sidebar.css
│   │   │   └── Sidebar.js
│   │   ├── index.css
│   │   └── index.js
│   └── yarn.lock
└── requirements.txt

9 directories, 25 files
```

## Installation
1. Install python requirements: 
```sh
pip install -r requirements.txt
```
2. Install the Web-App dependencies: navigate to ```Step_3-Visualize_Data``` directory, and run 
```sh
yarn install
```

### How-To Guide
1. **Pre-Processing:** This is already made for you. The pre-processed dataset is called ```laws_corpus_lemmatized.json```
2. **Topic Modeling:** The ```Topic Modeling(LDA).ipynb notebook``` contains a very detailed instruction on how to perform the topic modeling, run the notebook and go through each step thoroughly (For further explanations you can check the README for part 2).
3. **Visuazlie Data:** For visualizing the data, navigate to ```Step_3-Visualize_Data``` and run the following commands, each in its own terminal and by this order:
```sh
yarn start-api
```
```sh
yarn start
```
