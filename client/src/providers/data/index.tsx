import { GraphQLClient } from "@refinedev/nestjs-query";
import { customFetch, getGraphQLErrors } from "./fetch-wrapper";

export const API_URL = 'https://api.crm.refine.dev'

export const client = new GraphQLClient(API_URL,{
    fetch : (url : string, options : RequestInit) => {
        try{
            return fetchWrapper(url, options);
        }
        catch(error){
            return Promise.reject(error as Error)
        }
    }
})


const fetchWrapper = async (url: string, options : RequestInit) => {
    const response = await customFetch(url, options);
    
    const responseClone = response.clone();
    const body =  await responseClone.json();

    const error = getGraphQLErrors(body);

    if(error){
        throw error;
    }
    return response;
}