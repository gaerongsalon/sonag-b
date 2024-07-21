export interface GetProfile {
  email: string;
  name: string;
  alias: string;
}

export async function getProfile(): Promise<GetProfile> {
  const profile = await ensureFetchResult<Partial<GetProfile>>(
    fetch(`/api/profile`, {
      method: "GET",
      credentials: "include",
    })
  );
  if (!profile.email || !profile.name) {
    throw new Error("Invalid profile");
  }
  return profile as GetProfile;
}

export async function login({ token }: { token: string }): Promise<void> {
  await fetch(`/api/login/google?token=${token}`, {
    method: "POST",
    credentials: "include",
  });
}

export async function logout(): Promise<void> {
  await fetch(`/api/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function updateAccountAlias({
  alias,
}: {
  alias: string;
}): Promise<void> {
  await fetch(`/api/account/alias`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ alias }),
  });
}

export interface BookResponse {
  seq: number;
  title: string;
  isbn: string;
}

export async function listBooks(): Promise<BookResponse[]> {
  return ensureFetchResult<BookResponse[]>(
    fetch(`/api/library`, {
      method: "GET",
      credentials: "include",
    })
  );
}

export async function addBook({
  title,
  isbn,
}: {
  title: string;
  isbn: string;
}): Promise<BookResponse> {
  return ensureFetchResult<BookResponse>(
    fetch(`/api/library`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, isbn }),
    })
  );
}

export type GetStagesResponse = {
  seq: number;
  name: string;
}[];

export async function getStages(): Promise<GetStagesResponse> {
  return ensureFetchResult<GetStagesResponse>(
    fetch(`/api/stage`, {
      method: "GET",
      credentials: "include",
    })
  );
}

export interface StageResponse {
  seq: number;
  name: string;
  data: string[];
}

export async function getStage({
  stageSeq,
}: {
  stageSeq: number;
}): Promise<StageResponse> {
  return ensureFetchResult<StageResponse>(
    fetch(`/api/stage/${stageSeq}`, {
      method: "GET",
      credentials: "include",
    })
  );
}

export async function addStage({
  name,
  data,
}: {
  name: string;
  data: string[];
}): Promise<StageResponse> {
  return ensureFetchResult<StageResponse>(
    fetch(`/api/stage`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, data }),
    })
  );
}

export type GetScoresResponse = {
  accountName: string;
  stageSeq: number;
  stageName: string;
  score: number;
}[];

export async function getScores(): Promise<GetScoresResponse> {
  return ensureFetchResult<GetScoresResponse>(
    fetch(`/api/score`, {
      method: "GET",
      credentials: "include",
    })
  );
}

export async function postStageScore({
  stageSeq,
  score,
}: {
  stageSeq: number;
  score: number;
}): Promise<void> {
  await fetch(`/api/stage/${stageSeq}/score`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ score }),
  });
}

export interface TitleByIsbnResponse {
  title: string;
}

export async function getTitleByIsbn({
  isbn,
}: {
  isbn: string;
}): Promise<TitleByIsbnResponse> {
  return ensureFetchResult<TitleByIsbnResponse>(
    fetch(`/api/title-by-isbn/${isbn}`, {
      method: "GET",
      credentials: "include",
    })
  );
}

async function ensureFetchResult<T>(
  responsePromise: Promise<Response>
): Promise<T> {
  let response: Response;
  try {
    response = await responsePromise;
  } catch (error) {
    console.error({ error }, "Failed to fetch");
    throw new Error("Failed to fetch");
  }
  return ensureResult<T>(response);
}

async function ensureResult<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let responseText = "Error from server";
    try {
      responseText = await response.text();
    } catch (error) {
      console.error({ error }, "Failed to read response text");
    }
    throw new Error(responseText);
  }

  try {
    const json = await response.json();
    if (json.ok) {
      return json.result as T;
    } else {
      throw new Error(json.error);
    }
  } catch (error) {
    console.error({ error }, "Failed to parse response");
    throw error;
  }
}
