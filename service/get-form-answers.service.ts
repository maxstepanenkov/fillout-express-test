import axios from 'axios';
import { FilterClauseType } from '../types/filterClauseType';

const types = {
  ShortAnswer: 'string',
  DatePicker: 'ISODate',
  NumberInput: 'number',
  MultipleChoice: 'string',
  EmailInput: 'string'
}

async function filterFunc(queryParams: Partial<FilterClauseType>[], data: any): Promise<any> {
  const conditionsToFunction: any = {
    equals: (type: string, inputValue: string, conditionValue: string): boolean => {
      return inputValue === conditionValue;
    },
    does_not_equal: (type: string, inputValue: string, conditionValue: string): boolean => {
      return inputValue !== conditionValue;
    },
    greater_than: (type: string, inputValue: string, conditionValue: string): boolean => {
      if (type === types.DatePicker) {
        return new Date(inputValue) > new Date(conditionValue);
      }
      if (type === types.NumberInput) {
        return inputValue > conditionValue;
      }
      return false
    },
    less_than: (type: string, inputValue: string, conditionValue: string): boolean => {
      if (type === types.DatePicker) {
        return new Date(inputValue) < new Date(conditionValue);
      }
      if (type === types.NumberInput) {
        return inputValue < conditionValue;
      }
      return false;
    }
  };

  const { responses } = data;
  const { questions } = responses[0];
  const result = [];
  const questionsById: any = {};

  for (const question of questions) {
    const { id } = question;
    questionsById[id] = question;
  }

  for (const inputCriteria of queryParams) {
    const { id, condition, value: inputValue }: any | undefined = inputCriteria;
    if (!questionsById[id]) {
      continue;
    }
    if (!conditionsToFunction[condition]) {
      continue;
    }
    const { value: questionValue, type } = questionsById[id];

    if (!conditionsToFunction[condition](type, inputValue, questionValue)) {
      continue;
    }

    result.push(questionsById[id]);
  }
  return result;
}

async function getFormsAnswers(formId: string, queryParams: FilterClauseType[]): Promise<any> {
  try {
    const { data, status } = await axios.get<Response>(
      `${process.env.FILLOUT_URL!}/${formId}/submissions`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.FILLOUT_API_KEY}`
        }
      }
    );
    return filterFunc(queryParams, data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log('error message: ', err.message);
      return err.message
    } else {
      console.log('unexpected error: ', err);
      return 'An  unexpected error occured';
    }
  }
}

export default getFormsAnswers;