import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="text-2xl underline flex flex-col items-center justify-center h-screen">
      <div>
        <h1 className="underline text-2xl">Hello World</h1>
      </div>
    </div>
  );
}
