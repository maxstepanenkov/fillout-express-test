import { NextFunction, Request, RequestHandler, Response } from "express";
import getFormsAnswers from "../service/get-form-answers.service";
import { FilterClauseType } from "../types/filterClauseType";

export const getAnswers: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { filters } = req.query;
  const { formId } = req.params;
  const parsedQuery = JSON.parse(filters as string);
  const response = await getFormsAnswers(formId, parsedQuery as FilterClauseType[]);
  res.send(response).status(200);
}