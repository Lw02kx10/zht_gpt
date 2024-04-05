import re
import os

from llama_index.prompts import ChatPromptTemplate, ChatMessage, MessageRole
from llama_index.node_parser import SentenceWindowNodeParser
from llama_index import SimpleDirectoryReader, VectorStoreIndex, StorageContext, load_index_from_storage
from llama_index.postprocessor import SentenceTransformerRerank
from llama_index.llms import OpenAI
from llama_index import ServiceContext, set_global_service_context
from typing import *

QA_PROMPT_TMPL_STR = (
    "请你仔细阅读相关内容，结合公司资料库进行回答，如果答案有很多条，你应该回答完每条之后换行，如果发现资料无法得到答案，就回答不知道\n"
    "搜索的相关公司资料如下所示：\n"
    "----------------------\n"
    "{context_str}\n"
    "问题：{query_str}\n"
    "答案："
)

QA_SYSTEM_PROMPT = ("你是中航通无人机创新公司的一个客服机器人，是一个严谨的公司资料信息问答智能体，"
                    "你会仔细阅读公司资料并给出准确的回答，你的回答都会非常准确")

REFINE_PROMPT_TMPL_STR = (
    "你是一个公司资料信息问答修正机器人，你严格按以下方式工作"
    "1.只有原答案为不知道时才进行修正,否则输出原答案的内容\n"
    "2.修正的时候为了体现你的精准和客观，你非常喜欢使用[]将公司资料的原文展示出来.\n"
    "3.如果感到疑惑的时候，就用原答案的内容回答。"
    "新的知识: {context_msg}\n"
    "问题: {query_str}\n"
    "原答案: {existing_answer}\n"
    "新答案: "
)


class RAGRobot:
    def __init__(self):
        self.sentence_splitter: Callable[[str], List[str]] = None
        self.node_parser = None
        self.index = None
        self.query_engine = None
        service_context = ServiceContext.from_defaults(
            llm=OpenAI(model="gpt-3.5-turbo", temperature=0.05, max_tokens=1024),
        )
        set_global_service_context(service_context)

    def _build_sentence_splitter(self, pattern: str) -> None:
        self.sentence_splitter = lambda text: re.findall(pattern, text)

    def _build_node_parser(self, size: int, metadata_key: str, original_text_metadata_key: str) -> None:
        self.node_parser = SentenceWindowNodeParser.from_defaults(
            sentence_splitter=self.sentence_splitter,
            window_size=size,
            window_metadata_key=metadata_key,
            original_text_metadata_key=original_text_metadata_key
        )

    def _build_index(self, dir_path: str, storage_path: str) -> bool:
        if os.path.isdir(dir_path):
            if os.path.exists(dir_path) is False:
                return False
            else:
                if os.path.exists(storage_path) is False:  # 未做持久化
                    documents = SimpleDirectoryReader(dir_path).load_data()
                    nodes = self.node_parser.get_nodes_from_documents(documents)
                    self.index = VectorStoreIndex(nodes)
                    self.index.storage_context.persist(persist_dir=storage_path)
                else:
                    storage_context = StorageContext.from_defaults(persist_dir=storage_path)  # 持久化操作
                    self.index = load_index_from_storage(storage_context)
        else:
            return False

    def _build_query_engine(self, top_k: int) -> None:
        if self.index is None:
            return None

        # 定义节点后处理器
        postprocessor = SentenceTransformerRerank(top_n=top_k)
        self.query_engine = self.index.as_query_engine(
            node_postprocessors=[postprocessor],
            similarity_top_k=top_k,
            streaming=True,
        )

        # 定义robot提示信息
        message_templates = [
            ChatMessage(content=QA_SYSTEM_PROMPT, role=MessageRole.SYSTEM),
            ChatMessage(content=QA_PROMPT_TMPL_STR, role=MessageRole.USER)
        ]

        chat_template = ChatPromptTemplate(message_templates=message_templates)
        self.query_engine.update_prompts(
            {"response_synthesizer:text_qa_template": chat_template}
        )
        self.query_engine._response_synthesizer._refine_template.conditionals[0][1].message_templates[
            0].content = REFINE_PROMPT_TMPL_STR

    def query(self, question: str) -> Generator[str, None, None]:  # 返回一个generator对象
        if question.endswith('?') or question.endswith('？'):
            question = question[:-1]
        res_stream = self.query_engine.query(question)
        return res_stream.response_gen

    def run(self):
        self._build_sentence_splitter("[^。；，;]+[。；，;]?")
        self._build_node_parser(3, "window", "original_text")
        self._build_index("./data", "./storage")
        self._build_query_engine(20)




