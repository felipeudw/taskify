import {create} from "zustand";

interface BoardState {
    boards: string[];
    addBoard: (name: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    boards: [],
    addBoard: (name) =>
        set((state) => ({
            boards: [...state.boards, name],
        })),
}));
