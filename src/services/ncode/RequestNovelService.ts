import axios, { AxiosResponse } from "axios";
import config from "../../config";
import NcodeRequestData from "../../interfaces/NcodeRequestData";


// Ncode de Re:Zero: n2267be
class RequestNovelService {
  private ncodeApi = axios.create({
    baseURL: "https://api.syosetu.com/novelapi/api",
  });
  getDataByNcode = async (): Promise<null | NcodeRequestData> => {
    const ncode = config.NCODE;
    const response: AxiosResponse = await this.ncodeApi.get(
      `/output?out=json&ncode=${ncode}`
    );
    const novelData: NcodeRequestData = response.data[1];
    if (!novelData) return null;
    return novelData;
  };
}

export default RequestNovelService;
