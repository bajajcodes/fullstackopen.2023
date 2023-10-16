import { useState } from "react";

export default function useFields(fields){
    const [values, setValues] = useState(() => fields.reduce(( acc, field) =>  ({...acc, [field.name]: ""}), {}));

    function onChange(event){
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        setValues(prevValues => ({...prevValues, [name]: value}));
    }

    function reset(){
        const resetValuesObject = {};
        const keys = Object.keys(values);
        keys.forEach(key => {
            resetValuesObject[key] = "";
        });
        setValues(resetValuesObject);
    }

    return {
        fields,
        values,
        onChange,
        reset
    }
}