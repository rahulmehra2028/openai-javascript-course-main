"use client"
import React ,{useState} from 'react'
import PageHeader from 'app/components/PageHeader'
import PromptBox from 'app/components/PromptBox'
import Title from 'app/components/Title'
import TwoColumnLayout from 'app/components/TwoColumnLayout'
import ResultWithSources from 'app/components/ResultWithSources'
import "app/globals.css"


const Memory = () => {
    const [prompt , setPrompt] = useState("")
    const [error , setError] = useState(null)
    const [messages , setMessages] = useState([
        {
            text: "Hi There! ",
            type: "bot"
        }
    ])

    const [firstMsg , setFirstMsg] = useState(true)

    const handlePromptChange = (e) => {
        setPrompt(e.target.value)
    }

    const handleSubmitPrompt = async () => {
        console.log('sending' , prompt);
        try{
            
            setMessages((prevMessages)=>[
                ...prevMessages,
                {text: prompt , type: "user" , sourceDocument: null }
            ])

            const response = await fetch("/api/memory" , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ input: prompt , firstMsg })
            })

            if (!response.ok){
                throw new Error(`HTTP Error! Status: ${response.status} `)
            }


            setPrompt("")

            setFirstMsg(false)
            const searchRes = await response.json()

            setMessages((prevMessages)=>[
                ...prevMessages,
                {text: searchRes.output.response , type: "bot" , sourceDocument: null }
            ])
            console.log({searchRes})


            

            setError("")

        }catch(err) {
            console.error(err)
            setError(err)
        }
    }

  return (
    <>

        <Title
            headingText={"Memory"}
            emoji="🧠"
        />
        <TwoColumnLayout

            leftChildren={<>
            
                <PageHeader

                    heading="I Remember Everything"
                    boldText="Let's See if it can remember your name and favourite food. This tool will let you ask anything contained in a PDF document. "
                    description="This tool uses Buffer Memory and Conversation Chain. Head over to Module X to get started"

                />

            </>}

            rightChildren={<>

                <ResultWithSources messages={messages} pngFile="brain"/>
                <PromptBox
                
                    prompt={prompt}
                    handleSubmit={handleSubmitPrompt}
                    // placeHolderText={""}
                    error={error}
                    // pngFile=""
                    handlePromptChange={handlePromptChange}

                />
            
            </>}

        />
    </>
  )
}

export default Memory