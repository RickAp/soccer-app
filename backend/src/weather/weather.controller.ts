import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from './weather.service';

@ApiTags('weather')
@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current weather for a city' })
  @ApiQuery({ name: 'city', required: true })
  async getCurrent(@Query('city') city: string) {
    return this.weatherService.getCurrentWeather(city);
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Get weather forecast for a city and date' })
  @ApiQuery({ name: 'city', required: true })
  @ApiQuery({ name: 'date', required: true })
  async getForecast(@Query('city') city: string, @Query('date') date: string) {
    return this.weatherService.getForecast(city, date);
  }
}

