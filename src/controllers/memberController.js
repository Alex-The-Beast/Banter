import { StatusCodes } from 'http-status-codes';
import {
  internalErrorResponse,
  customErrorResponse
} from '../utils/common/responseObject.js';
import { isMemberPartOfWorkspaceService}  from '../services/memberService.js';

export const isMemberPartOfWorkspaceController = async (req, res) => {
  try {
    const response = await isMemberPartOfWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'User is the member of workspace.'));
  } catch (error) {
    console.log('Member controller error', error);

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
