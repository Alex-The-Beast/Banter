import { StatusCodes } from 'http-status-codes';

import { getChannelByIdService } from '../services/channelServices.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';

export const getChannelByIdController = async (req, res) => {
  try {
    const response = await getChannelByIdService(
      req.params.channelId,req.user
     
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Channel Fetched Successfully'));
  } catch (error) {
    console.log('get channel by id Controller Error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
