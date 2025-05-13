import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDb, ObjectId } from "~/db/server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  console.log("ID:", id);
  const db = await getDb();
  const collection = db.collection("snippets");
  const snippet = await collection.findOne({ _id: new ObjectId(id) });
  if (!snippet) {
    throw new Response("Snippet not found", { status: 404 });
  }
  return snippet;
}
export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <p>This is the snippet page with ID: {data.id}</p>
      <h1>{data.name}</h1>
      <pre>{data.code}</pre>
    </div>
  );
}
