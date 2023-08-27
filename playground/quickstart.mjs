import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { exec } from "child_process";
import { config } from "dotenv";

// export OPENAI_API_KEY=<>
// export SERPAPI_API_KEY=<>
// Replace with your API keys!

// to run, go to terminal and enter: cd playground
// then enter: node quickstart.mjs
console.log("Welcome to the LangChain Quickstart Module!");

// Prompt template

const template = ' You are a director of a social media with 30 years of experience. Please give me some ideas for content i should write about regarding {topic}? The content is for {socialplatform}. Translate to {language}.'
const prompt = new PromptTemplate({
    template: template,
    inputVariables: ["topic" , "socialplatform" , "language"],
});

// const formattedPromptTemplate = await prompt.format({
//     topic: "artificial intelligence",
//     socialplatform: "twitter",
//     language: "english",
// })

// console.log({formattedPromptTemplate});

// LLM Chain

const model = new OpenAI({ temperature: 0.9 });
const chain = new LLMChain({ prompt: prompt ,  llm: model  });

// const resChain = await chain.call({
//     topic: "artificial intelligence",
//     socialplatform: "twitter",
//     language: "english",
// });

// console.log({ resChain });

const agentModel = new OpenAI({
    temperature: 0 ,
    modelName: "text-davinci-003" ,
});

const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY , {
        location: "Dallas , Texas",
        hl: "en",
        gl: "us",
    }),
    new Calculator(),
]

// const executor = await initializeAgentExecutorWithOptions(tools , agentModel , {
//     agentType: "zero-shot-react-description" , 
//     verbose: true,
//     maxIterations: 5,
// });

const input = "what is Langchain?";

// const result = await executor.call({ input });

console.log({ result }) ;

const chatModel = new ChatOpenAI({
    temperature: 0 , 
    modelName: "gpt-3.5-turbo",
    verbose: true,
});

const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
    llm: chatModel , 
    tools: tools,
});

const result = await executor.call({
    input: "who is the president of united state currently ? what is his current age?"
});

console.log ({ result });