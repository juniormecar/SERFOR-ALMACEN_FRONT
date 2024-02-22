export interface ResponseModel<T> {
    data: T;
    message?: string | undefined;
    stackTrace?: string | null;
    success?: boolean | null;
    isSuccess?: boolean | null;
    codigo?: string | null;
    informacion?: string | null;
    innerException?: string | null;
    messageExeption?: string | null;
    totalRecord?: number | null;
    totalrecord?: number | null;
    validateBusiness?: boolean | null;
    totalRecords?: number | null;
  }
  