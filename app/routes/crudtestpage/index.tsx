import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getDb, ObjectId } from "~/db/server";

export async function loader() {
  const db = await getDb();
  const notes = await db.collection("notes").find().toArray();
  return {
    notes: notes.map((n) => ({ _id: n._id.toString(), title: n.title })),
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const db = await getDb();
  const form = await request.formData();
  const intent = form.get("intent");
  const id = form.get("id")?.toString();
  const title = form.get("title")?.toString();

  if (intent === "create" && title) {
    await db.collection("notes").insertOne({ title });
  } else if (intent === "update" && id && title) {
    await db
      .collection("notes")
      .updateOne({ _id: new ObjectId(id) }, { $set: { title } });
  } else if (intent === "delete" && id) {
    await db.collection("notes").deleteOne({ _id: new ObjectId(id) });
  }

  return redirect("/crudtestpage");
}

export default function Index() {
  const { notes } = useLoaderData<typeof loader>();
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      setEditId(null);
    }
  }, [navigation.state]);

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">CRUD test page</h1>

      {/* Create */}
      <Form method="post" className="space-x-2">
        <input type="hidden" name="intent" value="create" />
        <input
          name="title"
          type="text"
          className="border px-3 py-1"
          placeholder="Add new note"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </Form>

      {/* Notes */}
      <ul className="space-y-2">
        {notes.map((note) => (
          <li
            key={note._id}
            className="border p-3 rounded flex justify-between items-center"
          >
            {editId === note._id ? (
              <Form method="post" className="flex gap-2 items-center w-full">
                <input type="hidden" name="intent" value="update" />
                <input type="hidden" name="id" value={note._id} />
                <input
                  name="title"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border px-2 py-1 flex-1"
                />
                <button type="submit" className="text-sm text-green-600">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditId(null)}
                  className="text-sm text-gray-500"
                >
                  Cancel
                </button>
              </Form>
            ) : (
              <>
                <span>{note.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditId(note._id);
                      setEditText(note.title);
                    }}
                    className="text-sm text-blue-600"
                  >
                    Edit
                  </button>
                  <Form method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="id" value={note._id} />
                    <button className="text-sm text-red-600" type="submit">
                      Delete
                    </button>
                  </Form>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
