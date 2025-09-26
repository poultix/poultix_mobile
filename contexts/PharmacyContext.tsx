import { createContext, useContext } from "react";

interface PharmacyContextType {
    
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <PharmacyContext.Provider value={{}}>
            {children}
        </PharmacyContext.Provider>
    );
};

export const usePharmacy = () => {
    const context = useContext(PharmacyContext);
    if (!context) {
        throw new Error('usePharmacy must be used within a PharmacyProvider');
    }
    return context;
}
