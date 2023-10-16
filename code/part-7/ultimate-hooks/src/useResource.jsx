import { useState } from "react"
import axios from "axios";

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])
  
    const getAll = async () => {
        const response = await axios(baseUrl);
        setResources(response.data);
    }
  
    const create = async (resource) => {
        const config = {
            headers: {Authorization: token}
        }
        const response = await create(baseUrl, resource, config);
        setResources(response.data);
    }

    const update = async (id, newObject) => {
        const response = await axios.put(`${ baseUrl }/${id}`, newObject)
        setResources(response.data);
      }
  
    const service = {
      getAll, create, update, setToken
    }
  
    return [
      resources, service
    ]
  }

export default useResource;