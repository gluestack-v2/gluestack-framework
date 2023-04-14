# pip install -r requirements.txt

from gpt_index import GPTSimpleVectorIndex
import sys

def chatbot(input_text):
	index = GPTSimpleVectorIndex.load_from_disk('openai/index.json')
	response = index.query(input_text, response_mode="compact")
	return response.response

if __name__ == '__main__':
	if len(sys.argv) < 2:
		print("Please provide input text as a command line argument.")
		exit(1)
	else:
		input_text = sys.argv[1]
		response = chatbot(input_text)
		print('##START##', response, '##DONE##')
