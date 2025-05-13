import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
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

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="text-2xl underline flex flex-col items-center h-screen">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4 ml-auto mr-4">
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
    </div>
  );
}
