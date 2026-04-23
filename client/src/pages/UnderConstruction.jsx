import React from 'react';
import { Construction } from 'lucide-react';

const UnderConstruction = ({ title }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="bg-secondary p-8 rounded-full mb-6 animate-pulse">
            <Construction size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-textos italic">Sección: {title}</h2>
        <p className="text-gray-500 mt-2">
            Estamos trabajando en esta parte de Kuxtal. ¡Vuelve pronto!
        </p>
    </div>
);

export default UnderConstruction;
