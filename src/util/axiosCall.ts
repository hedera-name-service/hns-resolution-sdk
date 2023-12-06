import axios from "axios";

export const sendAxiosGetRequest = async (url: string, header?: Record<string, string>) => {
    return await axios.get(url, { headers: { ...header } });
};
