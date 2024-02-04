import torch
from transformers import BertTokenizer, BertModel
from scipy.spatial.distance import cosine

# OPTIONAL: if you want to have more information on what's happening, activate the logger as follows
# import logging
#logging.basicConfig(level=logging.INFO)

# import matplotlib.pyplot as plt
# % matplotlib inline

# Load pre-trained model tokenizer (vocabulary)
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')

# Load pre-trained model (weights)
model = BertModel.from_pretrained('bert-base-uncased',
                                    output_hidden_states = True, # Whether the model returns all hidden-states.
                                    )

# Put the model in "evaluation" mode, meaning feed-forward operation.
model.eval()

# text = "Here is the sentence I want embeddings for."
# marked_text = "[CLS] " + text + " [SEP]"

# # Tokenize our sentence with the BERT tokenizer.
# tokenized_text = tokenizer.tokenize(marked_text)

# # Print out the tokens.
# print (tokenized_text)

def get_embedding(text: str):
    # Add the special tokens.
    marked_text = "[CLS] " + text + " [SEP]"

    # Split the sentence into tokens.
    tokenized_text = tokenizer.tokenize(marked_text)

    # Map the token strings to their vocabulary indeces.
    indexed_tokens = tokenizer.convert_tokens_to_ids(tokenized_text)

    # Mark each of the 22 tokens as belonging to sentence "1".
    segments_ids = [1] * len(tokenized_text)

    # Convert inputs to PyTorch tensors
    tokens_tensor = torch.tensor([indexed_tokens])
    segments_tensors = torch.tensor([segments_ids])

    # Run the text through BERT, and collect all of the hidden states produced
    # from all 12 layers.
    with torch.no_grad():

        outputs = model(tokens_tensor, segments_tensors)

        # Evaluating the model will return a different number of objects based on
        # how it's  configured in the `from_pretrained` call earlier. In this case,
        # becase we set `output_hidden_states = True`, the third item will be the
        # hidden states from all layers. See the documentation for more details:
        # https://huggingface.co/transformers/model_doc/bert.html#bertmodel
        hidden_states = outputs[2]

        # Concatenate the tensors for all layers. We use `stack` here to
        # create a new dimension in the tensor.
        token_embeddings = torch.stack(hidden_states, dim=0)

        token_embeddings.size()

        # Remove dimension 1, the "batches".
        token_embeddings = torch.squeeze(token_embeddings, dim=1)

        token_embeddings.size()

        # Swap dimensions 0 and 1.
        token_embeddings = token_embeddings.permute(1,0,2)

        token_embeddings.size()

        # Stores the token vectors, with shape [22 x 768]
        token_vecs_sum = []

        # `token_embeddings` is a [22 x 12 x 768] tensor.

        # For each token in the sentence...
        for token in token_embeddings:

            # `token` is a [12 x 768] tensor

            # Sum the vectors from the last four layers.
            sum_vec = torch.sum(token[-4:], dim=0)

            # Use `sum_vec` to represent `token`.
            token_vecs_sum.append(sum_vec)

        # print ('Shape is: %d x %d' % (len(token_vecs_sum), len(token_vecs_sum[0])))

        # `hidden_states` has shape [13 x 1 x 22 x 768]

        # `token_vecs` is a tensor with shape [22 x 768]
        token_vecs = hidden_states[-2][0]

        # Calculate the average of all 22 token vectors.
        sentence_embedding = torch.mean(token_vecs, dim=0)

        # print ("Our final sentence embedding vector of shape:", sentence_embedding.size())

        # for i, token_str in enumerate(tokenized_text):
        #     print (i, token_str)

        # print("sentence: " + text)
        # print("whole sentence vector value: " + str(sentence_embedding))
        return sentence_embedding

def calculate_similarity_between_suggestions(text1: str, text2: str):
    text1_embedding = get_embedding(text1)
    text2_embedding = get_embedding(text2)
    vector_similarity = 1 - cosine(text1_embedding, text2_embedding)
    print(f'Vector similarity for \"{text1}\" and \"{text2}\":  %.2f' % vector_similarity)

def calculate_similarity_between_user_and_suggestion(user_embedding, suggestion: str):
    text_embedding = get_embedding(suggestion)
    vector_similarity = 1 - cosine(user_embedding, text_embedding)
    print(f'Vector similarity for user embedding and \"{suggestion}\":  %.2f' % vector_similarity)

def get_user_embedding1(text_list: [str]):
    new_text = ""
    for text in text_list:
        new_text += text + " "
    print(new_text)
    user_embedding = get_embedding(new_text)
    print("user tensor1: " + str(user_embedding))
    return user_embedding

def get_user_embedding2(text_list: [str]):
    tensor_list = []
    
    for text in text_list:
        embedding = get_embedding(text)
        tensor_list.append(embedding)
    
    user_tensor = torch.stack(tensor_list, dim=0)
    user_embedding = torch.mean(user_tensor, dim=0)
    return user_embedding



# get_embedding("Go outside for a walk.")
# calculate_similarity("Go for a walk.", "Take a run outside.")
history = ["Go for a walk.", "Take a run outside.", "Spend time in nature."]
user = get_user_embedding1(history)
calculate_similarity_between_user_and_suggestion(user, "Call a friend.")
calculate_similarity_between_user_and_suggestion(user, "Take a walk.")

user = get_user_embedding2(history)
calculate_similarity_between_user_and_suggestion(user, "Call a friend.")
calculate_similarity_between_user_and_suggestion(user, "Take a walk.")