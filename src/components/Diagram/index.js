import React, { useEffect } from 'react'
import mermaid from 'mermaid'

const Diagram = ({chart}) => {

    mermaid.mermaidAPI.initialize({startOnLoad:true})

    useEffect(() => {
        try {
            mermaid.contentLoaded()
        }catch(e) {
            console.log(e)
        }
        
    },[])

    return(
       <div className="mermaid">
           {chart}
        </div>
    )


}

export default Diagram