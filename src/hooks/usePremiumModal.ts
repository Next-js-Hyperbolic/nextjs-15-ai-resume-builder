import {create} from 'zustand';

interface PremiumModalState {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}

const usePremiumModal = create<PremiumModalState>((set) => ({
    isOpen: false,
    setOpen: () => set((state) => ({isOpen: !state.isOpen})),
}))

export default usePremiumModal;