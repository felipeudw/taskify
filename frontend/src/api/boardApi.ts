import {api} from "./api";

export interface Board {
    id: string;
    name: string;
}

export const getBoards = async (): Promise<Board[]> => {
    const res = await api.get("/boards");
    return res.data;
};
