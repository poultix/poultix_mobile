import { createContext, useContext } from "react";

interface FarmContextType {
    

}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <FarmContext.Provider value={{}}>
            {children}
        </FarmContext.Provider>
    );
};

export const useFarm = () => {
    const context = useContext(FarmContext);
    if (!context) {
        throw new Error('useFarm must be used within a FarmProvider');
    }
    return context;
}