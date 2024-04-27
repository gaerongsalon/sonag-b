import { Connection, createConnection } from "mysql2/promise";

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export default async function useQuery<R>(
  work: (connection: Connection) => Promise<R>
): Promise<R> {
  const connection = await createConnection(config);
  try {
    const result = await work(connection);
    return result;
  } finally {
    await connection.end();
  }
}

export async function useQueryFetch<T>(
  query: string,
  args: unknown[]
): Promise<T[]> {
  const [result] = await useQuery((connection) =>
    connection.query(query, args)
  );
  return (result ?? []) as T[];
}
