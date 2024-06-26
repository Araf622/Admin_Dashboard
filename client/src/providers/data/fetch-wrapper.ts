import { GraphQLFormattedError } from 'graphql';

type Error = {
    message : string;
    statusCode : string;
}

export const customFetch = async (url: string, options : RequestInit) => {
    const accessToken = localStorage.getItem('access_token');

    const headers =  options.headers as Record<string, string>;
    
    return await fetch(url, {
        ...options,
        headers: {
           ...headers,
            Authorization: headers?.Authorization ||`Bearer ${accessToken}`,
            "Content-Type" : "application/json",
            "Appollo-Require-Preflight" : "true"
        }
    })
}

export const getGraphQLErrors = (body : Record<"errors", GraphQLFormattedError[]>) : Error | null =>{
    if(!body){
        return{
            message : "Unknown error",
            statusCode : "INTERNAL_SERVER_ERROR"
        }
    } 

    if("errors" in body){
       const errors = body?.errors;
       const messages = errors.map(err => err.message)?.join("");

       return{
           message : messages,
           statusCode : "INTERNAL_SERVER_ERROR"
       }
    }
    return null;
}

export const fetchWrapper = async (url: string, options : RequestInit) => {
    const response = await customFetch(url, options);
    
    const responseClone = response.clone();
    const body =  await responseClone.json();

    const error = getGraphQLErrors(body);

    if(error){
        throw error;
    }
    return response;
}