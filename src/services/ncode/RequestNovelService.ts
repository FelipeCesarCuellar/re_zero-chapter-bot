import axios, { AxiosResponse } from "axios";
import NcodeRequestData from "../../interfaces/NcodeRequestData";

class RequestNovelService {
  private ncodeApi = axios.create({
    baseURL: "https://api.syosetu.com/novelapi/api",
  });
   getDataByNcode = async (
    ncode: string = "n2267be"
  ): Promise<null | NcodeRequestData> => {
    const response: AxiosResponse = await this.ncodeApi.get(
      `/output?out=json&ncode=${ncode}`
    );
    const novelData: NcodeRequestData = response.data[1];
    console.log(novelData);
    if (!novelData) return null;
    return novelData;
  };
}

export default RequestNovelService;
