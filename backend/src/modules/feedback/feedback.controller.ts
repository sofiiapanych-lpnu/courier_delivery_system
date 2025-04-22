import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) { }

  @Post()
  createFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(createFeedbackDto);
  }

  @Get()
  getAllFeedback(
    @Query('clientName') clientName?: string,
    @Query('courierName') courierName?: string,
    @Query('rating') rating?: string,
    @Query('comment') comment?: string,
    @Query('hasComment') hasComment?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query = {
      clientId: clientName,
      courierName: courierName,
      rating: rating ? parseInt(rating, 10) : undefined,
      comment,
      hasComment,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    }
    return this.feedbackService.getAllFeedback(query);
  }

  @Get(':id')
  getFeedbackById(@Param('id') id: string) {
    return this.feedbackService.getFeedbackById(+id);
  }

  @Put(':id')
  updateFeedback(@Param('id') id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    return this.feedbackService.updateFeedback(+id, updateFeedbackDto);
  }

  @Delete(':id')
  deleteFeedback(@Param('id') id: string) {
    return this.feedbackService.deleteFeedback(+id);
  }
}
