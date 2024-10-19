import torch
from transformers import BertTokenizer, BertForSequenceClassification

# Load the model and tokenizer
model_path = "C:\\Users\\USER\\Desktop\\hazard-reporting-system\\models\\hazard\\hazard_classification_model"
tokenizer_path = "C:\\Users\\USER\\Desktop\\hazard-reporting-system\\models\\hazard\\hazard_classification_tokenizer"

# Load the tokenizer and model
tokenizer = BertTokenizer.from_pretrained(tokenizer_path)
model = BertForSequenceClassification.from_pretrained(model_path)

# Move the model to the appropriate device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
model.eval()  # Set the model to evaluation mode

# Mapping of labels to hazard types
label_mapping = {
    0: "drainage",
    1: "garbage",
    2: "road damage"
}

def predict_hazard_type(description):
    # Encode the description
    inputs = tokenizer(description, return_tensors="pt", truncation=True, padding=True, max_length=512)
    inputs = {key: value.to(device) for key, value in inputs.items()}  # Move to GPU if available

    # Make the prediction
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_label = torch.argmax(logits, dim=1).item()  # Get the predicted label

    # Decode the predicted label
    return label_mapping[predicted_label]

# Example hazard descriptions
test_descriptions = [
    "there are lot of pothole due to rain, continuous construction and movement of heavy vehicles. the road is a danger for people who travel here",
    "Garbage is piling up on the side of the street.",
    "The drainage system is leaking and flooding the area.",
    "The road surface is cracked and uneven, posing a danger to drivers.",
    "Trash is overflowing from the garbage bins near the park."
]

# Make predictions for each example
for description in test_descriptions:
    predicted_hazard = predict_hazard_type(description)
    print(f"Description: '{description}' \nPredicted Hazard Type: {predicted_hazard}\n")
