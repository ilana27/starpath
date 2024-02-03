# backend flask server that takes has endpoints to query LLM & calculate user vector

from flask import Flask, request, g

import sys
import os
sys.path.append("./")

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from src import BERT_embedding_model as bert

app = Flask(__name__)

user_history = [] # a list of all the suggestions a user has clicked on 

user_history = ["read something intruiging", "play a video game to relax", "try a mindfulness meditation", "practice 4-7-8 breathing", "cook something that brings you joy"]

user_vector = 0

# initialize user history w/ Tim's wellness activities
user_history = ["read something relaxing", "cook something you enjoy", "play a video game with a friend", "practice 4-7-8 breathing", "try a mindfulness meditation"]

# to run locally & externally:
# flask run --host=0.0.0.0 --port=5001


""" Note: this will be used to:
    * pass in a suggestion when clicked on to add to the user vector
    * query the LLM to get a list of 10 suggestions
"""

@app.before_request
def before_request():
    pass

# Enable CORS for all routes
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/")
def homepage():
    return f"<p>Homepage: Backend Python Server of Journal Buddy!</p>"


""" params: takes in a suggestion (str) that was clicked on
    converts suggestion to a vector and updates the user_vector
    returns: a success message if the entry was successfully obtained
"""
@app.route("/savesuggestion") # note: I am not using this endpoint currently
def updateSuggestionHistory():
    suggestionClicked = request.args.get('suggestion')
    # /saveSuggestion?suggestion=go for a walk
    # defensive programming: only return success if the suggestion is valid
    user_history.append(suggestionClicked)
    response = {"result": "success", "suggestion added": suggestionClicked} 

    print(f"\nsuggestion clicked: '{suggestionClicked}' was added to user history which now contains: \n{user_history}\n")
    return response


""" params: takes in user entry (& possibly the user vector)
    calls LLM to genearte a list of 10 suggestions
    compares the difference between each of the 10 suggestions and the user vector
    returns the top 3 suggestions, based on the cosine similarity
"""
@app.route("/getsuggestions")
def generateSuggestionList():
    user_entry = request.args.get('entry')
    print(f"*** user entry is: {user_entry}")

    # TODO: change mock_user_history with real user history generated by suggestions clicked
    try:
        top_3_suggestions = bert.get_suggestions(user_history=user_history, user_entry=user_entry)
        print(f"\ntop 3 suggestions are \n{top_3_suggestions} \nfor user with history \n{user_history}\n")
        responseMap = {"result": "success", "suggestions": top_3_suggestions}
        return responseMap
    except:
        err_msg = "an error occured when generating personalized suggestions. most likely, the LLM returned malformatted suggestions that the app couldn't parse. Please retry generating suggestions"
        responseMap = {"result": "error", "err_msg": err_msg}
        return responseMap


    # user_vector = request.args.get('vector')
    # IPAddress/getSuggestionList?entry='mock user entry'



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)