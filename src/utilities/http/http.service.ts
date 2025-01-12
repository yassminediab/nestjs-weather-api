import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
@Injectable()
export class HttpService {
  constructor() {}
  async get(url) {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      if (error) {
        console.error('Error response:', error);
        throw error;
      } else if (error) {
        throw new HttpException(
          {
            success: false,
            code: 500,
            message: 'Weather Service Unavailable',
            version: 1,
            data: null,
          },
          500,
        );
      } else {
        // console.error('Error:', error);
        throw new HttpException(
          {
            success: false,
            code: 500,
            message: 'Internal Server Error',
            version: 1,
            data: null,
          },
          500,
        );
      }
    }
  }
}
