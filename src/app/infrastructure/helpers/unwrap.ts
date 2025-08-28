import { ApiResponse } from "@app/domain/models";

function isApiResponse<T>(x: unknown): x is ApiResponse<T> {
  return !!x
    && typeof x === 'object'
    && 'status' in (x as object)
    && 'message' in (x as object)
    && 'data' in (x as object);
}

export function unwrap<T>(res: ApiResponse<T> | T): T {
  return isApiResponse<T>(res) ? (res as ApiResponse<T>).data : (res as T);
}
