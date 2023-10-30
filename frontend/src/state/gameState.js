import { create } from 'zustand';

const useStore = create((set) => ({
    currentUser: '',
    gameBoard: new Array(24).fill(0),
    setCurrentUser: (currentUser) => set({ currentUser: currentUser }),
    setGameBoard: (gameBoard) => set({ gameBoard: gameBoard })
}))

export default useStore;