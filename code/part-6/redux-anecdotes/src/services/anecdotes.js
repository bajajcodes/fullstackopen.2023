import axios from "axios"

const BASE_URL = "http://localhost:3001/anecdotes"

const getAll = async () => {
    return await axios.get(BASE_URL).data;
}

const createNew = async (content) => {
    const object = {content, "votes": 0};
    return (await axios.post(BASE_URL, object)).data;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {getAll, createNew}