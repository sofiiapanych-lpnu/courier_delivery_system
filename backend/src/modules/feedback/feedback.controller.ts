import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
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
  getAllFeedback() {
    return this.feedbackService.getAllFeedback();
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
