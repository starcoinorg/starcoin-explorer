import axios from 'axios';

const apiUrl = process.env.REACT_APP_SEED_API_URL;
const baseURL = `${apiUrl}`;
const clientConfig = {
  baseURL,
  timeout: 120000, // 2 minutes, xhr status will be 'canceled'
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    accept: 'application/json',
  },
};

const successHandler = (result: any) => {
  const response = result.data;
  if (response.code !== undefined) {
    if (response.code >= 200 && response.code < 300) {
      return response.data;
    }
    const reject = {
      code: response.code || 400,
      message: response.message || 'unknown errors',
    };
    return Promise.reject(reject);
  }
  return response;
};

const errorHandler = (error: any) => {
  const { response } = error;
  let reject;
  if (response) {
    reject = {
      code: response.data.code,
      message: response.data.message,
    };
  } else if (error.request) {
    reject = {
      code: 400,
      message: error.message || 'unknown errors',
    };
  } else {
    reject = {
      message: 'unknown errors',
    };
  }

  return Promise.reject(reject);
};

class Client {
  instance: any;

  constructor(config?: any) {
    if (!this.instance) {
      this.instance = axios.create({
        ...clientConfig,
        ...config,
      });
      this.instance.interceptors.response.use(successHandler, errorHandler);
    }
  }

  async call(method: string, params?: any[], option = {}) {
    const defaultOption = {
      url: '/',
      data: {
        id: 1,
        jsonrpc: '2.0',
        method,
        params,
      },
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    const { result } = await this.request(defaultOption, option);
    return result;
  }

  request(defaultOption?: any, option?: any) {
    return this.instance.request({ ...defaultOption, ...option });
  }
}

const client = new Client();

export default client;
