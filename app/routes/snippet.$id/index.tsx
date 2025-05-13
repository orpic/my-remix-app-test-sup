import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
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

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const code = body.get("code")?.toString();
  if (!code) {
    throw new Response("Code not provided", { status: 400 });
  }
  console.log("Code:", code);

  const evalResult = eval(`${code}`);
  console.log("Eval Result:", evalResult);

  return evalResult;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <div className="flex flex-col items-center h-screen">
      <div className="mt-4">
        <Button variant="link" className="ml-auto mr-4">
          <a href="/">Back to Snippets</a>
        </Button>
        <Form method="post" id="snippet-form" className="flex flex-col">
          <p>This is the snippet page with ID: {data.id}</p>
          <h1 className="text-xl">{data.name}</h1>
          <pre className="border border-gray-300 rounded-md p-4 bg-gray-100 text-gray-800 mt-4">
            {data.code}
          </pre>
          <input
            type="text"
            name="code"
            value={data.code}
            id="code"
            className="hidden"
          />
          <Button className="mt-4" variant="outline">
            Execute Code
          </Button>
        </Form>

        {/*  */}
        <data className="mt-4">
          <h2 className="text-lg">Eval Result:</h2>
          <pre className="border border-gray-300 rounded-md p-4 bg-gray-100 text-gray-800 mt-4">
            {actionData}
          </pre>
        </data>
      </div>
    </div>
  );
}
