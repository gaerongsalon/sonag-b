type OkResponse<T> = { ok: true; result: T } | { ok: false; error: string };

export default OkResponse;
