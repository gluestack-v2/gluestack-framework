from gpt_index import SimpleDirectoryReader, GPTListIndex, GPTSimpleVectorIndex, LLMPredictor, PromptHelper
from langchain.chat_models import ChatOpenAI

def construct_index(directory_path):
	max_input_size = 4096
	num_outputs = 2047
	max_chunk_overlap = 10
	chunk_size_limit = 600

	prompt_helper = PromptHelper(max_input_size, num_outputs, max_chunk_overlap, chunk_size_limit=chunk_size_limit)

	llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=0.7, model_name="gpt-4", max_tokens=num_outputs))

	documents = SimpleDirectoryReader(directory_path).load_data()

	index = GPTSimpleVectorIndex(documents, llm_predictor=llm_predictor, prompt_helper=prompt_helper)

	index.save_to_disk('openai/index.json')

	return index

if __name__ == '__main__':
	index = construct_index("openai/docs")
