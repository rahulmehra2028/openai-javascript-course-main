import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { PineconeClient } from '@pinecone-database/pinecone';
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { CharacterTextSplitter } from "langchain/text_splitter";

// Example: https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/pdf
export default async function handler(req, res) {
  if (req.method === "GET") {
    console.log("Inside the PDF handler");
    // Enter your code here
    /** STEP ONE: LOAD DOCUMENT */

    const bookPath = "C:\Users\rahul\OneDrive\Desktop\openai-javascript-course-main\data\document_loaders\naval-ravikant-book.pdf";

    const loader = new PDFLoader(bookPath);

    const docs = await loader.load()

    console.log(docs);

    if (docs.length === 0) {
      console.log('No Docs found');
      return;
    }

    // Chunk Size

    const splitter = new CharacterTextSplitter({
      separator: " ",
      chunkSize: 250,
      chunkOverlap: 10,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    // Reduce the size of the metadata

    const reducedDocs = splitDocs.map((doc) => {
      const reducedMetadata = { ...doc.metadata };
      delete reducedMetadata.pdf;
      return new Document ({
        pageContent: doc.pageContent,
        metadata: reducedMetadata,
      });
    });

    console.log(reducedDocs[0]);
    console.log(splitDocs.length);

    /** STEP TWO: UPLOAD TO DATABASE */

    const pinecone = new PineconeClient();

    await pinecone.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });

    // langchain-js
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    // upload documents to Pinecone

    await PineconeStore.fromDocuments(reducedDocs , new OpenAIEmbeddings() , {
      pineconeIndex,
    });

    console.log("Sucessfully Uploaded To Database")

    return res.status(200).json({ result: docs });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
