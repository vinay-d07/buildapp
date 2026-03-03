import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getMessages, createMessage } from "../actions"


export const preFetch = async (queryclient, projectId) => {

    await queryclient.prefetchQuery({
        queryKey: ["messages", projectId],
        queryFn: () => getMessages(projectId),
        staleTime: 10000
    })
}

export const useGetMessgaes = (projId) => {
    return useQuery({
        queryKey: ["messages", projId],
        queryFn: () => getMessages(projId),
        staleTime: 10000,
        refetchInterval: (d) => {
            d?.length === 0 ? 5000 : false
        }
    })
}

export const useCreateMessage = (projectId) => {
    
    const queryclient = useQueryClient()
    return useMutation({
        mutationFn: (value) => createMessage(value, projectId),
        onSuccess: () => {
            queryclient.invalidateQueries({
                queryKey: ["messages", projectId]
            })
        }
    })
}