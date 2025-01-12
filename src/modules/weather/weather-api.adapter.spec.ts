import { HttpException } from '@nestjs/common';
import { WeatherApiAdapter } from './weather-api.adapter';
import { HttpService } from '../../utilities/http/http.service'; // adjust the import path accordingly

describe('WeatherApiAdapter', () => {
  let weatherApiAdapter: WeatherApiAdapter;
  let mockHttpService: Partial<HttpService>;

  // Mock config object
  const mockConfig = {
    apiBaseUrl: 'https://fake-weather-api.com',
    apiKey: 'FAKE_API_KEY',
  };

  beforeEach(() => {
    // Mock the HttpService
    mockHttpService = {
      get: jest.fn(),
    };

    // Instantiate the adapter with the mocked HttpService & mock config
    weatherApiAdapter = new WeatherApiAdapter(
      mockHttpService as HttpService,
      mockConfig,
    );
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  // -------------------------------------------------------
  // fetchCurrentWeather
  // -------------------------------------------------------
  describe('fetchCurrentWeather', () => {
    it('should return data when the request is successful', async () => {
      // Arrange
      const mockResponseData = { location: 'TestCity', temperature: 20 };
      (mockHttpService.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponseData,
      });

      // Act
      const result = await weatherApiAdapter.fetchCurrentWeather('TestCity');

      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://fake-weather-api.com/current.json?key=FAKE_API_KEY&q=TestCity',
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an HttpException with error response if request fails with a known error', async () => {
      // Arrange
      const error = {
        response: {
          status: 404,
          data: {
            error: {
              message: 'City not found',
            },
          },
        },
      };
      (mockHttpService.get as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(
        weatherApiAdapter.fetchCurrentWeather('UnknownCity'),
      ).rejects.toThrow(HttpException);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://fake-weather-api.com/current.json?key=FAKE_API_KEY&q=UnknownCity',
      );

      await expect(
        weatherApiAdapter.fetchCurrentWeather('UnknownCity'),
      ).rejects.toMatchObject({
        response: {
          statusCode: 404,
          message: 'City not found',
        },
      });
    });

    it('should throw an HttpException with INTERNAL_SERVER_ERROR if request fails unexpectedly', async () => {
      // Arrange
      // Error without a .response property
      const unknownError = new Error('Network error');
      (mockHttpService.get as jest.Mock).mockRejectedValueOnce(unknownError);

      // Act & Assert
      await expect(
        weatherApiAdapter.fetchCurrentWeather('TestCity'),
      ).rejects.toThrowError(
        'An unexpected error occurred while fetching current weather data.',
      );
    });
  });

  // -------------------------------------------------------
  // fetchForecast
  // -------------------------------------------------------
  describe('fetchForecast', () => {
    it('should return data when the request is successful', async () => {
      // Arrange
      const mockResponseData = {
        location: 'TestCity',
        forecast: [{ day: '2021-01-01', temp: 25 }],
      };
      (mockHttpService.get as jest.Mock).mockResolvedValueOnce({
        data: mockResponseData,
      });

      // Act
      const result = await weatherApiAdapter.fetchForecast('TestCity', 3);

      // Assert
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://fake-weather-api.com/forecast.json?key=FAKE_API_KEY&q=TestCity&days=3',
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an HttpException with error response if request fails with a known error', async () => {
      // Arrange
      const error = {
        response: {
          status: 400,
          data: {
            error: {
              message: 'Invalid request',
            },
          },
        },
      };
      (mockHttpService.get as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(
        weatherApiAdapter.fetchForecast('TestCity', 3),
      ).rejects.toThrow(HttpException);
      await expect(
        weatherApiAdapter.fetchForecast('TestCity', 3),
      ).rejects.toMatchObject({
        response: {
          statusCode: 400,
          message: 'Invalid request',
        },
      });
    });

    it('should throw an HttpException with INTERNAL_SERVER_ERROR if request fails unexpectedly', async () => {
      // Arrange
      const unknownError = new Error('Some network issue');
      (mockHttpService.get as jest.Mock).mockRejectedValueOnce(unknownError);

      // Act & Assert
      await expect(
        weatherApiAdapter.fetchForecast('TestCity', 3),
      ).rejects.toThrowError(
        'An unexpected error occurred while fetching forecast data.',
      );
    });
  });
});
