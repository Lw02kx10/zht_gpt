import os.path

from llama_index import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)

PERSIST_DIR = './storage'

if not os.path.exists(PERSIST_DIR):
    documents = SimpleDirectoryReader("data").load_data()  # 读取文档数据加载到内存中
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=PERSIST_DIR)
else:
    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)


query_engine = index.as_query_engine()
response = query_engine.query("本公司的产品类别有哪几种？")
print("response:", response)