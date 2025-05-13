import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import TextareaAutosize from "react-textarea-autosize";
import { getDb } from "~/db/server";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const name = body.get("name");
  const code = body.get("code");

  const db = await getDb();
  const collection = db.collection("snippets");
  const result = await collection.insertOne({
    name,
    code,
  });
  console.log("Inserted ID:", result.insertedId);
  return redirect("/");
}

export async function loader() {
  const db = await getDb();
  const collection = db.collection("snippets");
  const snippets = await collection.find().toArray();
  const data = snippets.map((snippet) => ({
    id: snippet._id.toString(),
    name: snippet.name,
    code: snippet.code,
  }));
  return { data };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (navigation.state === "submitting") {
      setIsDialogOpen(false);
    }
  }, [navigation.state]);

  return (
    <div className="text-2xl underline flex flex-col items-center h-screen">
      <AddNewSnippetDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      {/* list code snippets */}
      <div className="flex flex-col items-center w-full max-w-[600px]">
        <h1 className="text-2xl">Code Snippets</h1>
        {data.data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-screen -mt-20">
            <p className="text-lg">No code snippets found</p>
            <AddNewSnippetDialog
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </div>
        )}
        {data.data.map(
          (snippet: { id: string; name: string; code: string }) => (
            <div
              key={snippet.name}
              className="border-2 border-gray-300 rounded-md p-2 my-2 w-full"
            >
              <h3 className="text-lg font-bold">Name: {snippet.name}</h3>
              <pre>
                {snippet.code.slice(0, 20)}
                <span className="text-sm">..</span>
              </pre>

              <Button
                variant="outline"
                className="mt-2"
                onClick={() => {
                  navigate(`/snippet/${snippet.id}`);
                }}
              >
                View
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function AddNewSnippetDialog({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
}) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mt-4 ml-auto mr-4">
          Add Code Snippet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form method="post">
          <DialogHeader>
            <DialogTitle>Add code snippet</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col my-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              id="name"
              className="border-2 border-gray-300 rounded-md p-2"
            />
            <TextareaAutosize
              name="code"
              placeholder="Code"
              id="code"
              minRows={3}
              maxRows={5}
              className="resize-none border-2 border-gray-300 rounded-md p-2 mt-2"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
