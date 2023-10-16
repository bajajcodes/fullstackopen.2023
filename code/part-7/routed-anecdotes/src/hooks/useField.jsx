import { useState } from "react";

export default function useField(type = "text"){
    const [value, setValue] = useState("");
    
    function onChange(event){
        event.preventDefault();
        setValue(event.target.value);
    }

    function reset(){
        setValue('');
    }

    return {
        type, value, onChange, reset
    }
}