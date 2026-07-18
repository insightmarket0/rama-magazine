import React from "react";
import { IntegrationFlowMap } from "@/components/ui/IntegrationFlowMap";

export default function Ecossistema() {
  return (
    <div className="flex flex-col h-[calc(100vh-48px)] bg-transparent w-full gap-4 font-sans overflow-hidden animate-in fade-in duration-700 p-8">
      <div className="shrink-0 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00] animate-pulse" />
          <span className="text-[#00FF00] text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">
            Monitoramento Global
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight leading-none">
          Radar da <span className="font-medium text-[#00FF00]">Equipe</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm max-w-2xl">
          Acompanhe o fluxo de tarefas, resoluções e o desempenho operacional dos membros chave do Seamless Studio em tempo real.
        </p>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <IntegrationFlowMap />
      </div>
    </div>
  );
}
