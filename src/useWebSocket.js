import { useState, useEffect } from 'react';

const useWebSocket = (url) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => console.log("WebSocket conectado");

        ws.onmessage = (event) => {
            try {
                const jsonData = JSON.parse(event.data);
                setData(jsonData);
            } catch (error) {
                console.error("Erro ao processar mensagem:", error);
            }
        };

        ws.onerror = (error) => console.error("Erro no WebSocket:", error);
        ws.onclose = () => console.log("WebSocket desconectado");

        return () => {
            ws.close();
        };
    }, [url]);

    console.log("data: ", data)
    return data;
};

export default useWebSocket;
