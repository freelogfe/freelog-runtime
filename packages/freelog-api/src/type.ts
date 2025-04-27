
import { AxiosProgressEvent, ResponseType, responseEncoding } from "axios";

export interface AxiosConfig {
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  maxContentLength?: number;
  maxBodyLength?: number;
  timeout?: number;
}
