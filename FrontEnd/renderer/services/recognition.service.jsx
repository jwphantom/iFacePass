import { GlobalConstants } from "../common/global-constants";
export default class recognitionService {
    async sendImage(url) {
        return await fetch(`${GlobalConstants.apiURL}/recognition/get-Image`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(url)
        });
    }
}
